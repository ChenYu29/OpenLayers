/**
 *@description
 *@author cy
 *@date 2022-02-25 17:03
 **/
import React, { useEffect, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { Button, Form, Input, Radio, Row, Space, Typography } from 'antd';
import { Draw, Modify, Snap } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { defaults as defaultControls, FullScreen, MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { GeoJSON } from 'ol/format';
import { GeometryCollection, Polygon } from 'ol/geom';
import { transform } from 'ol/proj';
import { circular } from 'ol/geom/Polygon';
import { getDistance } from 'ol/sphere';
import { OSM, TileArcGISRest, WMTS } from 'ol/source';
import { getRules } from '@utils/CommonFunc';
import { RuleType } from '@utils/CommonVars';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import { getTopLeft, getWidth } from 'ol/extent';
import {get as getProjection} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';

const { Text } = Typography;
const { TextArea } = Input;

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
  const [form] = Form.useForm();
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
        // new TileLayer({
        //   source: new TileArcGISRest({
        //     url: 'http://192.168.3.251:6080/arcgis/rest/services//SampleWorldCities/MapServer',
        //   }),
        // }),
        // 地图数据源
        new TileLayer({
          source: new OSM(),
        }),
        // new VectorLayer({
        //   source: new VectorSource({
        //     format: new OSMXML()
        //   })
        // }),
        // 向量数据呈现客户端，作为向量。即使在动画期间，此图层类型也提供了最准确的渲染。点和标签在旋转景色中保持直立。对于非常大量的矢量数据，PAN和缩放动画期间的性能可能会受到影响。
        new VectorLayer({
          source: source,
        }),
        // new TileLayer({
        //   source: new TileWMS({
        //     url: 'http://192.168.3.251:7009/geoserver/coral/wms',
        //     params: {'LAYERS': 'coral:20220228112357,20220228132142', 'TILED': true},
        //     serverType: 'geoserver',
        //     crossOrigin: 'anonymous',
        //   }),
        // })
      ],
      target: 'mymap',
      view: new View({
        /**
         * [112.3303986, 16.9504106] 经纬度
         * 投影projection有2种
         * 'EPSG:4326' 全球通用  被转换的坐标系
         * EPSG:3857 web地图专用 openlayers默认的   需要被转换的坐标系
         */
        // center: transform([113.307649675, 23.1200491021], 'EPSG:4326', 'EPSG:3857'),
        center: transform([114.419, 11.415], 'EPSG:4326', 'EPSG:3857'),
        // center: [-10997148, 4569099],
        zoom: 10,
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
      let geo = new GeoJSON().writeGeometry(item.getGeometry())
      // console.log('features', item.getGeometry());
    });
    let geos = new GeoJSON().writeFeatures(features)
  };
  const connectTest = () => {
    form.validateFields().then((values: any) => {
      if (values.type === 'rest') {
        let layers = new TileLayer({
          source: new TileArcGISRest({
            url: values.url,
          }),
        });
        map.addLayer(layers);
      } else {
        const projection = getProjection(values.epsg || 'EPSG:3857');
        const tileSizePixels = 256;
        const tileSizeMtrs = getWidth(projection.getExtent()) / tileSizePixels;
        const matrixIds = [];
        const resolutions = [];
        for (let i = 0; i <= 14; i++) {
          matrixIds[i] = i;
          resolutions[i] = tileSizeMtrs / Math.pow(2, i);
        }
        let layer = new TileLayer({
          // opacity: 0.7,
          source: new WMTS({
            // url: 'https://mrdata.usgs.gov/mapcache/wmts',
            url: values.url,
            layer: values.layer,
            matrixSet: values.matrixSet,
            // format: 'image/png',
            projection: projection,
            tileGrid: new WMTSTileGrid({
              origin: getTopLeft(projection.getExtent()),
              resolutions: resolutions,
              matrixIds: matrixIds,
            }),
            // style: 'default',
            style: 'tiger_roads',
          }),
        });
        map.addLayer(layer);
      }
    });
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
    <Row id="fullMap" className="fullscreen" wrap={false} style={{ backgroundColor: '#eee'}}>
      <div>
        <Row>
          <Space direction="vertical">
            <Radio.Group options={drawOptions} buttonStyle="solid" optionType="button" onChange={drawTypeChange} />
          </Space>
        </Row>
        <div id="mymap" className="mymap" style={{ width: 1000, height: 800 }}></div>
      </div>
      <Space direction="vertical">
        <Text>同时按住 Shift键 和鼠标点击可开始连续画多边形</Text>
        <Text id="mouse-position"></Text>
        <Button onClick={getFeatures}>获取图形信息</Button>
        <Form form={form}>
          <Form.Item label="服务类型" name="type" rules={getRules(RuleType.selectRequired)}>
            <Radio.Group options={[{ label: 'wmts(geoserver)', value: 'wmts' }, { label: 'rest(ArcGIS Server)', value: 'rest' }, ]} buttonStyle="solid" optionType="button" />
          </Form.Item>
          <Form.Item label="连接地址" name="url" rules={getRules(RuleType.required)} initialValue="http://10.3.1.52/cia_w/wmts">
            <TextArea />
          </Form.Item>
          <Form.Item label="layer" name="layer" rules={getRules(RuleType.required)} initialValue="cia">
            <Input />
          </Form.Item>
          <Form.Item label="EPSG" name="epsg" rules={getRules(RuleType.required)} initialValue="EPSG:3857">
            <Input />
          </Form.Item>
          <Form.Item label="瓦片集合" name="matrixSet" initialValue="w">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" onClick={connectTest}>测试连接</Button>
            </Space>
          </Form.Item>
        </Form>
      </Space>
    </Row>
  );
};
export default OpenLayersMap;