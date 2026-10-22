import { describe, it, expect } from 'vitest';
import { RsqlParser } from '../../../../src/modules/shared/infrastructure/persistence/repositories/rsql-parser.js';
import { InvalidSearchExpression } from '../../../../src/modules/shared/domain/errors/errors.js';

const parser = new RsqlParser();

describe('RsqlParser', () => {
  it.each([undefined, '', '   '])('returns an empty query for %j', rsql => {
    expect(parser.parse(rsql as string)).toEqual({});
  });

  it.each([
    ['name==Human', { name: 'Human' }],
    ['name!=Human', { name: { $ne: 'Human' } }],
    ['baseHits>10', { baseHits: { $gt: 10 } }],
    ['baseHits>=10', { baseHits: { $gte: 10 } }],
    ['baseHits<10', { baseHits: { $lt: 10 } }],
    ['baseHits<=10', { baseHits: { $lte: 10 } }],
    ['baseHits==-1.5', { baseHits: -1.5 }],
    ['id==race-1', { _id: 'race-1' }],
    ['stats.ag==2', { 'stats.ag': 2 }],
    ['realmId==null', { realmId: null }],
    ['realmId==NULL', { realmId: null }],
    ['realmId!=null', { realmId: { $ne: null, $exists: true } }],
    ['sizeId=in=(small,medium)', { sizeId: { $in: ['small', 'medium'] } }],
    ['baseAt=in=(1,null)', { baseAt: { $in: [1, null] } }],
    ['sizeId=out=(small,medium)', { sizeId: { $nin: ['small', 'medium'] } }],
    ['name=re=lord', { name: { $regex: 'lord', $options: 'i' } }],
  ])('translates %s', (rsql, expected) => {
    expect(parser.parse(rsql)).toEqual(expected);
  });

  it('combines AND and OR, AND binding tighter', () => {
    expect(parser.parse('accessType==public;name==Elf,name==Dwarf')).toEqual({
      $or: [{ $and: [{ accessType: 'public' }, { name: 'Elf' }] }, { name: 'Dwarf' }],
    });
    expect(parser.parse('(name==Elf,name==Dwarf);baseHits>1')).toEqual({
      $and: [{ $or: [{ name: 'Elf' }, { name: 'Dwarf' }] }, { baseHits: { $gt: 1 } }],
    });
  });

  it('escapes =re= values so they match literally', () => {
    expect(parser.parse('name=re="a.b(c)*"')).toEqual({ name: { $regex: 'a\\.b\\(c\\)\\*', $options: 'i' } });
  });

  it.each([
    ['syntax errors', 'name=='],
    ['unknown operators', 'name=like=Elf'],
    ['verbose logic operators', 'name==Elf and name==Dwarf'],
    ['=re= with null', 'name=re=null'],
    ['=re= values longer than 100 characters', `name=re=${'a'.repeat(101)}`],
    ['operator selectors', '$where==sleep'],
    ['selectors with operators inside', 'stats.$gt==1'],
    ['selectors starting with a digit', '1name==Elf'],
  ])('rejects %s', (_, rsql) => {
    expect(() => parser.parse(rsql)).toThrow(InvalidSearchExpression);
  });

  it('accepts =re= values of exactly 100 characters', () => {
    expect(() => parser.parse(`name=re=${'a'.repeat(100)}`)).not.toThrow();
  });
});
