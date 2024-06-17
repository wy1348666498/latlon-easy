import { isPointInPolygon } from '@/other';
// eslint-disable-next-line import/extensions
import chinaJson from '@/china.json';
import { EARTH_RADIUS, PI, type PositionLatLng } from '@/common';

/**
 * 火星坐标系 - GCJ-02 地球坐标系 - WGS84 百度坐标系 - BD-09
 */

// 定义一些常量
const xPI = (PI * 3000.0) / 180.0;
// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
const ee = 0.00669342162296594323;

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
 * @description 判断是否在国内，不在国内则不做偏移
 * @param longitude
 * @param latitude
 * @returns {boolean}
 */
function outOfChina(longitude: string | number, latitude: string | number): boolean {
    const lat = Number(latitude);
    const lng = Number(longitude);
    const regionAll = chinaJson.features[0].geometry.coordinates;

    for (let i = 0; i < regionAll.length; i++) {
        const region = regionAll[i];
        for (let j = 0; j < region.length; j++) {
            const path = region[j];
            if (
                isPointInPolygon(
                    { latitude: lat, longitude: lng },
                    path.map(e => ({ latitude: e[1], longitude: e[0] }))
                )
            ) {
                return false;
            }
        }
    }
    return false;
}

/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02) 的转换
 * 即 百度 转 谷歌、高德
 * @returns {*[]}
 * @param bdLongitude
 * @param bdLatitude
 */
export function bd09ToGcj02(
    bdLongitude: string | number,
    bdLatitude: string | number
): PositionLatLng {
    const bdLng = Number(bdLongitude);
    const bdLat = Number(bdLatitude);
    const x = bdLng - 0.0065;
    const y = bdLat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
    const gcLng = z * Math.cos(theta);
    const gcLat = z * Math.sin(theta);
    return {
        longitude: gcLng,
        latitude: gcLat,
    };
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即 谷歌、高德 转 百度
 * @param gcLongitude
 * @param gcLatitude
 * @returns {*[]}
 */
export function gcj02ToBd09(
    gcLongitude: string | number,
    gcLatitude: string | number
): PositionLatLng {
    const gcLng = Number(gcLongitude);
    const gcLat = Number(gcLatitude);
    const z = Math.sqrt(gcLng * gcLng + gcLat * gcLat) + 0.00002 * Math.sin(gcLat * xPI);
    const theta = Math.atan2(gcLat, gcLng) + 0.000003 * Math.cos(gcLng * xPI);
    const bdLng = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006;
    return {
        longitude: bdLng,
        latitude: bdLat,
    };
}

/**
 * GCJ-02 转换为 WGS-84
 * @returns {*[]}
 * @param gcLongitude
 * @param gcLatitude
 */
export function gcj02ToWgs84(
    gcLongitude: string | number,
    gcLatitude: string | number
): PositionLatLng {
    const lat = Number(gcLatitude);
    const lng = Number(gcLongitude);
    if (outOfChina(lng, lat)) {
        return {
            longitude: lng,
            latitude: lat,
        };
    } else {
        let dlat = transformLat(lng - 105.0, lat - 35.0);
        let dlng = transformLng(lng - 105.0, lat - 35.0);
        const radlat = (lat / 180.0) * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((EARTH_RADIUS * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((EARTH_RADIUS / sqrtmagic) * Math.cos(radlat) * PI);
        const nlat = lat + dlat;
        const nlng = lng + dlng;
        return {
            longitude: lng * 2 - nlng,
            latitude: lat * 2 - nlat,
        };
    }
}

/**
 * WGS-84 转 GCJ-02
 * @returns {*[]}
 * @param wgLongitude
 * @param wgLatitude
 */
export function wgs84ToGcj02(
    wgLongitude: string | number,
    wgLatitude: string | number
): PositionLatLng {
    const lat = Number(wgLatitude);
    const lng = Number(wgLongitude);
    if (outOfChina(lng, lat)) {
        return {
            longitude: lng,
            latitude: lat,
        };
    } else {
        let dlat = transformLat(lng - 105.0, lat - 35.0);
        let dlng = transformLng(lng - 105.0, lat - 35.0);
        const radlat = (lat / 180.0) * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((EARTH_RADIUS * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((EARTH_RADIUS / sqrtmagic) * Math.cos(radlat) * PI);
        const jclat = lat + dlat;
        const jclng = lng + dlng;
        return {
            longitude: jclat,
            latitude: jclng,
        };
    }
}
