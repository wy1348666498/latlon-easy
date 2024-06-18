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
## 使用
### 经纬度坐标转换
```javascript
import { bd09ToGcj02, gcj02ToBd09, gcj02ToWgs84, wgs84ToGcj02 } from 'latlon-easy'
// WGS84转GCJ02
const gcj02 = wgs84ToGcj02(116.404, 39.915)
// GCJ02转WGS84
const wgs84 = gcj02ToWgs84(116.404, 39.915)
// GCJ02转BD09
const bd09 = gcj02ToBd09(116.404, 39.915)
// BD09转GCJ02
const gcj02 = bd09ToGcj02(116.404, 39.915)
```

### 距离计算
```javascript
import { getDistance } from 'latlon-easy'
// 两点间距离
const distance = getDistance(116.404, 39.915, 116.405, 39.916)
```

### 验证经度是否正确
```javascript
import { isLongitude } from 'latlon-easy'
// 验证经度是否正确
const isLongitude = isLongitude(116.404)
```
### 验证纬度是否正确
```javascript
import { isLatitude } from 'latlon-easy'
// 验证纬度是否正确
const isLatitude = isLatitude(39.915)
```

### 验证经纬度是否正确
```javascript
import { isCoordinate } from 'latlon-easy'
// 验证经纬度是否正确
const isCoordinate = isCoordinate(116.404, 39.915)
```

### 验证一个点是否在规划的区域内
```javascript
import { isPointInPolygon } from 'latlon-easy'
// 验证一个点是否在规划的区域内
const isPointInPolygon = isPointInPolygon(116.404, 39.915, [[116.404, 39.915], [116.405, 39.916], [116.406, 39.917]])
```


