/**
 *@description 有工具栏地图展示
 *@author cy
 *@date 2022-07-29 10:28
 **/
import React, { useEffect, useRef } from 'react';
import { Card, Typography } from 'antd';
import {
  DeleteOutlined,
  StarOutlined,
  VerticalAlignBottomOutlined,
  BorderOutlined
} from '@ant-design/icons';
import { IconFont, myCardProps } from '@utils/CommonFunc';
import Map from 'ol/Map';
import { defaults as defaultControls, FullScreen, MousePosition } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import View from 'ol/View';
import { transform } from 'ol/proj';
import { MyMeasureControl } from '@components/layer/myMeasure';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { KML } from 'ol/format';
import Draw, { createBox } from 'ol/interaction/Draw';
import { createStringXY } from 'ol/coordinate';
const { Text } = Typography;

let map = null;
let source;
let drawSource;
let vector;
let myMeasure: MyMeasureControl;
const ToolMap = () => {
  const drawRef: any = useRef();
  const downloadRef: any = useRef();
  useEffect(() => {
    source = new VectorSource();
    drawSource = new VectorSource();
    vector = new VectorLayer({
      source: source,
    });
    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
    });
    map = new Map({
      // 添加操作按钮
      controls: defaultControls().extend([
        new FullScreen({ source: 'toolFullMap' }), // 全屏
        mousePositionControl
      ]),
      layers: [
        // 地图数据源
        new TileLayer({
          source: new OSM(),
        }),
        vector,
        new VectorLayer({
          source: drawSource,
        }),
      ],
      target: 'toolMap',
      view: new View({
        center: transform([114.419, 11.415], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10,
      }),
    });
    myMeasure = new MyMeasureControl({ drawType: 'LineString', map, vectorLayer: vector, source });
  }, []);
  // 测量方式的改变
  const onMeasureChange = (type: 'LineString' | 'Polygon') => {
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
    }
    myMeasure.setDrawType(type);
  };
  // 删除测量数据
  const deleteMeasureData = () => {
    myMeasure.deleteMeasureData();
    myMeasure.cancelDraw();
  };
  // 绘制工具的改变
  const onDrawTypeChange = (type: any) => {
    myMeasure.cancelDraw(); // 需要先关闭测量面积的绘制事件
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
    }
    if (type === 'Delete') {
      drawSource.clear();
    } else if (type === 'Download') {
      // Circle 不是标准图形，导出会报错
      let kml = new KML();
      let fes = drawSource.getFeatures();
      // fes.forEach((item: any, index: number) => {
      //   item.id_ = dayjs().valueOf() + '-' + index;
      // });
      let geo = kml.writeFeatures(fes, { featureProjection: map.getView().getProjection() });
      let blob = new Blob([geo]);
      let filename = 'features.kml';
      downloadRef.current.setAttribute('href', URL.createObjectURL(blob));
      downloadRef.current.setAttribute('download', filename);
      downloadRef.current.click();
    } else {
      let geometryFunction;
      if (type === 'Rect') {
        geometryFunction = createBox();
      }
      drawRef.current = new Draw({
        source: drawSource,
        type: type === 'Rect' ? 'Circle' : type,
        geometryFunction
      });
      map.addInteraction(drawRef.current);
    }
  };
  const cancelAllOpt = () => {
    myMeasure.cancelDraw(); // 需要先关闭测量面积的绘制事件
    if (drawRef.current) {
      map.removeInteraction(drawRef.current);
    }
  };
  return (
    <Card {...myCardProps('工具栏地图展示')} style={{ width: '100%', height: '100%' }}>
      <div id="toolFullMap" className="fullscreen" style={{ width: '100%', height: 'calc(100vh - 200px)', position: 'relative' }}>
        <div className="ol-content">
          <div className="ol-toggle-options">
            <a onClick={cancelAllOpt} title="移动"><IconFont type="icon-pointer" /></a>
          </div>
          <div className="ol-toggle-options" style={{ marginTop: 5 }}>
            <a onClick={() => onMeasureChange('LineString')} title="测距">m</a>
            <a onClick={() => onMeasureChange('Polygon')} title="测面积">m²</a>
            <a onClick={deleteMeasureData} title="删除测量"><DeleteOutlined /></a>
          </div>
          <div className="ol-toggle-options" style={{ marginTop: 5 }}>
            <a onClick={() => onDrawTypeChange('LineString')} title="线条">/</a>
            <a onClick={() => onDrawTypeChange('Rect')} title="矩形"><BorderOutlined /></a>
            <a onClick={() => onDrawTypeChange('Polygon')} title="多边形"><StarOutlined /></a>
            <a onClick={() => onDrawTypeChange('Download')} title="下载绘制数据"><VerticalAlignBottomOutlined /></a>
            <a onClick={() => onDrawTypeChange('Delete')} title="删除绘制"><DeleteOutlined /></a>
          </div>
        </div>
        <div id="toolMap" className="mymap" style={{ width: '100%', height: '100%' }}></div>
        <Text id="mouse-position"></Text>
      </div>
    </Card>
  );
};
export default ToolMap;