<script setup lang="ts">
import * as data from '@/globalData';
import BudgetItem from '@/components/budget/BudgetItem.vue';

const emit = defineEmits<{
    add: [];
    edit: [budget: data.Budget];
}>();

const handleAdd = () => {
    emit('add');
}

const handleEdit = (budget: data.Budget) => {
    emit('edit', budget);
}
</script>

<template>
    <div class="budget-wrapper">
        <div class="budget-header">
            <div class="budget-title">预算一览</div>
            <el-button @click="handleAdd" text circle>
                <icon-ep-circle-plus />
            </el-button>
        </div>

        <el-card @click="handleAdd" class="placeholder-card" shadow="hover"
                 v-if="data.budgetList.value!.length === 0">
            <div class="placeholder-body">
                <icon-ep-circle-plus />
                <span>暂无预算，点击创建</span>
            </div>
        </el-card>

        <div class="budget-list">
            <BudgetItem v-for="item of data.budgetList.value"
                        :item="item" :key="item.ID" @edit="handleEdit" />
        </div>
    </div>
</template>

<style scoped>
.budget-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.budget-header {
    display: flex;
    align-items: center;
}

.budget-title {
    font-weight: 700;
    color: #606266;
}

.placeholder-card {
    max-width: 480px;
    cursor: pointer;
}

.placeholder-body {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #909399;
}

.budget-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-start;
    box-sizing: border-box;
}

.budget-list>* {
    flex: 1 1 calc(50% - 10px);
    min-width: 340px;
    max-width: 475px;
    box-sizing: border-box;
}
</style>
