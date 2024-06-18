import { EARTH_RADIUS, PI, EE, type PositionLatLng } from '@/common';

/**
 * 火星坐标系 - GCJ-02 地球坐标系 - WGS84 百度坐标系 - BD-09
 */

// 定义一些常量
const xPI = (PI * 3000.0) / 180.0;

/**
 * @description 经度转换
 * @param longitude
 * @param latitude
 */
function transformLat(longitude: string | number, latitude: string | number): number {
    const lat = Number(latitude);
    const lng = Number(longitude);
    let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
}

/**
 * @description 纬度转换
 * @param longitude
 * @param latitude
 */
function transformLng(longitude: string | number, latitude: string | number): number {
    const lat = Number(latitude);
    const lng = Number(longitude);
    let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
    ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
    ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
}

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
 * 即 百度 转 谷歌、高德
 * @returns PositionLatLng
 * @param longitude 经度
 * @param latitude 纬度
 */
export function bd09ToGcj02(longitude: string | number, latitude: string | number): PositionLatLng {
    const lng = Number(longitude);
    const lat = Number(latitude);
    const x = lng - 0.0065;
    const y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
    const gcLng = z * Math.cos(theta);
    const gcLat = z * Math.sin(theta);
    return { longitude: gcLng, latitude: gcLat };
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即 谷歌、高德 转 百度
 * @returns PositionLatLng
 * @param longitude 经度
 * @param latitude 纬度
 */
export function gcj02ToBd09(longitude: string | number, latitude: string | number): PositionLatLng {
    const lng = Number(longitude);
    const lat = Number(latitude);
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI);
    const bdLng = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006;
    return { longitude: bdLng, latitude: bdLat };
}

/**
 * @description GCJ-02 转换为 WGS-84 只有中国大陆的坐标才需要调用此方法
 * @returns PositionLatLng
 * @param longitude 经度
 * @param latitude 纬度
 */
export function gcj02ToWgs84(
    longitude: string | number,
    latitude: string | number
): PositionLatLng {
    const lat = Number(latitude);
    const lng = Number(longitude);
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((EARTH_RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
    dLng = (dLng * 180.0) / ((EARTH_RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
    return { longitude: lng * 2 - (lng + dLng), latitude: lat * 2 - (lat + dLat) };
}

/**
 * @description WGS-84 转 GCJ-02 只有中国大陆的坐标才需要调用此方法
 * @returns PositionLatLng
 * @param longitude 经度
 * @param latitude 纬度
 */
export function wgs84ToGcj02(
    longitude: string | number,
    latitude: string | number
): PositionLatLng {
    const lat = Number(latitude);
    const lng = Number(longitude);
    let dLat = transformLat(lng - 105.0, lat - 35.0);
    let dLng = transformLng(lng - 105.0, lat - 35.0);
    const radLat = (lat / 180.0) * PI;
    let magic = Math.sin(radLat);
    magic = 1 - EE * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / (((EARTH_RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
    dLng = (dLng * 180.0) / ((EARTH_RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
    return { longitude: lng + dLng, latitude: lat + dLat };
}
