import { ARMOR_TYPES } from 'src/modules/armor-types/domain/entities/armor-type';

describe('ARMOR_TYPES', () => {
  it('defines the armor catalog from none to plate in id order', () => {
    expect(ARMOR_TYPES).toEqual([
      { id: 1, name: 'None' },
      { id: 2, name: 'Heavy Cloth' },
      { id: 3, name: 'Soft Leather' },
      { id: 4, name: 'Hide Scale' },
      { id: 5, name: 'Laminar' },
      { id: 6, name: 'Rigid Leather' },
      { id: 7, name: 'Metal Scale' },
      { id: 8, name: 'Mail' },
      { id: 9, name: 'Brigandine' },
      { id: 10, name: 'Plate' },
    ]);
  });

  it('does not contain duplicate ids or names', () => {
    expect(new Set(ARMOR_TYPES.map(armorType => armorType.id)).size).toBe(ARMOR_TYPES.length);
    expect(new Set(ARMOR_TYPES.map(armorType => armorType.name)).size).toBe(ARMOR_TYPES.length);
  });
});
