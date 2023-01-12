import { createElement } from '@antv/f2';

Page({
  data: {
    barhHeight: 0,
    onInitChart(F2, config) {
        const chart = new F2.Chart(config);
        const data = [
          { value: 4, name: '电压', time: '2023-01-12 11:00:00' },
          { value: 3, name: '电压', time: '2023-01-12 11:10:00' },
          { value: 6, name: '电压', time: '2023-01-12 11:20:00' },
          { value: 7, name: '电压', time: '2023-01-12 11:30:00' },
          { value: 2.3, name: '电压', time: '2023-01-12 11:40:00' },
          { value: 6.8, name: '电压', time: '2023-01-12 11:50:00' },
          { value: 3.5, name: '电压', time: '2023-01-12 12:00:00' },
          { value: 3, name: '电压', time: '2023-01-12 12:10:00' },
          { value: 6.2, name: '电压', time: '2023-01-12 12:20:00' },
          { value: 5.3, name: '电压', time: '2023-01-12 12:30:00' },

          { value: 2, name: '电流', time: '2023-01-12 11:00:00' },
          { value: 6, name: '电流', time: '2023-01-12 11:10:00' },
          { value: 5, name: '电流', time: '2023-01-12 11:20:00' },
          { value: 9, name: '电流', time: '2023-01-12 11:30:00' },
          { value: 3.3, name: '电流', time: '2023-01-12 11:40:00' },
          { value: 4.8, name: '电流', time: '2023-01-12 11:50:00' },
          { value: 6.5, name: '电流', time: '2023-01-12 12:00:00' },
          { value: 7, name: '电流', time: '2023-01-12 12:10:00' },
          { value: 8.2, name: '电流', time: '2023-01-12 12:20:00' },
          { value: 6.3, name: '电流', time: '2023-01-12 12:30:00' },
        //   { value: 62.7, name: '电流', date: '2011-10-01' },
        //   { value: 58, name: '电压', date: '2011-10-02' },
        //   { value: 59.9, name: '电流', date: '2011-10-02' },
        //   { value: 53.3, name: '电压', date: '2011-10-03' },
        //   { value: 59.1, name: '电流', date: '2011-10-03' },
        ];
        chart.source(data, {
        //   date: {
        //     range: [0, 1],
        //     type: 'timeCat',
        //     mask: 'MM-DD'
        //   },
          time: {
            type: 'timeCat',
            mask: 'hh:mm',
            // range: [0, 1],
            // tickCount: 3,
          },
          value: {
            max: 10,
            min: 0,
            // tickCount: 8
          }
        });
        
        // chart.area().position('time*value').color('name').adjust('stack');
        chart
            .line()
            .position('time*value')
            .color('name', (value: string) => {
                if(value === "电压") {
                  return '#3AAB47'
                }
                return '#ECC057';
              })
        chart
            .point()
            .position('time*value')
            .style('showControl', {
                // stroke: 'rgb(222, 174, 255',
                fill: '#fff',
                lineWidth: 1,
            })
            .color('name', (value: string) => {
                if(value === "电压") {
                  return '#3AAB47'
                }
                return '#ECC057';
              })
              
        chart.axis('time', {
            label: {
                rotate: -Math.PI / 4,
                textAlign: 'end',
                textBaseline: 'middle'
            }
        });
        chart.axis('value', {
            line: {
              lineWidth: 1, // 设置线的宽度
              stroke: '#E1E1E1', // 设置线的颜色
            //   lineDash: [3, 3] // 设置虚线
            }
          });
    
        // 设置图例居中显示
        chart.legend({
            align: 'center',
            itemWidth: null // 图例项按照实际宽度渲染
        });
        // tooltip 与图例结合
        chart.tooltip({
            showCrosshairs: true
        });
        chart.render();

        // 注意：需要把chart return 出来
        return chart;
      },
  },
  onLoad() {
  },
  onReady() {
    const that = this
    wx.getSystemInfo({
        success(res) {
            const {windowHeight, screenHeight} = res
            const barhHeight = screenHeight - windowHeight
            that.setData({
                barhHeight,
            })
        }
    })
  },
  
  getChargeData() {
  }
})
