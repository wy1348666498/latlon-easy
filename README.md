# latlon-easy
## 经纬度工具集合，包含经纬度坐标转换、距离计算等
## 安装
1. npm
    ```
    npm install latlon-easy --save
    ```
2. yarn
    ```
    yarn add latlon-easy
    ```

### 引入

#### ESM

```javascript
import { bd09ToGcj02, getBearing } from "latlon-easy";
```

#### CJS

```javascript
const { bd09ToGcj02, getBearing } = require("latlon-easy");
```

## 使用
## `bd09ToGcj02(longitude, latitude, decimals)`

将百度 BD-09 坐标系的坐标转换为 GCJ-02（火星）坐标系。

- **参数：**
    - `longitude`：BD-09 坐标系中的经度。
    - `latitude`：BD-09 坐标系中的纬度。
    - `decimals`：保留小数位数，默认值为 -1 表示不处理
- **返回值：** 包含 GCJ-02 坐标系中经度和纬度的对象。

---

## `gcj02ToBd09(longitude, latitude, decimals)`

将 GCJ-02（火星）坐标系的坐标转换为百度 BD-09 坐标系。

- **参数：**
    - `longitude`：GCJ-02 坐标系中的经度。
    - `latitude`：GCJ-02 坐标系中的纬度。
    - `decimals`：保留小数位数，默认值为 -1 表示不处理
- **返回值：** 包含 BD-09 坐标系中经度和纬度的对象。

---

## `gcj02ToWgs84(longitude, latitude, decimals)`

将 GCJ-02（火星）坐标系的坐标转换为 WGS-84 坐标系。

- **参数：**
    - `longitude`：GCJ-02 坐标系中的经度。
    - `latitude`：GCJ-02 坐标系中的纬度。
    - `decimals`：保留小数位数，默认值为 -1 表示不处理
- **返回值：** 包含 WGS-84 坐标系中经度和纬度的对象。

---

## `wgs84ToGcj02(longitude, latitude, decimals)`

将 WGS-84 坐标系的坐标转换为 GCJ-02（火星）坐标系。

- **参数：**
    - `longitude`：WGS-84 坐标系中的经度。
    - `latitude`：WGS-84 坐标系中的纬度。
    - `decimals`：保留小数位数，默认值为 -1 表示不处理
- **返回值：** 包含 GCJ-02 坐标系中经度和纬度的对象。

---

## `isLongitude(value, precision)`

验证是否为有效的经度。

- **参数：**
    - `value`：经度值（字符串或数字）。
    - `precision`：精度，默认为0。
- **返回值：** 如果是有效经度返回 `true`，否则返回 `false`。

---

## `isLatitude(value, precision)`

验证是否为有效的纬度。

- **参数：**
    - `value`：纬度值（字符串或数字）。
    - `precision`：精度（小数点后的位数），默认为0。
- **返回值：** 如果是有效纬度返回 `true`，否则返回 `false`。

---

## `isCoordinate(longitude, latitude, precision)`

验证是否为有效的经纬度。

- **参数：**
    - `longitude`：经度值（字符串或数字）。
    - `latitude`：纬度值（字符串或数字）。
    - `precision`：精度，默认为0。
- **返回值：** 如果是有效经纬度返回 `true`，否则返回 `false`。

---

## `isPointInPolygon(point, polygon, mode, tolerance)`

判断一个点是否在多边形内部或边上。

- **参数：**
    - `point`：点的经纬度对象 `{ longitude, latitude }`。
    - `polygon`：多边形的经纬度点集合数组。
    - `mode`：模式，可选值为 `'insert'`（内部）、`'border'`（边上）、`'insert-border'`（内部或边上），默认为 `'insert-border'`。
    - `tolerance`：容差，默认为 `1e-9`。
- **返回值：** 如果点满足条件则返回 `true`，否则返回 `false`。

---

## `getDistance(startPoint, endPoint)`

计算两点之间的直线距离。

- **参数：**
    - `startPoint`：起点的经纬度对象 `{ longitude, latitude }`。
    - `endPoint`：终点的经纬度对象 `{ longitude, latitude }`。
- **返回值：** 两点之间的直线距离（单位：米）。

---

## `getBearing(point1, point2)`

计算两个点之间的方位角。

- **参数：**
    - `point1`：起点的经纬度对象 `{ longitude, latitude }`。
    - `point2`：终点的经纬度对象 `{ longitude, latitude }`。
- **返回值：** 方位角（单位：度）。



