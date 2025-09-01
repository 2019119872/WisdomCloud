<script lang="ts" setup>
/**
 * 用户管理页面组件
 * 实现用户列表展示、分页查询、条件搜索和删除功能
 */

import { computed, onMounted, reactive, ref } from 'vue'
import { listUserVoByPageUsingPost } from '@/api/userController.ts'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { deleteUserUsingPost } from '@/api/userController.ts'

/**
 * 表格列配置
 * 定义用户管理表格的列信息
 */
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

/**
 * 用户数据列表
 * 存储从后端获取的用户信息列表
 */
const dataList = ref<API.UserVO>([])

/**
 * 数据总条数
 * 用于分页组件显示总数据量
 */
const total = ref<number>(0)

/**
 * 搜索参数
 * 包含分页信息和搜索条件
 */
const searchParams = reactive<API.UserQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'createTime',
  sortOrder: 'descend',
})

/**
 * 获取用户数据
 * 调用后端接口获取用户列表数据并更新到页面
 * @returns {Promise<void>}
 */
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

/**
 * 组件挂载时执行
 * 初始化加载用户数据
 */
onMounted(() => {
  fetchData()
})

/**
 * 分页配置计算属性
 * 根据当前状态计算分页组件所需配置
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
 * 表格分页变化处理函数
 * 当用户切换分页时更新搜索参数并重新获取数据
 * @param {Object} page - 分页信息对象，包含current和pageSize属性
 */
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}

/**
 * 执行搜索操作
 * 重置页码为第一页并重新获取数据
 */
const doSearch = () => {
  searchParams.current = 1
  fetchData()
}

/**
 * 删除用户
 * 调用后端接口删除指定ID的用户
 * @param {string} id - 要删除的用户ID
 * @returns {Promise<void>}
 */
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deleteUserUsingPost({
    id,
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
    <!-- 用户搜索表单 -->
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
    <!-- 用户数据表格 -->
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
