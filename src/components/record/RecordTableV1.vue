<script setup lang="ts">
import type { Record } from '@/globalData';
import * as data from '@/globalData';
import { getShortDate } from '@/utils/date';

const emit = defineEmits<{
    edit: [row: data.Record];
}>();

const page = ref(1);
const pageSize = ref(10);
const search = ref('');
const filterFn = function (data: Record, index: number) {
    if (search.value !== '') {
        return data.Title.toLowerCase().includes(search.value.toLowerCase()) ||
            data.Amount.toLowerCase().includes(search.value.toLowerCase()) ||
            data.Tag.toLowerCase().includes(search.value.toLowerCase()) ||
            data.Note.toLowerCase().includes(search.value.toLowerCase());
    }
    return index >= (page.value - 1) * pageSize.value && index < page.value * pageSize.value;
};
const tableData = computed(() => data.recordList.value!.filter(filterFn).map((record) => {
    let find = data.categoryList.value!.find((category) => category.ID === record.CategoryID)
    if (find) {
        record.CategoryName = find.Name;
    } else {
        record.CategoryName = undefined;
    }
    return record;
}));

const handleEdit = (index: number, row: Record) => {
    emit('edit', row);
}
const handleDelete = (index: number, row: Record) => {
    data.DeleteRecord(row.ID!).then(() => {
        ElMessage({
            message: '删除记录成功',
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
    <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="30" />
        <el-table-column label="时间" prop="Time" width="100" show-overflow-tooltip>
            <template #default="scope">
                <div>{{ getShortDate(scope.row.Time) }}</div>
            </template>
        </el-table-column>
        <el-table-column label="类别" prop="CategoryName" width="120" show-overflow-tooltip>
            <template #default="scope">
                <div v-if="scope.row.CategoryName">{{ scope.row.CategoryName }}</div>
                <el-tag v-else type="warning">丢失</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="标题" prop="Title" width="180" show-overflow-tooltip>
            <template #default="scope">

                <el-popover v-if="scope.row.Note"
                            effect="light" trigger="hover" placement="right" width="auto">
                    <template #default>
                        <div>{{ scope.row.Note }}</div>
                    </template>
                    <template #reference>
                        <div style="display: flex; align-items: center">
                            <span style="margin-right: 2px">{{ scope.row.Title }}</span>
                            <el-icon>
                                <icon-ep-info-filled />
                            </el-icon>
                        </div>
                    </template>
                </el-popover>

                <div v-else>{{ scope.row.Title }}</div>

            </template>
        </el-table-column>
        <el-table-column label="金额" prop="Amount" width="150" show-overflow-tooltip>
            <template #default="scope">
                <div v-if="scope.row.IsPlus" style="color: green;">+{{ scope.row.Amount }}</div>
                <div v-else style="color: red;">-{{ scope.row.Amount }}</div>
            </template>
        </el-table-column>
        <el-table-column label="标签" prop="Tag">
            <template #default="scope">

                <el-popover effect="light" trigger="hover" placement="right" width="auto">
                    <template #default>
                        <div>{{ scope.row.Tag }}</div>
                    </template>
                    <template #reference>
                        <div style="display: flex; align-items: center; gap: 2px;">
                            <el-tag v-if="scope.row.Tag" v-for="tag of scope.row.Tag.split(';') ">
                                {{ tag }}
                            </el-tag>
                        </div>
                    </template>
                </el-popover>

            </template>
        </el-table-column>
        <el-table-column align="right" width="150">
            <template #header>
                <el-input v-model="search" placeholder="搜索..." clearable />
            </template>

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

    <div style="display: flex; align-items: center; gap: 10px;">
        <el-pagination background layout="prev, pager, next"
                       :total="data.recordList.value!.length"
                       :page-size="pageSize"
                       :current-page="page"
                       @current-change="page = $event" />
        <el-select v-model="pageSize" placeholder="页数" style="width: 80px">
            <el-option v-for="item in [10, 20, 50, 100, 500]"
                       :key="item" :label="item" :value="item" />
        </el-select>
    </div>
</template>
