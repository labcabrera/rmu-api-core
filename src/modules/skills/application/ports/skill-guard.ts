export interface SkillGuardPort {
  checkSkillCreation(userId: string, userRoles: string[]);
}
