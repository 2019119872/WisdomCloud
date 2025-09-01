<script setup lang="ts">
import VChart from 'vue-echarts'
import 'echarts'
import { computed, ref, watchEffect } from 'vue'
import { getSpaceUserAnalyzeUsingPost } from '@/api/spaceAnalyzeController.ts'
import { message } from 'ant-design-vue'

/**
 * 组件属性定义
 * @property {boolean} queryAll - 是否查询全部数据，默认为 false
 * @property {boolean} queryPublic - 是否查询公开数据，默认为 false
 * @property {number} spaceId - 空间 ID，可选
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

// 时间维度：day（天）、week（周）、month（月）
const timeDimension = ref<'day' | 'week' | 'month'>('day')

// 用户 ID，用于搜索特定用户的数据
const userId = ref<string>()

// 加载状态标识
const loading = ref<boolean>()

// 存储从接口获取的分析数据列表
const dataList = ref<API.SpaceUserAnalyzeResponse[]>([])

/**
 * 获取用户上传行为分析数据
 * 调用后端接口，根据当前的筛选条件获取数据并更新 dataList
 */
const fetchData = async () => {
  loading.value = true
  const res = await getSpaceUserAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: userId.value,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data || []
  } else {
    message.error('获取数据失败')
  }
  loading.value = false
}

/**
 * 执行用户搜索操作
 * @param {string} value - 输入的用户 ID 值
 */
const doSearch = (value: string) => {
  userId.value = value
}

// 监听依赖变化，自动重新获取数据
watchEffect(() => {
  fetchData()
})

/**
 * 计算 echarts 图表配置项
 * 根据 dataList 构造 x 轴的时间区间和 y 轴的上传数量数据
 * @returns echarts 配置对象
 */
const options = computed(() => {
  const periods = dataList.value.map((item) => item.period) // 时间区间
  const counts = dataList.value.map((item) => item.count) // 上传数量

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: periods, name: '时间区间' },
    yAxis: { type: 'value', name: '上传数量' },
    series: [
      {
        name: '上传数量',
        type: 'line',
        data: counts,
        smooth: true, // 平滑折线
        emphasis: {
          focus: 'series',
        },
      },
    ],
  }
})

// 时间维度选项，供 a-segmented 使用
const timeDimensionOptions = [
  { label: '天', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
]
</script>

<template>
  <div class="spaceUserAnalyze">
    <a-card title="用户上传行为分析">
      <template #extra>
        <a-space>
          <!-- 时间维度切换控件 -->
          <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" />
          <!-- 用户搜索框 -->
          <a-input-search
            placeholder="请输入用户ID"
            enter-button="搜索用户"
            @search="doSearch"
          ></a-input-search>
        </a-space>
      </template>
      <!-- 折线图展示区域 -->
      <v-chart :option="options" style="height: 320px; max-width: 100%" :loading="loading" />
    </a-card>
  </div>
</template>

<style scoped></style>
