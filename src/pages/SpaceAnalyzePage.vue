<script lang="ts" setup>
import SpaceUsageAnalyze from '@/components/analyze/SpaceUsageAnalyze.vue'
import SpaceCategoryAnalyze from '@/components/analyze/SpaceCategoryAnalyze.vue'
import SpaceTagAnalyze from '@/components/analyze/SpaceTagAnalyze.vue'
import SpaceSizeAnalyze from '@/components/analyze/SpaceSizeAnalyze.vue'
import SpaceUserAnalyze from '@/components/analyze/SpaceUserAnalyze.vue'
import SpaceRankAnalyze from '@/components/analyze/SpaceRankAnalyze.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import useLoginUserStore from '@/stores/useLoginUserStore.ts'

const route = useRoute()

/**
 * 获取当前路由中的 spaceId 参数
 * @returns {string} 当前查询的 spaceId
 */
const spaceId = computed(() => {
  return route.query?.spaceId as string
})

/**
 * 判断是否查询所有空间的数据
 * @returns {boolean} 如果 queryAll 存在且为 true，则返回 true
 */
const queryAll = computed(() => {
  return !!route.query?.queryAll
})

/**
 * 判断是否查询公共图库的数据
 * @returns {boolean} 如果 queryPublic 存在且为 true，则返回 true
 */
const queryPublic = computed(() => {
  return !!route.query?.queryPublic
})

const loginUserStore = useLoginUserStore()
const loginUser = loginUserStore.loginUser

/**
 * 判断当前登录用户是否为管理员
 * @returns {boolean} 如果用户角色是 admin，则返回 true
 */
const isAdmin = computed(() => {
  return loginUser.userRole === 'admin'
})
</script>

<template>
  <div id="spaceAnalyzePage">
    <!-- 页面标题，根据不同的查询条件显示不同内容 -->
    <h2>
      空间图库分析 -
      <span v-if="queryAll">全部空间</span>
      <span v-else-if="queryPublic">公共图库</span>
      <span v-else>
        <!-- 显示具体空间链接 -->
        <a :href="`/space/${spaceId}`" target="_blank">空间Id：{{ spaceId }}</a>
      </span>
    </h2>

    <!-- 分析模块布局容器 -->
    <a-row :gutter="[16, 16]">
      <!-- 空间使用情况分析组件 -->
      <a-col :xs="24" :md="12">
        <SpaceUsageAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <!-- 空间分类分析组件 -->
      <a-col :xs="24" :md="12">
        <SpaceCategoryAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <!-- 空间标签分析组件 -->
      <a-col :xs="24" :md="12">
        <SpaceTagAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <!-- 空间文件大小分析组件 -->
      <a-col :xs="24" :md="12">
        <SpaceSizeAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <!-- 空间用户分析组件 -->
      <a-col :xs="24" :md="12">
        <SpaceUserAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>

      <!-- 空间排行分析组件（仅管理员可见） -->
      <a-col :xs="24" :md="12" v-if="isAdmin">
        <SpaceRankAnalyze :spaceId="spaceId" :queryAll="queryAll" :queryPublic="queryPublic" />
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
#spaceAnalyzePage {
  margin-bottom: 16px;
}
</style>
