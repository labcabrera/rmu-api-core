import { AddCultureSkillRankCommand } from 'src/modules/cultures/application/cqrs/commands/add-culture-skill-rank.command';
import { CultureSkillRankDto } from './culture-skill-rank.dto';

export class AddCultureSkillRankDto extends CultureSkillRankDto {
  static toCommand(cultureId: string, dto: AddCultureSkillRankDto, userId: string, roles: string[]): AddCultureSkillRankCommand {
    return new AddCultureSkillRankCommand(cultureId, CultureSkillRankDto.toProps(dto), userId, roles);
  }
}
