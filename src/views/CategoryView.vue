<script setup lang="ts">
import type { Category } from '@/globalData';
import type { CategoryDialogData } from '@/components/category/EditCategoryDialog.vue';
import CategoryTable from '@/components/category/CategoryTable.vue';
import EditCategoryDialog from '@/components/category/EditCategoryDialog.vue';

const dialogData = ref<CategoryDialogData>({
    visible: false,
    isEdit: false,
    data: null,
});

function handleAdd() {
    dialogData.value.isEdit = false;
    dialogData.value.visible = true;
}

function handleEdit(row: Category) {
    dialogData.value.isEdit = true;
    dialogData.value.data = row;
    dialogData.value.visible = true;
}
</script>

<template>
    <main>
        <div id="control">
            <el-button type="primary" @click="handleAdd">
                <el-icon class="el-icon--left">
                    <icon-ep-circle-plus />
                </el-icon>
                新建
            </el-button>
        </div>

        <CategoryTable @edit="handleEdit" />
    </main>

    <EditCategoryDialog v-model="dialogData" />
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}

#control {
    display: flex;
}
</style>
