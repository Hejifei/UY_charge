/** @jsx jsx */
import { jsx, Canvas, Chart, Line, Axis, Tooltip } from '@antv/f2';
const scale = {
  time: {
    type: 'timeCat',
    mask: 'MM/DD',
    tickCount: 3,
    range: [0, 1]
  },
  tem: {
    tickCount: 5,
    min: 0,
    alias: '日均温度'
  }
};
export default (props => {
  const {
    data
  } = props;
  return jsx(Chart, {
    data: data,
    scale: scale,
    time: {
      type: 'timeCat',
      mask: 'hh:mm'
      // range: [0, 1],
      // tickCount: 3,
    },

    value: {
      max: 10,
      min: 0
      // tickCount: 8
    }
  }, jsx(Axis, {
    field: "time",
    style: {
      label: {
        align: 'between'
      }
    }
  }), jsx(Axis, {
    field: "value"
  }), jsx(Line, {
    x: "time",
    y: "tem",
    shape: "smooth",
    color: {
      field: 'name',
      callback: value => {
        if (value === "电压") {
          return '#3AAB47';
        }
        return '#ECC057';
      }
    }
  }), jsx(Tooltip, null));
});