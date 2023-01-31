import { Chart, Interval, Axis } from '@antv/f2';
export default (props => {
  const {
    data
  } = props;
  return /*#__PURE__*/React.createElement(Chart, {
    data: data
  }, /*#__PURE__*/React.createElement(Axis, {
    field: "genre"
  }), /*#__PURE__*/React.createElement(Axis, {
    field: "sold"
  }), /*#__PURE__*/React.createElement(Interval, {
    x: "genre",
    y: "sold",
    color: "genre"
  }));
});