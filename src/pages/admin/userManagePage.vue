<script lang="ts" setup>

import { computed, onMounted, reactive, ref } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import {deleteUserUsingPost} from "@/api/userController.ts";

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    // sortFiled: 'createTime',
    // sorter: "descend",
  },
  {
    title: '操作',
    key: 'action',
  },
]

const dataList = ref<API.UserVO>([])
const total = ref<number>(0)
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})
const fetchData = async () => {
  const res = await listUserVoByPageUsingPost({
    ...searchParams,
  })
  if (res.data.code === 0 && res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error(res.data.message)
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
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({
    id
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('删除成功')
    fetchData()
  } else {
    message.error(res.data.message)
  }
}
</script>
<template>
  <div id="userManagePage">
    <h2>用户管理</h2>
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="账号">
        <a-input v-model:value="searchParams.userAccount" placeholder="输入账号" allow-clear />
      </a-form-item>
      <a-form-item label="用户名">
        <a-input v-model:value="searchParams.userName" placeholder="输入用户名" allow-clear />
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
        <template v-if="column.dataIndex === 'userAvatar'">
          <a-image :src="record.userAvatar" :width="60" />
        </template>
        <template v-else-if="column.dataIndex === 'userRole'">
          <span>
            <div v-if="record.userRole === 'admin'">
              <a-tag color="green">管理员</a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">普通用户</a-tag>
            </div>
          </span>
        </template>
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-if="column.dataIndex === 'updateTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
