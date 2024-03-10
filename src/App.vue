<script setup lang="ts">
import { getScrollRef } from './utils/scroll';
import * as data from '@/globalData';

const router = useRouter();
const menu = ref('dashboard');
const showNav = getScrollRef(1);

// 监听路由变化，修改菜单选中状态
router.beforeEach((to, from) => {
  menu.value = to.name as string;
});

// 初始化全局数据
data.InitGlobalData();

// 监听菜单，跳转到用户选择的页面
watch(menu, () => {
  router.push({ name: menu.value })
});
</script>

<template>
  <header id="header" :class="showNav ? 'showNav' : 'hideNav'">
    <div id="header-content">
      <div id="header-left">
        <img src="@/assets/logo.svg" alt="Logo" width="50px" height="50px">
        <el-radio-group v-model="menu">
          <el-radio-button label="仪表盘" value="dashboard" />
          <el-radio-button label="记录" value="record" />
          <el-radio-button label="类别" value="category" />
        </el-radio-group>
      </div>

      <div id="header-right">
        <el-text>{{ data.HeaderInfo.nickname.value }}</el-text>
        <el-avatar>
          <icon-ep-user-filled />
        </el-avatar>
      </div>
    </div>
  </header>

  <main id="main">
    <RouterView />
  </main>
</template>

<style scoped>
#header {
  position: fixed;
  top: 0;

  width: 100vw;

  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 5px 15px;

  background-color: #f0f2f5;
  border-bottom: 1px solid #ebeef5;
}

#header-content {
  width: 100vw;
  max-width: 960px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

#header-left,
#header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.showNav {
  transition: transform 0.2s ease-in-out 0.2s;
  transform: translateZ(0);
}

.hideNav {
  transition: transform 0.2s ease-in-out 0.2s;
  transform: translateY(-100%);
}

#main {
  max-width: 960px;
  margin: 80px auto 0 auto;
  padding: 0 15px;
}
</style>
