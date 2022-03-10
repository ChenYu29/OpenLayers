/**
 *@description 显示区域站点下的图层
 *@author cy
 *@date 2022-02-23 10:06
 **/
import React, { useState, useEffect, useRef } from 'react';
import { openLayersPath } from '@utils/ProjectVars';
import { Button, message, Result, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import layers from '@static/images/layers/layers.png';
import checked from '@static/images/layers/checked.png';
import notCheck from '@static/images/layers/notCheck.png';
import fullScreen from '@static/images/layers/fullScreen.png';
import cancelScreen from '@static/images/layers/cancelScreen.png';
import './layers.less';
import { createPortal } from 'react-dom';
import { post } from '@utils/Ajax';
import { WhetherFlag } from '@utils/CommonVars';
import TileLayer from 'ol/layer/Tile';
import { ImageWMS, TileWMS } from 'ol/source';
import View from 'ol/View';
import Map from 'ol/Map';
import ImageLayer from 'ol/layer/Image';
import ol from 'ol';
import OSM from 'ol/source/OSM';

interface IProps {
  stationId: any;
}
/**
 * %3A - :
 * %2C - ,
 * layers: 图层，同一工作空间中的多个图层用,隔开 （eg：layers=coral:19SEP21025945-M2AS_R1C1-011271261030_01_P001,北岛240）
 * srs: 坐标参考系统 （eg:srs=EPSG:32649）
 * 边框(bbox)Native Bounding Box: 最小 X,最小 Y,最大,最大 Y （eg：bbox=637830.0,1870400.0,645112.0,1878592.0）
  width,height 展示画布的宽高
 例如：'http://192.168.3.251:7009/geo/geoserver/coral/wms?service=WMS&version=1.1.0&request=GetMap&layers=coral:19SEP21025945-M2AS_R1C1-011271261030_01_P001&bbox=637830.0,1870400.0,645112.0,1878592.0&width=682&height=768&srs=EPSG:32649&styles=&format=application/openlayers';
 */
const ShowLayersByArea = (props: IProps) => {
  const { stationId } = props;
  const [params, setParams] = useState<any>(null);
  const [layerList, setLayerList] = useState<Array<any>>([]);
  const [showLayers, setShowLayers] = useState<boolean>(false);
  const [full, setFull] = useState<boolean>(false); // 是否全屏
  const contentRef: any = useRef();
  const fullRef: any = useRef();
  const urlsSuffix = '&srs=EPSG:4326&styles=&format=application/openlayers';
  useEffect(() => {
    if (layerList.length > 0) {
      let sortArr: Array<any> = layerList.sort((a: any, b: any) => a.indexNum - b.indexNum); // 图层顺序排序
      let names: Array<any> = [];
      sortArr.forEach((item: any) => {
        if (item.isShow === WhetherFlag.yes) {
          names.push(item.name);
        }
      });
      // let bbox = '637830.0,1870400.0,645112.0,1878592.0';
      let bbox = sortArr[0].coordinate;
      let width = contentRef.current.clientWidth - 20 || 800;
      let height = contentRef.current.clientHeight - 100 || 450;
      let urls = renderUrls(names, bbox, width, height);
      console.log('urls', urls);
      if (names.length !== 0) {
        setParams(urls);
      }
    }
  }, [layerList, full]);
  useEffect(() => {
    // renderGeoserver();
    if (stationId) {
      getLayers();
    }
  }, [stationId]);
  const getLayers = () => {
    post('biz/mainData/queryGeoData', { stationId }, { dataType: 'form' }, (data: any) => {
      if (data.flag === 0) {
        setLayerList(data.data);
      }
    });
  };
  const renderGeoserver = () => {
    const bounds = [112.296001635684, 16.953613767692097, 112.32341119386, 16.9740757892451];
    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      // new ImageLayer({
      //   // extent: [637830.0, 1870400.0, 645112.0, 1878592.0],
      //   extent: bounds,
      //   visible: true,
      //   // extent: [-13884991, 2870341, -7455066, 6338219],
      //   source: new ImageWMS({
      //     ratio: 1,
      //     url: 'http://192.168.3.251:8080/geoserver/coral/wms',
      //     params: {
      //       'FORMAT': 'image/png',
      //       'VERSION': '1.1.1',
      //       "STYLES": '',
      //       "LAYERS": 'coral:20220228132946',
      //       "exceptions": 'application/vnd.ogc.se_inimage',
      //     }
      //   }),
      // }),
    ];
    // let projection = new ol.proj.Projection({
    //   code: 'EPSG:26713',
    //   units: 'm',
    //   global: false
    // });
    const map = new Map({
      layers: layers,
      target: 'geoMap',
      // view: new ol.View({
      //   projection: projection,
      // })
      view: new View({
        // center: [-10997148, 4569099],
        // projection: 'EPSG:4326',
        center: [112.31044, 16.96334],
        zoom: 10,
      }),
    });
    // map.getView().fit(bounds, map.getSize());
    // map.updateSize();
    // 底图
    // let layers = new ImageLayer({
    //   extent: [637830.0, 1870400.0, 645112.0, 1878592.0], //限制视图的范围，超出此范围的任何内容都无法在地图上看到
    //   source: new ImageWMS({
    //     // https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html 官方API
    //     // ‘source’数据源  这里使用的WMS服务器的切片数据的层源
    //     url: 'http://192.168.3.251:8080/geoserver/coral/wms', // geoserver上发布图层的地址
    //     // Layers需要指定要显示的图层名
    //     params: {
    //       LAYERS: 'coral:20220228112357', // 此处可以是单个图层名称，也可以是图层组名称，或多个图层名称
    //       TILED: true // 是否切片
    //     },
    //     // 远程WMS服务器的类型 geoserver
    //     serverType: 'geoserver',
    //   })
    // });
    // let map = new Map({
    //   // 要渲染地图，需要一个视图，一个或多个图层以及一个目标容器
    //   // https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html API地址
    //   layers: [layers], // 图层
    //   target: 'geoMap', // 地图的容器，元素本身或id元素的
    //   view: new View({
    //     //视图
    //     projection: 'EPSG:4326', //投影确定中心的坐标系 默认EPSG：3857 这里使用的geoserver发布时使用的坐标系
    //     center: [26096.08436127158, -82097.22537132817], // 视图的初始中心
    //     zoom: 14 // 缩放级别，用于计算视图的初始分辨率
    //   })
    // });
  };
  const renderUrls = (names: Array<any>, bbox: any, width: any, height: any) => {
    // names的顺序控制图层的显示
    let layers = 'coral';
    let urls = openLayersPath +
      '&layers=' + layers +
      ':' + names.join(',') +
      '&bbox=' + bbox +
      '&width=' + width +
      '&height=' + height +
      urlsSuffix;
    return urls;
  };
  const onCheckChange = (checkItem: any) => {
    layerList.forEach((item: any) => {
      if (checkItem.id === item.id) {
        item.isShow = checkItem.isShow === 0 ? 1 : 0;
      }
    });
    setLayerList([...layerList]);
  };
  const onChangeIndex = (indexItem: any, type: 'down' | 'up', currentIndex: number) => {
    let preIndex = indexItem.indexNum;
    let nextIndex = 0;
    layerList.forEach((item: any, index) => { // 找到要与之交换index的元素的index
      if (type === 'down' && index === currentIndex + 1) {
        nextIndex = item.indexNum;
      }
      if (type === 'up' && index === currentIndex - 1) {
        nextIndex = item.indexNum;
      }
    });
    layerList.forEach((item: any, index) => {
      if (type === 'down' && index === currentIndex + 1) { // 若是下移，则找到下一位元素，交换index
        item.indexNum = preIndex;
      }
      if (type === 'up' && index === currentIndex - 1) { // 若是上移，则找到上一位元素，交换index
        item.indexNum = preIndex;
      }
      if (indexItem.id === item.id) {
        item.indexNum = nextIndex;
      }
    });
    setLayerList([...layerList]);
  };
  const saveSettings = () => {
    let params = layerList.map((item: any) => ({ id: item.id, indexNum: item.indexNum, isShow: item.isShow }));
    post('biz/mainData/updateGeoData', params, { dataType: 'json' }, (data: any) => {
      if (data.flag === 0) {
        setShowLayers(false);
        message.success('保存成功！');
      }
    });
  };
  // const renderContent = <div id="geoMap" style={{ width: '100%', height: '100%', minHeight: 450 }}></div>
  const renderContent = (stationId && layerList.length > 0) ? (
    <div ref={contentRef} style={{ width: '100%', height: '100%' }}>
      <div className="ol-toggle-table" style={{ width: 'fit-content', display: showLayers ? 'block' : 'none' }}>
        <Space direction="vertical">
          {layerList.map((item: any, index) => (
            <div key={item.id}>
              <img style={{ marginRight: 5 }} onClick={() => onCheckChange(item)} src={item.isShow ? checked : notCheck} />
              <span>{item.name}</span>
              <Space>
                {index !== 0 && <Button type="link" onClick={() => onChangeIndex(item, 'up', index)} icon={<ArrowUpOutlined style={{ color: '#fff' }} />}></Button>}
                {index !== layerList.length - 1 && <Button type="link" onClick={() => onChangeIndex(item, 'down', index)} icon={<ArrowDownOutlined style={{ color: '#fff' }} />}></Button>}
              </Space>
            </div>
          ))}
          <Button onClick={saveSettings}>保存设置</Button>
        </Space>
      </div>
      <div className="ol-toggle-options">
        <a onClick={() => setShowLayers(!showLayers)} title="图层"><img src={layers} width={22} height={22} /></a>
        <a onClick={() => setFull(!full)} title={full ? '取消全屏' : '全屏'}><img src={full ? cancelScreen : fullScreen} width={22} height={22} /></a>
      </div>
      <iframe src={params} width="100%" height="100%" style={{ minHeight: 450, border: 'none' }} />
    </div>
  ) : (
    <Result title={stationId ? layerList.length === 0 ? '此站点暂无遥感数据' : '' : '请先选择一个站点查看'} />
  );
  return (
    full ? createPortal(<div className="fulldiv" ref={fullRef}>
      {renderContent}
    </div>, document.getElementById('app') || document.body) : renderContent
  );
};
export default ShowLayersByArea;