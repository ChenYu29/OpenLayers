/**
 *@description 简单的地图展示
 *@author cy
 *@date 2022-07-29 10:28
 **/
import React, { useEffect } from 'react';
import { Card, Row } from 'antd';
import { myCardProps } from '@utils/CommonFunc';
import Map from 'ol/Map';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { transform } from 'ol/proj';

let map = null;
const SimpleMap = () => {
  useEffect(() => {
    map = new Map({
      // 添加操作按钮
      controls: defaultControls().extend([
        new FullScreen({ source: 'simpleFullMap' }), // 全屏
      ]),
      layers: [
        // 地图数据源
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'simpleMap',
      view: new View({
        /**
         * [112.3303986, 16.9504106] 经纬度
         * 投影projection有2种
         * 'EPSG:4326' 全球通用  被转换的坐标系
         * EPSG:3857 web地图专用 openlayers默认的   需要被转换的坐标系
         */
        // center: transform([113.307649675, 23.1200491021], 'EPSG:4326', 'EPSG:3857'),
        center: transform([114.419, 11.415], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10,
      }),
    });
  }, []);
  return (
    <Card {...myCardProps('简单的地图展示')} style={{ width: '100%', height: '100%' }}>
      <Row id="simpleFullMap" className="fullscreen" wrap={false} style={{ width: '100%', height: 'calc(100vh - 200px)' }}>
        <div id="simpleMap" className="mymap" style={{ width: '100%', height: '100%' }}></div>
      </Row>
    </Card>
  );
};
export default SimpleMap;