 template
<script setup lang="ts">
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
</script>

<template>
  <!-- 基础布局容器 -->
  <div id="basicLayout">
    <!-- 使用 Ant Design Vue 的 Layout 组件创建整体布局结构 -->
    <a-layout style="min-height: 100vh">
      <!-- 顶部导航栏区域 -->
      <a-layout-header class="header">
        <!-- 全局头部组件 -->
        <GlobalHeader />
      </a-layout-header>
      <!-- 中间内容区域布局 -->
      <a-layout>
        <!-- 侧边栏区域 -->
        <GlobalSider class="sider" />
        <!-- 主要内容展示区域 -->
        <a-layout-content class="content">
          <!-- 路由视图容器，用于展示不同页面内容 -->
          <!-- 注意闭合，否则编写页面相应的内容后页面无法展示内容-->
          <router-view />
        </a-layout-content>
      </a-layout>
      <!-- 底部页脚区域 -->
      <a-layout-footer class="footer">
        <!-- 页脚链接信息 -->
        <a href="#" target="_blank">WisdonCloud by @Tiamo</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
/* 顶部导航栏样式 */
#basicLayout .header {
  background-color: #fff;
  margin-bottom: 1px;
  padding-inline: 16px;
}

/* 侧边栏样式 */
#basicLayout .sider {
  padding-top: 20px;
  background-color: #fff;
  bdorder-right: 0.5px solid #eee;
}

/* 主内容区域样式 */
#basicLayout .content {
  padding: 28px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 40px;
}

/* 菜单根元素样式覆盖 */
#basicLayout :deep(.ant-menu-root ) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

/* 底部页脚样式 */
#basicLayout .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: #efefef;
}
</style>

