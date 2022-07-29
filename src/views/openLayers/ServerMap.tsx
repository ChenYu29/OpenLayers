/**
 *@description 可连接其他服务展示图层的地图
 *@author cy
 *@date 2022-07-29 13:19
 **/
import React, { useEffect } from 'react';
import { getRules, myCardProps } from '@utils/CommonFunc';
import { Card, Row, Col, Form, Radio, Input, Space, Button } from 'antd';
import Map from 'ol/Map';
import { defaults as defaultControls, FullScreen } from 'ol/control';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileArcGISRest, WMTS } from 'ol/source';
import View from 'ol/View';
import { get as getProjection, transform } from 'ol/proj';
import { RuleType } from '@utils/CommonVars';
import { getTopLeft, getWidth } from 'ol/extent';
import WMTSTileGrid from 'ol/tilegrid/WMTS';
const { TextArea } = Input;

let map;
const ServerMap = () => {
  const [form] = Form.useForm();
  useEffect(() => {
    map = new Map({
      // 添加操作按钮
      controls: defaultControls().extend([
        new FullScreen({ source: 'serverFullMap' }), // 全屏
      ]),
      layers: [
        // 地图数据源
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'serverMap',
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
            style: 'default',
          }),
        });
        map.addLayer(layer);
      }
    });
  };
  return (
    <Card {...myCardProps('连接展示其他服务图层')} style={{ width: '100%', height: '100%' }}>
      <Row id="serverFullMap" className="fullscreen" wrap={false} style={{ width: '100%', height: 'calc(100vh - 200px)' }}>
        <Col span={20}>
          <div id="serverMap" className="mymap" style={{ width: '100%', height: '100%' }}></div>
        </Col>
        <Col span={4}>
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
        </Col>
      </Row>
    </Card>
  );
};
export default ServerMap;