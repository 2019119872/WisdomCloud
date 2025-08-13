<script setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
import GlobalSider from '@/components/GlobalSider.vue'
</script>

<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout>
        <GlobalSider class="sider" />
        <a-layout-content class="content">
          <!--        注意闭合，否则编写页面相应的内容后页面无法展示内容-->
          <router-view />
        </a-layout-content>
      </a-layout>
      <a-layout-footer class="footer">
        <a href="#" target="_blank">WisdonCloud by @Tiamo</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#basicLayout .header {
  background-color: #fff;
  margin-bottom: 1px;
  padding-inline: 16px;
}
#basicLayout .sider {
  padding-top: 20px;
  background-color: #fff;
  bdorder-right: 0.5px solid #eee;
}

#basicLayout .content {
  padding: 28px;
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
}
#basicLayout :deep(.ant-menu-root ) {
  border-bottom: none !important;
  border-inline-end: none !important;
}
#basicLayout .footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: #efefef;
}
</style>
