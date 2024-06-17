import { EARTH_RADIUS, PI, type PositionLatLng } from '@/common';

/**
 * @description 验证是否是经度
 */
export function isLongitude(value: string | number): boolean {
    return /^-?((180(\.0{1,6})?)|(((1[0-7]\d)|(\d{1,2}))(\.\d{1,6})?))$/.test(String(value));
}

/**
 * @description 验证是否是纬度
 */
export function isLatitude(value: string | number): boolean {
    return /^-?((90(\.0{1,6})?)|((([0-8]\d)|(\d))(\.\d{1,6})?))$/.test(String(value));
}

/**
 * @description 验证是否是正确的经纬度
 */
export function isCoordinate(longitude: string | number, latitude: string | number): boolean {
    return isLatitude(latitude) && isLongitude(longitude);
}

/**
 * @description 判断一个点的经纬度是否在规划的区域内
 */
export function isPointInPolygon(point: PositionLatLng, region: PositionLatLng[]) {
    const pts = region;
    const p = point;
    const N = pts.length; // 多边形的点数
    const boundOrVertex = true; // 如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
    let intersectCount = 0;
    const precision = 2e-10; // 浮点类型计算时候与0比较时候的容差
    let p1, p2;
    p1 = pts[0];
    for (let i = 1; i <= N; ++i) {
        if (p.latitude === p1.latitude && p.longitude === p1.longitude) {
            return boundOrVertex;
        }
        p2 = pts[i % N];
        if (
            p.latitude < Math.min(p1.latitude, p2.latitude) ||
            p.latitude > Math.max(p1.latitude, p2.latitude)
        ) {
            p1 = p2;
            continue;
        }
        if (
            p.latitude > Math.min(p1.latitude, p2.latitude) &&
            p.latitude < Math.max(p1.latitude, p2.latitude)
        ) {
            if (p.longitude <= Math.max(p1.longitude, p2.longitude)) {
                if (
                    p1.latitude === p2.latitude &&
                    p.longitude >= Math.min(p1.longitude, p2.longitude)
                ) {
                    return boundOrVertex;
                }
                if (p1.longitude === p2.longitude) {
                    if (p1.longitude === p.longitude) {
                        return boundOrVertex;
                    } else {
                        ++intersectCount;
                    }
                } else {
                    const xInters =
                        ((p.latitude - p1.latitude) * (p2.longitude - p1.longitude)) /
                            (p2.latitude - p1.latitude) +
                        p1.longitude;
                    if (Math.abs(p.longitude - xInters) < precision) {
                        return boundOrVertex;
                    }
                    if (p.longitude < xInters) {
                        ++intersectCount;
                    }
                }
            }
        } else {
            if (p.latitude === p2.latitude && p.longitude <= p2.longitude) {
                const p3 = pts[(i + 1) % N];
                if (
                    p.latitude >= Math.min(p1.latitude, p3.latitude) &&
                    p.latitude <= Math.max(p1.latitude, p3.latitude)
                ) {
                    ++intersectCount;
                } else {
                    intersectCount += 2;
                }
            }
        }
        p1 = p2;
    }
    return intersectCount % 2 !== 0;
}

/**
 * @description 判断两点之间的直线距离
 * @param startPoint
 * @param endPoint
 * @returns {number} 距离 单位：米
 */
export function getDistance(startPoint: PositionLatLng, endPoint: PositionLatLng): number {
    const radLat1 = (startPoint.latitude * PI) / 180.0;
    const radLat2 = (endPoint.latitude * PI) / 180.0;
    const a = radLat1 - radLat2;
    const b = (startPoint.longitude * PI) / 180.0 - (endPoint.longitude * PI) / 180.0;
    let s =
        2 *
        Math.asin(
            Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) +
                    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
            )
        );
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}
