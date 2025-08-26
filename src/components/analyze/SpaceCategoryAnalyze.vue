<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceCategoryAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'

/**
 * 组件属性定义
 * @property {boolean} queryAll - 是否查询所有数据，默认为 false
 * @property {boolean} queryPublic - 是否查询公开数据，默认为 false
 * @property {number} spaceId - 空间 ID，可选
 */
interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: number
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

// 加载状态
const loading = ref<boolean>()

// 数据列表
const dataList = ref<API.SpaceCategoryAnalyzeResponse[]>([])

/**
 * 获取空间分类分析数据
 * 通过调用后端接口获取当前空间的图片分类统计信息
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceCategoryAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data || []
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}

// 监听属性变化并重新获取数据
watchEffect(() => {
  fetchData()
})

/**
 * ECharts 图表配置项
 * 构建柱状图展示各类别下的图片数量和总大小
 * @returns {Object} echarts 配置对象
 */
const options = computed(() => {
  // 提取分类名称
  const categories = dataList.value.map((item) => item.category)

  // 提取图片数量数据
  const countData = dataList.value.map((item) => item.count)

  // 提取图片总大小并转换为 MB 单位（保留两位小数）
  const sizeData = dataList.value.map((item) => ((item.totalSize ?? 0) / (1024 * 1024)).toFixed(2))

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['图片数量', '图片总大小'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: '图片数量',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } }, // 左侧 Y 轴颜色
      },
      {
        type: 'value',
        name: '图片总大小 (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } }, // 右侧 Y 轴颜色
        splitLine: {
          lineStyle: {
            color: '#91CC75', // 网格线颜色
            type: 'dashed', // 网格线样式
          },
        },
      },
    ],
    series: [
      { name: '图片数量', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: '图片总大小', type: 'bar', data: sizeData, yAxisIndex: 1 },
    ],
  }
})
</script>

<template>
  <div class="spaceCategoryAnalyze">
    <a-card title="空间图片分类分析">
      <!-- 使用 VChart 渲染图表，绑定配置项与加载状态 -->
      <v-chart :option="options" style="height: 320px ; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<style scoped></style>
