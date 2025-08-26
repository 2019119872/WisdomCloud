<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceSizeAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'

/**
 * 组件属性定义
 * @property {boolean} queryAll - 是否查询所有数据，默认为 false
 * @property {boolean} queryPublic - 是否查询公开数据，默认为 false
 * @property {number} spaceId - 空间 ID，默认为 undefined
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
const dataList = ref<API.SpaceSizeAnalyzeResponse[]>([])

/**
 * 获取空间图片大小分析数据
 * 发起请求获取数据并更新 dataList 和 loading 状态
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceSizeAnalyzeUsingPost({
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
 * 计算 echarts 配置项
 * 将 dataList 转换为 echarts 所需的饼图配置
 * @returns echarts 配置对象
 */
const options = computed(() => {
  // 构造饼图数据
  const pieData = dataList.value.map((item) => ({
    name: item.sizeRange,
    value: item.count,
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      top: 'bottom',
    },
    series: [
      {
        name: '图片大小',
        type: 'pie',
        radius: '50%',
        data: pieData,
      },
    ],
  }
})
</script>

<template>
  <div class="spaceSizeAnalyze">
    <a-card title="空间图片大小分析">
      <!-- 使用 v-chart 展示饼图，绑定 options 配置和 loading 状态 -->
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<style scoped></style>
