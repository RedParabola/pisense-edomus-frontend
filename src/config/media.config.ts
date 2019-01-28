import { ResponsiveConfig } from 'ng2-responsive';

/**
 *  Screen Media breakpoints to MediaService.
 */
export type MediaConfig = {
  [breakpoint: string]: number
}

/**
 * Breakpoints values used on the MediaService.
 */
export const mediaConfig: MediaConfig = {
  XS: 0,
  MD: 992,//600,
  LG: 1280
};

/**
 * Breakpoint for the responsive external library.
 */
const reponsiveConfig = {
  breakPoints: {
    xs: { max: 479 },
    sm: { min: 480, max: 991 },
    md: { min: 992, max: 1279 },
    lg: { min: 1280, max: 9999 },
    xl: { min: 10000 }
  },
  debounceTime: 100
};

/**
 * Export the responsive configuration.
 */
export function ResponsiveDefinition() {
  return new ResponsiveConfig(reponsiveConfig);
};