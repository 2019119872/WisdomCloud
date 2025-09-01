 template
<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceRankAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
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
const props = withDefaults(defineProps<Props>(), {
  queryAll: false,
  queryPublic: false,
})

// 加载状态
const loading = ref<boolean>()

// 数据列表
const dataList = ref<API.Space[]>([])

/**
 * 获取空间排行分析数据
 * 调用后端接口获取空间使用排行数据，并更新 dataList
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceRankAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    topN: 10,
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
 * 计算图表配置项
 * 根据 dataList 中的数据生成 echarts 图表的配置项
 * @returns {Object} echarts 配置项对象
 */
const options = computed(() => {
  // 提取空间名称
  const spaceNames = dataList.value.map((item) => item.spaceName)

  // 提取空间使用量（转为 MB）
  const usageData = dataList.value.map((item) => ((item.totalSize ?? 0) / (1024 * 1024)).toFixed(2))


  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: spaceNames,
    },
    yAxis: {
      type: 'value',
      name: '空间使用量 (MB)',
    },
    series: [
      {
        name: '空间使用量 (MB)',
        type: 'bar',
        data: usageData,
        itemStyle: {
          color: '#5470C6', // 自定义柱状图颜色
        },
      },
    ],
  }
})

</script>

<template>
  <div class="spaceRankAnalyze">
    <a-card title="空间使用排行分析">
      <!-- 显示空间使用排行的柱状图 -->
      <v-chart :option="options" style="height: 320px ; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<style scoped></style>
