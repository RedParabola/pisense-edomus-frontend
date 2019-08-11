import { ValueInterval } from './interval.model';

/**
 * Model of the thing.
 */
export interface ThingModel {
  /**
   * id of the thing.
   */
  id: string;
  /**
   * custom name
   */
  customName: string;
  /**
   * type of the thing.
   */
  type: ThingModel.ThingType;
  /**
   * model of the thing.
   */
  model: string;
  /**
   * id of the associated room.
   */
  linkedRoomId?: string;
  /**
   * name of the associated room.
   */
  linkedRoomName?: string;
  /**
   * Flag if it is main thing of its linked room.
   */
  flaggedAsMain?: boolean;
  /**
   * Properties depending on the thing type.
   */
  typeProperties: LightModel | AirConditionerModel | SensorModel;
}

/**
 * Model of a draft for a thing.
 */
export interface ThingDraftModel {
  /**
   * custom name
   */
  customName: string;
  /**
   * type of the thing.
   */
  type: ThingModel.ThingType;
  /**
   * model of the thing.
   */
  model: string;
}

/**
 * ThingModel namespace.
 */
export namespace ThingModel {

  export type ThingType = 'LIGHT' | 'AC' | 'HUMIDIFIER' | 'SENSOR';
  export const LIGHT: ThingType = 'LIGHT';
  export const AC: ThingType = 'AC';
  export const HUMIDIFIER: ThingType = 'HUMIDIFIER';
  export const SENSOR: ThingType = 'SENSOR';

  export type PowerStatus = 'ON' | 'OFF' | number;
  export const ON: PowerStatus = 'ON';
  export const OFF: PowerStatus = 'OFF';

}

/**
 * Model for a light thing
 */
export interface LightModel {
  /**
   * Power type
   */
  powerType: LightModel.PowerType;
  /**
   * Power status
   */
  powerStatus: LightModel.PowerStatus;
  /**
   * Power range
   */
  power?: ValueInterval;
  /**
   * Color
   */
  color?: ValueInterval;
}

/**
 * LightModel namespace.
 */
export namespace LightModel {

  export type PowerType = 'BINARY' | 'VARIABLE';
  export const BINARY: PowerType = 'BINARY';
  export const VARIABLE: PowerType = 'VARIABLE';

  export type PowerStatus = 'ON' | 'OFF' | number;
  export const ON: PowerStatus = 'ON';
  export const OFF: PowerStatus = 'OFF';

}

/**
 * Model for an air conditioner thing
 */
export interface AirConditionerModel {
  /**
   * Power status
   */
  powerStatus: AirConditionerModel.PowerStatus;
  /**
   * intensity
   */
  intensity: ValueInterval;
  /**
   * temperature
   */
  temperature: ValueInterval;
}

/**
 * AirConditionerModel namespace.
 */
export namespace AirConditionerModel {

  export type PowerStatus = 'ON' | 'OFF';
  export const ON: PowerStatus = 'ON';
  export const OFF: PowerStatus = 'OFF';

}

/**
 * Model for an humidifier thing
 */
export interface HumidifierModel {
  /**
   * Power status
   */
  powerStatus: HumidifierModel.PowerStatus;
  /**
   * intensity
   */
  intensity: ValueInterval;
  /**
   * water tank level
   */
  waterLevel: ValueInterval;
}

/**
 * HumidifierModel namespace.
 */
export namespace HumidifierModel {

  export type PowerStatus = 'ON' | 'OFF';
  export const ON: PowerStatus = 'ON';
  export const OFF: PowerStatus = 'OFF';

}

/**
 * Model for a sensor thing
 */
export interface SensorModel {
  /**
   * Power status
   */
  powerStatus: AirConditionerModel.PowerStatus;
  /**
   * model-specific measures
   */
  sensorMeasures: any;
}