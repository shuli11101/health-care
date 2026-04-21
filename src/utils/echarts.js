import * as echarts from 'echarts/core'

// 按需引入图标
import { LineChart, BarChart } from 'echarts/charts'

// 引入组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
} from 'echarts/components'

// 引入渲染器
import { CanvasRenderer } from 'echarts/renderers'

// 注册

echarts.use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  CanvasRenderer
])

export default echarts
