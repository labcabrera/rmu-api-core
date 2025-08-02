export const TYPES = {
  // Repositories
  RaceRepository: Symbol.for('RaceRepository'),
  RealmRepository: Symbol.for('RealmRepository'),
  SkillRepository: Symbol.for('SkillRepository'),
  SkillCategoryRepository: Symbol.for('SkillCategoryRepository'),
  CharacterSizeRepository: Symbol.for('CharacterSizeRepository'),
  ArmorTypeRepository: Symbol.for('ArmorTypeRepository'),

  // Services
  RaceService: Symbol.for('RaceService'),
  RealmService: Symbol.for('RealmService'),
  SkillService: Symbol.for('SkillService'),
  SkillCategoryService: Symbol.for('SkillCategoryService'),
  CharacterSizeService: Symbol.for('CharacterSizeService'),
  ArmorTypeService: Symbol.for('ArmorTypeService'),

  // Controllers
  RaceController: Symbol.for('RaceController'),
  RealmController: Symbol.for('RealmController'),

  // Database
  DatabaseConnection: Symbol.for('DatabaseConnection'),
};
