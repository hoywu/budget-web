<script setup lang="ts">
import * as data from '@/globalData';

const emit = defineEmits<{
    edit: [row: data.Category];
}>();

function handleEdit(index: number, row: data.Category) {
    emit('edit', row);
}

function handleDelete(index: number, row: data.Category) {
    data.DeleteCategory(row.Name).then(() => {
        ElMessage({
            message: '删除类别成功',
            type: 'success',
        });
    }).catch((err) => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
}
</script>

<template>
    <el-table :data="data.categoryList.value" id="category-table" stripe>
        <el-table-column prop="Name" label="类别名" />

        <el-table-column label="操作" align="right" width="150">
            <template #default="scope">

                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.$index, scope.row)">
                    <template #reference>
                        <el-button size="small" type="danger">删除</el-button>
                    </template>
                </el-popconfirm>

            </template>
        </el-table-column>
    </el-table>
</template>
