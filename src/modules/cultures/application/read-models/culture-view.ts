import { Culture } from 'src/modules/cultures/domain/aggregates/culture';

/** Culture plus the values computed when it is read. */
export interface CultureView {
  culture: Culture;
  /** Indicative development cost of the culture ranks (Core Law §12.6). */
  developmentCost: number;
}
