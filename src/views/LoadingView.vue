<script setup lang="ts">
import * as data from '@/globalData';

const router = useRouter();
const loading = ref(true);

let p1 = data.InitUserInfo().catch((err) => {
    ElNotification({
        title: '获取用户信息失败',
        message: err.message,
        type: 'error',
        duration: 0,
    });
    throw err;
});
let p2 = data.InitCategoryList().catch((err) => {
    ElNotification({
        title: '获取类别列表失败',
        message: err.message,
        type: 'error',
        duration: 0,
    })
    throw err
});
let p3 = data.InitRecordList().catch((err) => {
    ElNotification({
        title: '获取记录列表失败',
        message: err.message,
        type: 'error',
        duration: 0,
    })
    throw err
});
let p4 = data.InitBudgetList().catch((err) => {
    ElNotification({
        title: '获取预算列表失败',
        message: err.message,
        type: 'error',
        duration: 0,
    })
    throw err
});
Promise.all([p1, p2, p3, p4]).then(
    () => {
        // 数据加载成功，跳转到指定页面
        router.push({ path: data.EnteryPath });
    },
    () => {
        // 数据加载失败，停留在当前页面，关闭加载动画
        loading.value = false;
    }
);
</script>

<template>
    <div id="wrapper" v-loading="loading">

    </div>
</template>

<style scoped>
#wrapper {
    width: 100%;
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>