// Finds the decorators that compile with tsc but break the app when SWC builds it (F-receta-02, F-receta-25). Neither
// the lint nor the typecheck sees them: only booting the AppModule does.
//
// 1. @Prop / @ApiProperty / @ApiPropertyOptional on a property typed with an alias or a union (`Alias`,
//    `string | null`) that tsc serializes as String, Number or Boolean, with no explicit `type` in the decorator.
//    SWC emits Object (or nothing), and Mongoose fails with `Cannot determine a type for the "X" field`.
// 2. @Inject() without a token: tsc falls back to the parameter type, SWC does not, and Nest cannot resolve it.
//
// Usage: node scripts/check-swc-metadata.cjs [repoRoot] [--fix]. --fix adds `type: X` to the decorators of 1.
// Exits with 1 when it finds any.
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv.slice(2).find(arg => !arg.startsWith('--')) ?? '.');
const fix = process.argv.includes('--fix');
const ts = require(require.resolve('typescript', { paths: [root] }));

const cfg = ts.getParsedCommandLineOfConfigFile(
  path.join(root, 'tsconfig.json'),
  {},
  { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
);
const files = cfg.fileNames.filter(f => f.includes(`${path.sep}src${path.sep}`));
const program = ts.createProgram(files, cfg.options);
const checker = program.getTypeChecker();
const TYPED = new Set(['Prop', 'ApiProperty', 'ApiPropertyOptional']);

const primitive = type => {
  const parts = type.isUnion() ? type.types : [type];
  const kept = parts.filter(p => !(p.flags & (ts.TypeFlags.Null | ts.TypeFlags.Undefined)));
  if (!kept.length) return null;
  const kinds = new Set(
    kept.map(p =>
      p.flags & ts.TypeFlags.StringLike
        ? 'String'
        : p.flags & ts.TypeFlags.NumberLike
          ? 'Number'
          : p.flags & ts.TypeFlags.BooleanLike
            ? 'Boolean'
            : 'other',
    ),
  );
  return kinds.size === 1 && !kinds.has('other') ? [...kinds][0] : null;
};

const decoratorName = (d, sf) => (ts.isCallExpression(d.expression) ? d.expression.expression.getText(sf) : undefined);
const where = (sf, node) => `${path.relative(root, sf.fileName)}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`;

let count = 0;
const edits = new Map();
for (const sf of program.getSourceFiles()) {
  if (!files.includes(sf.fileName)) continue;
  const visit = node => {
    const decorators = ts.canHaveDecorators(node) ? (ts.getDecorators(node) ?? []) : [];

    // 2. @Inject() without a token, on a constructor parameter or a property.
    for (const d of decorators) {
      if (decoratorName(d, sf) === 'Inject' && d.expression.arguments.length === 0) {
        console.log(`${where(sf, d)} @Inject() without a token: pass the token (a Symbol or the class)`);
        count++;
      }
    }

    // 1. A primitive alias or union without an explicit type.
    if (ts.isPropertyDeclaration(node) && node.type) {
      const typed = decorators.filter(d => TYPED.has(decoratorName(d, sf)));
      const keyword = [ts.SyntaxKind.StringKeyword, ts.SyntaxKind.NumberKeyword, ts.SyntaxKind.BooleanKeyword].includes(node.type.kind);
      const kind = typed.length && !keyword ? primitive(checker.getTypeFromTypeNode(node.type)) : null;
      for (const d of kind ? typed : []) {
        const arg = d.expression.arguments[0];
        // `enum` also gives Swagger the type.
        const hasType =
          arg && ts.isObjectLiteralExpression(arg) && arg.properties.some(p => p.name && ['type', 'enum'].includes(p.name.getText(sf)));
        if (hasType) continue;
        console.log(`${where(sf, node)} @${decoratorName(d, sf)} ${node.name.getText(sf)}: ${node.type.getText(sf)} needs type: ${kind}`);
        count++;
        if (fix) {
          const list = edits.get(sf.fileName) ?? [];
          if (!arg) list.push({ pos: d.expression.arguments.pos, text: `{ type: ${kind} }` });
          else if (ts.isObjectLiteralExpression(arg))
            list.push({ pos: arg.getStart(sf) + 1, text: arg.properties.length ? ` type: ${kind},` : ` type: ${kind} ` });
          edits.set(sf.fileName, list);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

for (const [file, list] of edits) {
  let text = fs.readFileSync(file, 'utf8');
  for (const e of list.sort((a, b) => b.pos - a.pos)) text = text.slice(0, e.pos) + e.text + text.slice(e.pos);
  fs.writeFileSync(file, text);
}

if (count > 0) {
  console.error(`${count} decorators SWC cannot compile like tsc${fix ? ' (types added; @Inject() needs a manual fix)' : ''}`);
  process.exit(fix && edits.size > 0 && [...edits.values()].flat().length === count ? 0 : 1);
}
console.log('SWC metadata check: no problems found');
