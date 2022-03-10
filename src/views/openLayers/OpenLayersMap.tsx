/**
 *@description
 *@author cy
 *@date 2022-02-25 17:03
 **/
import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { Button, Radio, Row, Space, Typography } from 'antd';
import { Draw, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { FullScreen, defaults as defaultControls, MousePosition } from 'ol/control';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction';
import { createStringXY } from 'ol/coordinate';
import { GeoJSON } from 'ol/format';
import { Circle, Geometry, GeometryCollection, Point, Polygon } from 'ol/geom';
import { toLonLat, transform } from 'ol/proj';
import { Feature } from 'ol';
import { circular, fromCircle } from 'ol/geom/Polygon';
import { getDistance } from 'ol/sphere';
import { Fill, Stroke, Style } from 'ol/style';
const { Text } = Typography;

enum EDrawType {
  Point = 'Point',
  LineString = 'LineString',
  LinearRing = 'LinearRing',
  Polygon = 'Polygon',
  MultiPoint = 'MultiPoint',
  MultiLineString = 'MultiLineString',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection',
  Circle = 'Circle'
}
let draw = null;
let map = null;
let snap = null;
let source = null;
const geometryJson = require('./geometry.json');
const OpenLayersMap = () => {
  const [drawType, setDrawType] = useState<any>(null);
  useEffect(() => {
    // VectorSource 提供矢量图层的功能源。此源提供的矢量功能适合编辑。
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
    });
    source = new VectorSource({
      features: new GeoJSON().readFeatures(geometryJson),
      wrapX: false
    });
    map = new Map({
      // 添加操作按钮
      controls: defaultControls().extend([
        new FullScreen({ source: 'fullMap' }), // 全屏
        mousePositionControl, // 鼠标移动的位置信息
      ]),
      layers: [
        // 地图数据源
        new TileLayer({
          source: new OSM(),
        }),
        // 向量数据呈现客户端，作为向量。即使在动画期间，此图层类型也提供了最准确的渲染。点和标签在旋转景色中保持直立。对于非常大量的矢量数据，PAN和缩放动画期间的性能可能会受到影响。
        new VectorLayer({
          source: source,
        })
      ],
      target: 'mymap',
      view: new View({
        center: [19.557764, 111.346207],
        zoom: 2,
      }),
    });
    snap = new Snap({ source: source });
    map.addInteraction(snap);
    const modify = new Modify({source: source});
    map.addInteraction(modify);
    }, []);
  useEffect(() => {
    if (drawType && map) {
      map.removeInteraction(draw);
      let geometryFunction;
      if (drawType === EDrawType.Circle) {
        // 将圆转为一个多边形
        geometryFunction = (coordinates: any, geometry: any, projection: any) => {
          console.log('geometry', geometry);
          if (!geometry) {
            geometry = new GeometryCollection([
              new Polygon([]),
              // new Point(coordinates[0]),
            ]);
          }
          const geometries = geometry.getGeometries();
          const center = transform(coordinates[0], projection, 'EPSG:4326');
          const last = transform(coordinates[1], projection, 'EPSG:4326');
          const radius = getDistance(center, last);
          const circle = circular(center, radius, 128);
          circle.transform('EPSG:4326', projection);
          geometries[0].setCoordinates(circle.getCoordinates());
          geometry.setGeometries(geometries);
          return geometry;
        };
      }
      draw = new Draw({
        source: source,
        type: drawType,
        // geometryFunction: geometryFunction, // 可自定义形状
      });
      map.addInteraction(draw);
    } else if (map) {
      map.removeInteraction(draw);
    }
  }, [drawType]);
  const drawTypeChange = (e: any) => {
    setDrawType(e.target.value);
  };
  const getFeatures = () => {
    let features = source.getFeatures();
    features.forEach((item: any) => {
      let geo = new GeoJSON().writeFeature(item)
    });
    let geos = new GeoJSON().writeFeatures(features)
  };
  const drawOptions = [
    { label: '点', value: EDrawType.Point },
    { label: 'LineString', value: EDrawType.LineString },
    // { label: 'LinearRing', value: EDrawType.LinearRing },
    { label: '多边形', value: EDrawType.Polygon },
    { label: 'MultiPoint', value: EDrawType.MultiPoint },
    { label: 'MultiLineString', value: EDrawType.MultiLineString },
    { label: 'MultiPolygon', value: EDrawType.MultiPolygon },
    // { label: 'GeometryCollection', value: EDrawType.GeometryCollection },
    { label: '圆', value: EDrawType.Circle },
    { label: '无', value: '' },
  ];
  return (
    <Row id="fullMap" className="fullscreen" style={{ backgroundColor: '#eee'}}>
      <Row>
        <Space direction="vertical">
          <Radio.Group options={drawOptions} buttonStyle="solid" optionType="button" onChange={drawTypeChange} />
        </Space>
      </Row>
      <div id="mymap" className="mymap" style={{ width: 1000, height: 800 }}></div>
      <Space direction="vertical">
        <Text>同时按住 Shift键 和鼠标点击可开始连续画多边形</Text>
        <Text id="mouse-position"></Text>
        <Button onClick={getFeatures}>获取图形信息</Button>
      </Space>
    </Row>
  );
};
export default OpenLayersMap;