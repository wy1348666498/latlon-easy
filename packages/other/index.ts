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
