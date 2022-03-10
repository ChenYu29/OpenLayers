/**
 *@description 显示区域站点下的图层
 *@author cy
 *@date 2022-02-23 10:06
 **/
import React, { useState, useEffect, useRef } from 'react';
import { openLayersPath } from '@utils/ProjectVars';
import { Button, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import layers from '@static/images/layers/layers.png';
import checked from '@static/images/layers/checked.png';
import notCheck from '@static/images/layers/notCheck.png';
import fullScreen from '@static/images/layers/fullScreen.png';
import cancelScreen from '@static/images/layers/cancelScreen.png';
import './layers.less';
import { createPortal } from 'react-dom';
import { post } from '@utils/Ajax';

interface IProps {
  layers: any;
  name: Array<any>;
  bbox: any;
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
const ShowLayer = (props: IProps) => {
  const { layers, bbox, name } = props;
  const [params, setParams] = useState<any>(null);
  const contentRef: any = useRef();
  const urlsSuffix = '&srs=EPSG:32649&styles=&format=application/openlayers';
  useEffect(() => {
    if (layers && name) {
      let width = contentRef.current.clientWidth - 20 || 800;
      let height = contentRef.current.clientHeight - 100 || 450;
      let urls = renderUrls(name, bbox, width, height);
      setParams(urls);
    }
  }, [layers, name]);
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
  return (
    <div ref={contentRef} style={{ width: '100%', height: '100%' }}>
      <iframe src={params} width="100%" height="100%" style={{ minHeight: 450, border: 'none' }} />
    </div>
  );
};
export default ShowLayer;