<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController.ts'
import { message, Modal } from 'ant-design-vue' // 引入Modal组件用于确认对话框
import dayjs from 'dayjs'
import {
  PIC_REVIEW_STATUS_ENUM,
  PIC_REVIEW_STATUS_MAP,
  PIC_REVIEW_STATUS_OPTIONS,
} from '@/constants/picture.ts'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '图片',
    dataIndex: 'url',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '名称',
    dataIndex: 'name',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '简介',
    dataIndex: 'introduction',
    ellipsis: true,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '类型',
    dataIndex: 'category',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '标签',
    dataIndex: 'tags',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '图片信息',
    dataIndex: 'picInfo',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '用户id',
    dataIndex: 'userId',
    width: 80,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '空间id',
    dataIndex: 'soaceId',
    width: 80,
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '审核信息',
    dataIndex: 'reviewMessage',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '编辑时间',
    dataIndex: 'editTime',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
  {
    title: '操作',
    key: 'action',
    customHeaderCell: () => ({
      style: {
        textAlign: 'center',
      },
    }),
  },
]

// 修正数据列表类型定义（应为数组）
const dataList = ref<API.Picture[]>([])
const total = ref<number>(0)
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

const fetchData = async () => {
  try {
    const res = await listPictureByPageUsingPost({
      ...searchParams,
      nullSpaceId: true
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

onMounted(() => {
  fetchData()
})

const pagination = computed(() => {
  return {
    current: searchParams.current,
    pageSize: searchParams.pageSize,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `共 ${total} 条数据`,
  }
})

const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

// 修改删除逻辑，添加确认对话框
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

        const res = await deletePictureUsingPost({ id })

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
const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? '管理员通过审核' : '管理员拒绝审核'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('审核成功', reviewMessage)
    fetchData() // 刷新数据
  } else {
    message.error('审核失败', res.data.message)
  }
}
</script>

<template>
  <div id="pictureManagePage">
    <a-flex justify="space-between">
      <h2>图片管理</h2>
      <a-space>
        <a-button type="primary" href="/add_picture" target="_blank" ghost>+添加图片</a-button>
        <a-button type="primary" href="/add_picture/batch" target="_blank" ghost>+批量添加图片</a-button>
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px"></div>
      <a-form layout="inline" :model="searchParams" @finish="doSearch">
        <a-form-item  label="关键词">
          <a-input style="max-width: 180px" v-model:value="searchParams.searchText" placeholder="输入关键词" allow-clear />
        </a-form-item>
        <a-form-item label="类型">
          <a-input  v-model:value="searchParams.category" placeholder="输入图片类型" allow-clear />
        </a-form-item>
        <a-form-item label="标签">
          <a-select
            v-model:value="searchParams.tags"
            mode="tags"
            placeholder="请输入标签"
            style="min-width: 120px"
            allow-clear
          />
        </a-form-item>
        <a-form-item name="reviewStatus" label="审核状态">
          <a-select
            v-model:value="searchParams.reviewStatus"
            :options="PIC_REVIEW_STATUS_OPTIONS"
            placeholder="请选择审核状态"
            style="max-width: 110px"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </a-form-item>
      </a-form>

    <a-divider />
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.url" :width="60" />
        </template>
        <template v-else-if="column.dataIndex === 'tags'">
          <a-space wrap>
            <a-tag v-for="tag in JSON.parse(record.tags || '[]')" :key="tag">{{ tag }}</a-tag>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'picInfo'">
          <div>格式： {{ record.picFormat }}</div>
          <div>宽度： {{ record.picWidth }}</div>
          <div>高度： {{ record.picHeight }}</div>
          <div>宽高比： {{ record.picScale }}</div>
          <div>大小： {{ (record.picSize / 1024).toFixed(2) }}kb</div>
        </template>
        <template v-if="column.dataIndex === 'reviewMessage'">
          <div>审核状态： {{ PIC_REVIEW_STATUS_MAP[record.reviewStatus] }}</div>
          <div>审核信息： {{ record.reviewMessage }}</div>
          <div>审核人： {{ record.reviewrId }}</div>
          <div v-if="record.reviewTime">
            审核时间：{{ dayjs(record.reviewTime).format('YYYY-MM-DD HH:mm:ss') }}
          </div>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button
              v-if="record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.REJECT"
              type="link"
              danger
              size="small"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.REJECT)"
            >
              拒绝
            </a-button>
            <a-button
              v-if="
                record.reviewStatus !== PIC_REVIEW_STATUS_ENUM.PASS &&
                record.reviewStatus !== undefined
              "
              type="link"
              size="small"
              @click="handleReview(record, PIC_REVIEW_STATUS_ENUM.PASS)"
            >
              通过
            </a-button>
            <!-- 传递图片ID和名称到删除方法 -->
            <a-button danger size="small" @click="doDelete(record.id, record.name)">删除</a-button>
            <a-button
              type="link"
              size="small"
              :href="`/add_picture?id=${record.id}`"
              target="_blank"
              >编辑
            </a-button>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
#pictureManagePage {
  text-align: center;
  padding: 16px;
}

/* 修复标签显示问题 */
::v-deep .ant-tag {
  margin-bottom: 4px;
}
</style>
