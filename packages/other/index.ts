import { EARTH_RADIUS, PI, type PositionLatLng } from '@/common';

/**
 * @description 验证是否是经度
 * @param value 经度
 * @param precision 精度，默认为0
 * @return boolean 如果是有效经度返回true，否则返回false
 */
export function isLongitude(
    value: string | number | undefined | null,
    precision: number = 0
): boolean {
    if (value === undefined || value === null || value === '') {
        return false; // 处理 undefined、null 或空字符串的情况
    }
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
        return false; // 非数值情况
    }
    if (parsedValue < -180 || parsedValue > 180) {
        return false; // 经度范围不合法
    }

    // 转换为字符串并验证小数位数
    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');
    let nPrecision = Number(precision) || 0;
    nPrecision = nPrecision > 0 ? nPrecision : 0;
    if (decimalIndex === -1) {
        return nPrecision === 0; // 没有小数点时，只有当精度为0时返回true
    }

    const decimalPlaces = valueStr.length - decimalIndex - 1;
    return decimalPlaces >= nPrecision; // 小数位数是否符合要求
}

/**
 * @description 验证是否是纬度
 * @param value 纬度
 * @param precision 精度(至少几位小数)，默认为0
 * @return boolean 如果是有效纬度返回true，否则返回false
 */
export function isLatitude(
    value: string | number | undefined | null,
    precision: number = 0
): boolean {
    if (value === undefined || value === null || value === '') {
        return false; // 处理 undefined、null 或空字符串的情况
    }
    const parsedValue = Number(value);
    if (isNaN(parsedValue)) {
        return false; // 非数值情况
    }
    if (parsedValue < -90 || parsedValue > 90) {
        return false; // 纬度范围不合法
    }

    // 转换为字符串并验证小数位数
    const valueStr = value.toString();
    const decimalIndex = valueStr.indexOf('.');
    let nPrecision = Number(precision) || 0;
    nPrecision = nPrecision > 0 ? nPrecision : 0;
    if (decimalIndex === -1) {
        return nPrecision === 0; // 没有小数点时，只有当精度为0时返回true
    }

    const decimalPlaces = valueStr.length - decimalIndex - 1;
    return decimalPlaces >= nPrecision; // 小数位数是否符合要求
}

/**
 * @description 验证是否是正确的经纬度
 * @param longitude 经度
 * @param latitude 纬度
 * @param precision 精度，默认为0
 * @return boolean 如果是有效经纬度返回true，否则返回false
 */
export function isCoordinate(
    longitude: string | number,
    latitude: string | number,
    precision: number = 0
): boolean {
    return isLatitude(latitude, precision) && isLongitude(longitude, precision);
}

/**
 * @description 判断一个点的经纬度是否在规划的区域内
 * @param point 点的经纬度
 * @param polygon 多边形的经纬度集合
 * @param mode 模式 insert: 判断是否在多边形内部 border: 判断是否在多边形边上 insert-border: 判断是否在多边形内部或边上 默认 insert-border
 * @param tolerance 容差
 * @return boolean 如果满足则返回true，否则返回false
 */
export function isPointInPolygon(
    point: PositionLatLng,
    polygon: PositionLatLng[],
    mode: 'insert' | 'border' | 'insert-border' = 'insert-border',
    tolerance: number = 1e-9
): boolean {
    const { latitude: lat, longitude: lng } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const { longitude: xi, latitude: yi } = polygon[i];
        const { longitude: xj, latitude: yj } = polygon[j];

        if (['border', 'insert-border'].includes(mode)) {
            // 判断是否在多边形边上
            const crossProduct = (lng - xi) * (yj - yi) - (lat - yi) * (xj - xi);
            if (Math.abs(crossProduct) <= tolerance) {
                const dotProduct = (lng - xi) * (xj - xi) + (lat - yi) * (yj - yi);
                if (dotProduct >= 0) {
                    const squaredLength = (xj - xi) * (xj - xi) + (yj - yi) * (yj - yi);
                    if (dotProduct <= squaredLength) {
                        return true; // 如果在边上直接返回true
                    }
                }
            }
        }

        if (['insert', 'insert-border'].includes(mode)) {
            // 判断是否在多边形内部
            const intersect =
                yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }
    }

    if (mode === 'border') return false; // 如果模式是border, 没有在边上则返回false
    return inside; // insert或insert-border模式根据inside的值返回结果
}

/**
 * @description 获取两点之间的直线距离
 * @param startPoint 起点的经纬度
 * @param endPoint 终点的经纬度
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
