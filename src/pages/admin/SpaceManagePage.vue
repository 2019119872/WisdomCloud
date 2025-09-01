<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { deleteSpaceUsingPost, listSpaceByPageUsingPost } from '@/api/spaceController.ts'
import { message, Modal } from 'ant-design-vue' // 引入Modal组件用于确认对话框
import dayjs from 'dayjs'
import {
  SPACE_LEVEL_MAP,
  SPACE_LEVEL_OPTIONS,
  SPACE_TYPE_MAP,
  SPACE_TYPE_OPTIONS,
} from '@/constants/space.ts'
import { formatSize } from '@/utils'

/**
 * 表格列配置
 */
const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 60,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '空间名称',
    dataIndex: 'spaceName',
  },
  {
    title: '空间级别',
    dataIndex: 'spaceLevel',
    width: 80,
  },
  {
    title: '空间类别',
    dataIndex: 'spaceType',
    width: 100,
  },
  {
    title: '使用情况',
    dataIndex: 'spaceUseInfo',
  },
  {
    title: '用户 id',
    dataIndex: 'userId',
    width: 60,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

/**
 * 数据列表，存储从接口获取的空间数据
 */
const dataList = ref<API.Space[]>([])

/**
 * 总数据条数，用于分页显示
 */
const total = ref<number>(0)

/**
 * 搜索参数对象，包含分页、排序和筛选条件
 */
const searchParams = reactive<API.SpaceQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

/**
 * 获取空间数据列表
 *
 * 通过调用 listSpaceByPageUsingPost 接口获取分页数据，
 * 并更新 dataList 和 total 的值。
 *
 * @returns {Promise<void>} 无返回值
 */
const fetchData = async () => {
  try {
    const res = await listSpaceByPageUsingPost({
      ...searchParams,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data.records ?? []
      total.value = res.data.data.total ?? 0
    } else {
      message.error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    message.error('网络错误，获取数据失败')
    console.error('获取数据失败:', error)
  }
}

/**
 * 组件挂载时执行，初始化加载第一页数据
 */
onMounted(() => {
  fetchData()
})

/**
 * 计算属性：表格分页配置
 *
 * 根据当前页码、每页条数和总条数生成分页器配置
 *
 * @returns {Object} 分页配置对象
 */
const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条数据`,
  }
})

/**
 * 表格分页或排序变化时触发
 *
 * 更新 searchParams 中的分页信息并重新请求数据
 *
 * @param {Object} page - 分页对象，包含 current 和 pageSize 属性
 * @returns {void}
 */
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

/**
 * 执行搜索操作
 *
 * 将当前页重置为第一页，并重新请求数据
 *
 * @returns {void}
 */
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

/**
 * 删除指定的空间记录
 *
 * 显示确认对话框，用户确认后调用 deleteSpaceUsingPost 接口删除数据
 * 删除成功后刷新列表
 *
 * @param {number} id - 要删除的空间ID
 * @param {string} [name] - 空间名称（可选），用于提示信息展示
 * @returns {Promise<void>} 无返回值
 */
const doDelete = async (id: number, name?: string) => {
  if (!id) {
    message.warning('缺少图片ID，无法删除')
    return
  }

  // 显示确认对话框
  Modal.confirm({
    title: '确认删除',
    content: `您确定要删除图片${name ? `${name}` : ''}吗？此操作不可撤销。`,
    okText: '确认',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      try {
        // 显示加载状态
        message.loading('正在删除...', 0)

        const res = await deleteSpaceUsingPost({ id })

        // 关闭加载状态
        message.destroy()

        if (res.data.code === 0 && res.data.data) {
          message.success('删除成功')
          fetchData() // 重新加载数据
        } else {
          message.error(res.data.message || '删除失败')
        }
      } catch (error) {
        message.destroy()
        message.error('删除过程中发生错误')
        console.error('删除失败:', error)
      }
    },
  })
}
</script>

<template>
  <div id="spaceManagePage">
    <!-- 页面标题与操作按钮区域 -->
    <a-flex justify="space-between">
      <h2>空间管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank">
          分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank">
          分析全空间
        </a-button>
      </a-space>
    </a-flex>

    <!-- 搜索表单区域 -->
    <div style="margin-bottom: 16px"></div>
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="空间名称">
        <a-input
          style="max-width: 140px"
          v-model:value="searchParams.spaceName"
          placeholder="请输入空间名称"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="spaceLevel" label="空间级别">
        <a-select
          v-model:value="searchParams.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
          style="min-width: 100px"
          allow-clear
        />
      </a-form-item>
      <a-form-item name="spaceType" label="空间类别">
        <a-select
          v-model:value="searchParams.spaceType"
          :options="SPACE_TYPE_OPTIONS"
          placeholder="请选择空间类别"
          style="min-width: 100px"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="用户id">
        <a-input v-model:value="searchParams.userId" placeholder="请输入用户id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">搜索</a-button>
      </a-form-item>
    </a-form>

    <!-- 表格展示区域 -->
    <a-divider />
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'spaceLevel'">
          <div>{{ SPACE_LEVEL_MAP[record.spaceLevel] }}</div>
        </template>
        <template v-if="column.dataIndex === 'spaceType'">
          <div>{{ SPACE_TYPE_MAP[record.spaceType] }}</div>
        </template>
        <template v-if="column.dataIndex === 'spaceUseInfo'">
          <div>大小： {{ formatSize(record.totalSize) }} / {{ formatSize(record.maxSize) }}</div>
          <div>数量： {{ record.totalCount }} / {{ record.maxCount }}</div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <!-- 传递图片ID和名称到删除方法 -->
            <a-button danger size="small" @click="doDelete(record.id, record.name)">删除</a-button>
            <a-button type="link" size="small" :href="`/add_space?id=${record.id}`" target="_blank"
              >编辑
            </a-button>
            <a-button
              type="link"
              size="small"
              :href="`/space_analyze?spaceId=${record.id}`"
              target="_blank"
            >
              分析
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
#spaceManagePage {
  text-align: center;
  padding: 16px;
}

/* 修复标签显示问题 */
::v-deep .ant-tag {
  margin-bottom: 4px;
}
</style>
