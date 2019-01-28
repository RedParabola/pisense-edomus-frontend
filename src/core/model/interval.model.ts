/**
 * Interface for a value interval, with current, default and range values
 */
export interface ValueInterval {
  /**
   * current value
   */
  currentValue: number;
  /**
   * default value
   */
  defaultValue: number;
  /**
   * range min value
   */
  rangeMin: number;
  /**
   * range max value
   */
  rangeMax: number;
  /**
   * interval step
   */
  step: number;
}