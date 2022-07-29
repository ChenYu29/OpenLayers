/**
 *@description OpenLayers 测量工具
 *@author cy
 *@date 2022-07-06 14:45
 **/
import { LineString, Point } from 'ol/geom';
import { Fill, Style, Stroke, RegularShape, Text } from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import { getLength, getArea } from 'ol/sphere';
import Draw from 'ol/interaction/Draw';
import VectorSource from 'ol/source/Vector';
import { Modify } from 'ol/interaction';
interface IMyMeasureProps {
  map: any;
  source: VectorSource;
  vectorLayer: any;
  drawType: 'LineString' | 'Polygon';
}
export class MyMeasureControl {
  private draw = null;
  // 画线的样式
  private style = new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.2)',
    }),
    stroke: new Stroke({
      color: '#ffcc33',
      lineDash: [10, 10],
      width: 2,
    }),
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: '#ffcc33',
      }),
      fill: new Fill({
        color: '#ffcc33',
      }),
    }),
  });
  private labelStyle = new Style({
    text: new Text({
      font: '14px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: '#ffcc33',
      }),
      padding: [3, 3, 3, 3],
      textBaseline: 'bottom',
      offsetY: -15,
    }),
    image: new RegularShape({
      radius: 8,
      points: 3,
      angle: Math.PI,
      displacement: [0, 10],
      fill: new Fill({
        color: '#ffcc33',
      }),
    }),
  });
  // 鼠标移动时的提示
  private tipStyle = new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });
  private modifyStyle = new Style({
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
    text: new Text({
      text: '拖拽点以修改',
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.7)',
      }),
      padding: [2, 2, 2, 2],
      textAlign: 'left',
      offsetX: 15,
    }),
  });
  private segmentStyle = new Style({
    text: new Text({
      font: '12px Calibri,sans-serif',
      fill: new Fill({
        color: 'rgba(255, 255, 255, 1)',
      }),
      backgroundFill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
      padding: [2, 2, 2, 2],
      textBaseline: 'bottom',
      offsetY: -12,
    }),
    image: new RegularShape({
      radius: 6,
      points: 3,
      angle: Math.PI,
      displacement: [0, 8],
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.4)',
      }),
    }),
  });
  private segmentStyles = [this.segmentStyle];
  private drawType = 'LineString';
  private map = null;
  private source;
  private vectorLayer = null;
  constructor(options: IMyMeasureProps) {
    this.drawType = options.drawType;
    this.map = options.map;
    this.source = options.source;
    this.vectorLayer = options.vectorLayer;
  }
  public setDrawType(type: 'LineString' | 'Polygon') {
    this.drawType = type;
    this.measureFun();
  }
  public measureFun() {
    let this_ = this;
    let tipPoint;
    if (this_.draw) {
      this_.map.removeInteraction(this_.draw);
    }
    const modify = new Modify({ source: this_.source, style: this_.modifyStyle });
    const formatLength = (line: any) => {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' km';
      } else {
        output = Math.round(length * 100) / 100 + ' m';
      }
      return output;
    };
    const formatArea = (polygon: any) => {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' km\xB2';
      } else {
        output = Math.round(area * 100) / 100 + ' m\xB2';
      }
      return output;
    };
    const addInteraction = () => {
      const activeTip =
        '可继续绘制 ' +
        (this_.drawType === 'Polygon' ? '多边形' : '线') + ' 双击结束';
      const idleTip = '点击以开始测量';
      let tip = idleTip;
      this_.draw = new Draw({
        source: this_.source,
        type: this_.drawType,
        style: function (feature) {
          return styleFunction(feature, true, this_.drawType, tip);
        },
      });
      this_.draw.on('drawstart', function () {
        modify.setActive(false);
        tip = activeTip;
      });
      this_.draw.on('drawend', function () {
        this_.modifyStyle.setGeometry(tipPoint);
        modify.setActive(true);
        this_.map.once('pointermove', function () {
          this_.modifyStyle.setGeometry();
        });
        tip = idleTip;
      });
      modify.setActive(true);
      this_.map.addInteraction(this_.draw);
    };
    const styleFunction = (feature: any, segments: any, drawType: any, tip?: any) => {
      const styles = [this_.style];
      const geometry = feature.getGeometry();
      const type = geometry.getType();
      let point, label, line;
      if (!drawType || drawType === type) {
        if (type === 'Polygon') {
          point = geometry.getInteriorPoint();
          label = formatArea(geometry);
          line = new LineString(geometry.getCoordinates()[0]);
        } else if (type === 'LineString') {
          point = new Point(geometry.getLastCoordinate());
          label = formatLength(geometry);
          line = geometry;
        }
      }
      if (segments && line) {
        let count = 0;
        line.forEachSegment(function (a, b) {
          const segment = new LineString([a, b]);
          const label = formatLength(segment);
          if (this_.segmentStyles.length - 1 < count) {
            this_.segmentStyles.push(this_.segmentStyle.clone());
          }
          const segmentPoint = new Point(segment.getCoordinateAt(0.5));
          this_.segmentStyles[count].setGeometry(segmentPoint);
          this_.segmentStyles[count].getText().setText(label);
          styles.push(this_.segmentStyles[count]);
          count++;
        });
      }
      if (label) {
        this_.labelStyle.setGeometry(point);
        this_.labelStyle.getText().setText(label);
        styles.push(this_.labelStyle);
      }
      if (
        tip &&
        type === 'Point' &&
        !modify.getOverlay().getSource().getFeatures().length
      ) {
        tipPoint = geometry;
        this_.tipStyle.getText().setText(tip);
        styles.push(this_.tipStyle);
      }
      return styles;
    };
    this_.vectorLayer.setStyle((feature: any) => {
      return styleFunction(feature, true, '');
    });
    this_.map.addInteraction(modify);
    addInteraction();
  }
  public deleteMeasureData() {
    this.source.clear();
  }
  public cancelDraw() {
    this.map.removeInteraction(this.draw);
    this.draw = null;
  }
}