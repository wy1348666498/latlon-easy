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

/**
 * 截取数字到指定的小数位数，不进行四舍五入
 * @param value 需要处理的数字
 * @param decimals 小数位数
 * @returns 处理后的数字
 */
export function truncateDecimals(value: number, decimals: number): number {
    if (decimals < 0) {
        return value;
    }
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
}
