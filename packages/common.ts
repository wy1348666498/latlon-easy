export interface PositionLatLng {
    latitude: number;
    longitude: number;
}

/**
 * @description 地球半径 单位：米
 */
export const EARTH_RADIUS = 6378245.0;

/**
 * @description π 圆周率
 */
export const PI = Math.PI;

/**
 * @description EE 椭球的偏心率
 */
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export const EE = 0.00669342162296594323;
