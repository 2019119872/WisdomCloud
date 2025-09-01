<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceTagAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'
import 'echarts-wordcloud'
import type { DefaultLabelFormatterCallbackParams } from 'echarts'

/**
 * 组件属性定义
 * @property {boolean} queryAll - 是否查询所有数据，默认为 false
 * @property {boolean} queryPublic - 是否仅查询公开数据，默认为 false
 * @property {number} spaceId - 空间 ID，可选
 */
interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: number
}

/**
 * 设置组件属性默认值
 */
const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

// 加载状态
const loading = ref<boolean>()

// 数据列表
const dataList = ref<API.SpaceTagAnalyzeResponse[]>([])

/**
 * 获取空间标签分析数据
 * 调用后端接口获取标签统计数据，并更新到 dataList 中
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceTagAnalyzeUsingPost({
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

/**
 * 监听属性变化并重新获取数据
 * 当 props 中的参数发生变化时，自动调用 fetchData 方法更新图表数据
 */
watchEffect(() => {
  fetchData()
})

/**
 * 计算 ECharts 图表配置项
 * 将原始数据转换为词云图所需格式，并设置样式和交互行为
 * @returns {Object} 返回 ECharts 配置对象
 */
const options = computed(() => {
  // 提取标签名和出现次数用于词云展示
  const tagData = dataList.value.map((item) => ({
    name: item.tag,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params: DefaultLabelFormatterCallbackParams) =>
        `${params.name}: ${params.value} 次`,
    },
    series: [
      {
        type: 'wordCloud',
        gridSize: 10,
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90],
        shape: 'circle',
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`, // 随机颜色
        },
        data: tagData,
      },
    ],
  }
})
</script>

<template>
  <div class="spaceTagAnalyze">
    <a-card title="空间图片标签分析">
      <!-- 使用 v-chart 组件渲染词云图，绑定配置项和加载状态 -->
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<style scoped></style>
