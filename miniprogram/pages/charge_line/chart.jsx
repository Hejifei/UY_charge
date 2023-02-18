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
        nice: true,
        // tickCount: 5,
        // min: 0,
        // alias: '日均温度',
        // range: [0, 1],
    },
};

export default (props) => {
    const { data } = props;
    return (
        <Chart
            data={data}
            scale={scale}
        >
            <Axis
                field="time"
                style={{
                    label: {
                        rotate: -Math.PI / 4,
                        textAlign: 'start',
                        textBaseline: 'top'
                    },
                    grid: {
                        lineWidth: 0,
                    }
                }}
                
                grid="line"
            />
            <Axis
                field="value"
                style={{
                    grid: {
                        lineWidth: 0,
                    }
                }}
                nice
                // tickCount='2'
            />
            <Line
                x="time"
                y="value"
                shape="smooth"
                color={{
                    field: 'name',
                    callback: (value) => {
                        if (value === "电压") {
                            return '#3AAB47'
                        }
                        return '#ECC057';
                    },
                }} />
            <Point
                x="time"
                y="value"
                color={{
                    field: 'name',
                    callback: (value) => {
                        if (value === "电压") {
                            return '#3AAB47'
                        }
                        return '#ECC057';
                    },
                }}
                style={{
                    fill: '#fff',
                    lineWidth: 2,
                    stroke: ({name}) => {
                        if (name === "电压") {
                            return '#3AAB47'
                        }
                        return '#ECC057';
                    },
                }}
            />
            <Legend
                position="top"
                style={{
                    justifyContent: 'center',
                }}    
            />
            {/* <Tooltip /> */}
        </Chart>
    );
};