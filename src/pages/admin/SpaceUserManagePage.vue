<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { message, Modal } from 'ant-design-vue' // 引入Modal组件用于确认对话框
import dayjs from 'dayjs'
import { SPACE_ROLE_OPTIONS } from '@/constants/space.ts'
import {
  addSpaceUserUsingPost,
  deleteSpaceUserUsingPost,
  editSpaceUserUsingPost,
  listSpaceUserUsingPost,
} from '@/api/spaceUserController.ts'

/**
 * 表格列配置
 */
interface Props {
  /**
   * 空间 ID，用于获取该空间下的用户列表
   */
  id: string
}

const props = defineProps<Props>()
const columns = [
  {
    title: '用户',
    dataIndex: 'userInfo',
  },
  {
    title: '角色',
    dataIndex: 'spaceRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

/**
 * 数据列表，存储从后端获取的空间用户信息
 */
const dataList = ref<API.SpaceUserVO[]>([])

/**
 * 获取空间用户数据
 *
 * 通过 props.id 获取当前空间的用户列表，并更新到 dataList 中。
 * 如果请求失败或返回错误码，则显示错误提示。
 */
const fetchData = async () => {
  try {
    const spaceId = props.id
    if (!spaceId) {
      return
    }
    const res = await listSpaceUserUsingPost({
      spaceId,
    })
    if (res.data.code === 0 && res.data.data) {
      dataList.value = res.data.data ?? []
    } else {
      message.error('获取数据失败' + res.data.message)
    }
  } catch (error) {
    message.error('网络错误，获取数据失败')
    console.error('获取数据失败:', error)
  }
}

/**
 * 组件挂载时调用 fetchData 方法加载初始数据
 */
onMounted(() => {
  fetchData()
})

/**
 * 删除空间用户
 *
 * @param id 用户在空间中的记录 ID
 * @param name 用户名称（可选），用于提示信息展示
 *
 * 显示确认对话框，用户确认后执行删除操作。
 * 删除成功后刷新数据列表。
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

        const res = await deleteSpaceUserUsingPost({ id })

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

/**
 * 修改用户在空间中的角色
 *
 * @param value 新的角色值
 * @param record 当前用户的完整记录对象
 *
 * 调用接口更新角色信息，成功后显示提示并刷新数据。
 */
const editSpaceRole = async (value, record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  if (res.data.code === 0) {
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
  }
}

/**
 * 添加用户到空间的表单数据模型
 */
const formData = reactive<API.SpaceUserAddRequest>({})

/**
 * 提交添加用户表单
 *
 * 将 formData 中的数据提交至后端接口，添加新用户到当前空间。
 * 成功后刷新数据列表。
 */
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}
</script>

<template>
  <div id="spaceUserManagePage">
    <!-- 页面标题与操作按钮区域 -->
    <a-flex justify="space-between">
      <h2>空间成员管理</h2>
      <a-space>
        <a-button type="primary" href="/add_space?type=1" target="_blank">+ 创建空间</a-button>
        <a-button type="primary" ghost href="/space_analyze?queryPublic=1" target="_blank">
          分析公共图库
        </a-button>
        <a-button type="primary" ghost href="/space_analyze?queryAll=1" target="_blank">
          分析全空间
        </a-button>
      </a-space>
    </a-flex>
    <!-- 表单与表格之间的分割线 -->
    <div style="margin-bottom: 16px"></div>
    <a-divider />
    <!-- 添加用户表单 -->
    <a-form layout="inline" :model="formData" @finish="handleSubmit">
      <a-form-item label="用户 id" name="userId">
        <a-input v-model:value="formData.userId" placeholder="请输入用户 id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>

    <!-- 空间用户列表表格 -->
    <a-table :columns="columns" :data-source="dataList">
      <template #bodyCell="{ column, record }">
        <!-- 用户信息列 -->
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.user?.userAvatar" />
            {{ record.user?.userName }}
          </a-space>
        </template>
        <!-- 角色编辑列 -->
        <template v-if="column.dataIndex === 'spaceRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value) => editSpaceRole(value, record)"
          />
        </template>
        <!-- 创建时间列 -->
        <template v-else-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <!-- 操作列 -->
        <template v-else-if="column.key === 'action'">
          <a-space wrap>
            <a-button type="link" danger @click="doDelete(record.id)">删除</a-button>
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
