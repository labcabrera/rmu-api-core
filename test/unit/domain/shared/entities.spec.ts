import { CHARACTER_SIZES } from 'src/modules/shared/domain/entities/character-size';
import { KeyValue } from 'src/modules/shared/domain/entities/key-value';
import { NamedEntity } from 'src/modules/shared/domain/entities/named-entity';
import { Page, Pagination } from 'src/modules/shared/domain/entities/page';
import { RMU_ADMIN, RMU_USER } from 'src/modules/shared/domain/entities/user-roles';

describe('shared domain entities', () => {
  it('keeps key-value pairs immutable through readonly constructor fields', () => {
    const entity = new KeyValue('strength', 90);

    expect(entity.key).toBe('strength');
    expect(entity.value).toBe(90);
  });

  it('keeps named entity identity and display name', () => {
    const entity = new NamedEntity('id-1', 'Common');

    expect(entity.id).toBe('id-1');
    expect(entity.name).toBe('Common');
  });

  it('calculates pagination metadata from totals and page size', () => {
    const page = new Page(['a', 'b'], 2, 2, 5);

    expect(page.content).toEqual(['a', 'b']);
    expect(page.pagination).toEqual(new Pagination(2, 2, 5, 3));
  });

  it('returns zero pages when there are no elements', () => {
    const page = new Page([], 1, 10, 0);

    expect(page.pagination.totalPages).toBe(0);
  });

  it('exposes the expected user role constants', () => {
    expect(RMU_ADMIN).toBe('rmu-admin');
    expect(RMU_USER).toBe('rmu-user');
  });

  it('defines character sizes in ascending index order with medium as neutral multiplier', () => {
    expect(CHARACTER_SIZES).toHaveLength(10);
    expect(CHARACTER_SIZES.map(size => size.index)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(CHARACTER_SIZES.find(size => size.id === 'medium')).toMatchObject({
      name: 'Medium',
      hitMultiplier: 1,
    });
  });
});
