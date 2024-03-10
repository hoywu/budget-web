<script setup lang="ts">
import type { Budget } from '@/globalData';
import type { BudgetDialogData } from '@/components/budget/EditBudgetDialog.vue';
import DailyExpense from '@/components/chart/DailyExpense.vue';
import BudgetSummary from '@/components/budget/BudgetSummary.vue';
import EditBudgetDialog from '@/components/budget/EditBudgetDialog.vue';

const dialogData = ref<BudgetDialogData>({
    visible: false,
    isEdit: false,
    data: null,
});

const handleAdd = () => {
    dialogData.value.isEdit = false;
    dialogData.value.visible = true;
}

const handleEdit = (budget: Budget) => {
    dialogData.value.isEdit = true;
    dialogData.value.data = budget;
    dialogData.value.visible = true;
}
</script>

<template>
    <DailyExpense width="100%" height="15vh" />
    <BudgetSummary @add="handleAdd" @edit="handleEdit" />

    <EditBudgetDialog v-model="dialogData" />
</template>

<style scoped></style>
