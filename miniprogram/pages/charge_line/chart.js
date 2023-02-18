/** @jsx jsx */
import { jsx, Legend, Chart, Line, Axis, Tooltip, Point } from '@antv/f2';
const scale = {
  time: {
    // type: 'timeCat',
    // mask: 'hh:mm',
    // tickCount: 3,
    // range: [0, 1],
  },
  value: {
    nice: true
    // tickCount: 5,
    // min: 0,
    // alias: '日均温度',
    // range: [0, 1],
  }
};

export default (props => {
  const {
    data
  } = props;
  return jsx(Chart, {
    data: data,
    scale: scale
  }, jsx(Axis, {
    field: "time",
    style: {
      label: {
        rotate: -Math.PI / 4,
        textAlign: 'start',
        textBaseline: 'top'
      },
      grid: {
        lineWidth: 0
      }
    },
    grid: "line"
  }), jsx(Axis, {
    field: "value",
    style: {
      grid: {
        lineWidth: 0
      }
    },
    nice: true
    // tickCount='2'
  }), jsx(Line, {
    x: "time",
    y: "value",
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
  }), jsx(Point, {
    x: "time",
    y: "value",
    color: {
      field: 'name',
      callback: value => {
        if (value === "电压") {
          return '#3AAB47';
        }
        return '#ECC057';
      }
    },
    style: {
      fill: '#fff',
      lineWidth: 2,
      stroke: ({
        name
      }) => {
        if (name === "电压") {
          return '#3AAB47';
        }
        return '#ECC057';
      }
    }
  }), jsx(Legend, {
    position: "top",
    style: {
      justifyContent: 'center'
    }
  }));
});