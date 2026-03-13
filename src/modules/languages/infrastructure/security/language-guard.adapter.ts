import { Injectable } from '@nestjs/common';
import { BaseEntityGuard } from 'src/modules/shared/infrastructure/security/base-entity-guard';
import { Language } from '../../domain/aggregates/language';
import { LanguageGuardPort } from '../../application/ports/language-guard.port';

@Injectable()
export class LanguageGuardAdapter extends BaseEntityGuard<Language> implements LanguageGuardPort {}
