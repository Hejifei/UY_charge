import {tabbar_data_list, tabbar_info_view_value} from '../../common/index'


Component({
    properties: {
      first_period_night_hour_per: {
        type: String,
        value: undefined,
      },
    },
    data: {
        tabbar_data_list,
        active: tabbar_info_view_value,
    },
    methods: {
        onChange(event: any) {
            console.log({event})
            // event.detail 的值为当前选中项的索引
            this.setData({ active: event.detail });
        },
    }
  })
