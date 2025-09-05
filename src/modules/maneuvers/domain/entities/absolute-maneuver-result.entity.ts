export type AbsoluteManeuverResultType = 'absolute_failure' | 'failure' | 'partial_success' | 'success' | 'absolute_success';

export interface AbsoluteManeuverResult {
  result: AbsoluteManeuverResultType;
  message: string;
}
