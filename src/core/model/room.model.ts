import { ThingModel } from './thing.model';

/**
 * Model of the room.
 */
export interface RoomModel {
  /**
   * id.
   */
  id: string;
  /**
   * custom name
   */
  customName: string;
  /**
   * type of room.
   */
  type: RoomModel.RoomType;
  /**
   * list of things in the room.
   */
  things: Array<string | ThingModel>;
  /**
   * list of main things for each type.
   */
  mainThingsId: {
    LIGHT?: string;
    AC?: string;
    HUMIDIFIER?: string;
    SENSOR?: string;
  }
  /**
   * Object containing all the possible measures of the things linked to the given room.
   */
  sensorMeasures: any;
}

/**
 * Model of a draft for a room.
 */
export interface RoomDraftModel {

  /**
   * custom name
   */
  customName: string;
  /**
   * type of room.
   */
  type: RoomModel.RoomType;

}

/**
 * RoomModel namespace.
 */
export namespace RoomModel {

  export type RoomType = 'BASEMENT' | 'BATHROOM' | 'BEDROOM' | 'LOUNGE' | 'KITCHEN' | 'OFFICE' | 'PORCH' | 'BACKYARD' | 'OTHER';
  export const BASEMENT: RoomType = 'BASEMENT';
  export const BATHROOM: RoomType = 'BATHROOM';
  export const BEDROOM: RoomType = 'BEDROOM';
  export const LOUNGE: RoomType = 'LOUNGE';
  export const KITCHEN: RoomType = 'KITCHEN';
  export const OFFICE: RoomType = 'OFFICE';
  export const PORCH: RoomType = 'PORCH';
  export const BACKYARD: RoomType = 'BACKYARD';
  export const OTHER: RoomType = 'OTHER';

}