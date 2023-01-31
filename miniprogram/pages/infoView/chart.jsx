/** @jsx jsx */
import { jsx, Chart, Interval, Axis, withGauge, } from '@antv/f2';

const Gauge = withGauge((props) => {
    const { center, startAngle, endAngle, r, percent, ticks, data = {} } = props;
    const {
        voltage = 0,
        current = 0,
        chargeTime = 240,
        status = '充电中', 
    } = data
    const diff = endAngle - startAngle;
    const { x, y } = center;
    return jsx("group", null, jsx("arc", {
	    attrs: {
	      x: x,
	      y: y,
	      r: r,
	      startAngle: startAngle,
	      endAngle: endAngle,
	      lineWidth: '20px',
	      lineCap: 'round',
	      stroke: '#fff'
	    }
	  }), jsx("arc", {
	    attrs: {
	      x: x,
	      y: y,
	      r: r,
	      startAngle: startAngle,
	      endAngle: startAngle,
	      lineWidth: '20px',
	      lineCap: 'round',
	      stroke: '#b3e1b8'
	    },
	    animation: {
	      appear: {
	        easing: 'linear',
	        duration: 500,
	        property: ['endAngle'],
	        start: {
	          endAngle: startAngle
	        },
	        end: {
	          endAngle: startAngle + diff * percent
	        }
	      }
	    }
	  }), ticks.map(function (tick) {
	    var start = tick.start,
	      end = tick.end;
	    return jsx("line", {
	      attrs: {
	        x1: start.x,
	        y1: start.y,
	        x2: end.x,
	        y2: end.y,
	        lineWidth: '6px',
	        lineCap: 'round',
	        stroke: '#e7e7e7'
	      }
	    });
	  }), jsx('text', {
        attrs: {
            x: 187.5,
            y: 185,
            text: `${voltage}V/${current}A`,
            textAlign: 'center',
            fontSize: 12,
            fill: '#fff',
          }
      }), jsx('text', {
        attrs: {
            x: 187.5,
            y: 110,
            // text: `${chargeTime}min`,
            text: '',
            textAlign: 'center',
            fontSize: 18,
            fill: '#fff',
          }
      }), jsx('text', {
        attrs: {
            x: 187.5,
            y: 130,
            text: status,
            textAlign: 'center',
            fontSize: 16,
            fill: '#fff',
          }
      }));
  });

export default (props) => {
  const { data } = props;
  return (
    <Gauge
      center={{ x: 187.5, y: 120 }}
      startAngle={Math.PI * 2/3}
      endAngle={Math.PI * 7/3}
      percent={data.percent}
      r="150px"
      tickCount={30}
      tickOffset="-40px"
      tickLength="1px"
      data={data}
    />
  );
};