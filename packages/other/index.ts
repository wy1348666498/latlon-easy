import { EARTH_RADIUS, PI, type PositionLatLng } from '@/common';

/**
 * @description 验证是否是经度
 * @param value 经度
 * @return boolean
 */
export function isLongitude(value: string | number): boolean {
    return Number(value) >= -180 && Number(value) <= 180;
}

/**
 * @description 验证是否是纬度
 * @param value 纬度
 * @return boolean
 */
export function isLatitude(value: string | number): boolean {
    return Number(value) >= -90 && Number(value) <= 90;
}

/**
 * @description 验证是否是正确的经纬度
 * @param longitude 经度
 * @param latitude 纬度
 * @return boolean
 */
export function isCoordinate(longitude: string | number, latitude: string | number): boolean {
    return isLatitude(latitude) && isLongitude(longitude);
}

/**
 * @description 判断一个点的经纬度是否在规划的区域内
 * @param point 点的经纬度
 * @param polygon 多边形的经纬度集合
 * @return boolean
 */
export function isPointInPolygon(point: PositionLatLng, polygon: PositionLatLng[]): boolean {
    const tolerance: number = 1e-9;
    const { latitude: lat, longitude: lng } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const { longitude: xi, latitude: yi } = polygon[i];
        const { longitude: xj, latitude: yj } = polygon[j];

        // 判断是否在多边形边上
        const crossProduct = (lng - xi) * (yj - yi) - (lat - yi) * (xj - xi);
        if (Math.abs(crossProduct) <= tolerance) {
            const dotProduct = (lng - xi) * (xj - xi) + (lat - yi) * (yj - yi);
            if (dotProduct >= 0) {
                const squaredLength = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi);
                if (dotProduct <= squaredLength) {
                    return true;
                }
            }
        }

        // 判断是否在多边形内部
        const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * @description 获取两点之间的直线距离
 * @param startPoint
 * @param endPoint
 * @returns {number} 距离 单位：米
 */
export function getDistance(startPoint: PositionLatLng, endPoint: PositionLatLng): number {
    const radLat1 = (startPoint.latitude * PI) / 180.0;
    const radLat2 = (endPoint.latitude * PI) / 180.0;
    const a = radLat1 - radLat2;
    const b = (startPoint.longitude * PI) / 180.0 - (endPoint.longitude * PI) / 180.0;
    const s =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
            )
        );
    return s * EARTH_RADIUS;
}
