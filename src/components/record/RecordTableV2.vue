<script setup lang="ts">
import type { Record } from '@/globalData';
import * as data from '@/globalData';
import { getShortDate } from '@/utils/date';

const selection = defineModel<Record[]>();
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

const msgBox = (row: Record) => {
    ElMessageBox.alert(row.Note, '备注', {
        type: 'info',
    });
};
</script>

<template>
    <el-table :data="tableData" @selection-change="selection = $event"
              style="width: 100%;" cell-class-name="table-cell">
        <el-table-column type="selection" width="30" />
        <el-table-column label="记录" show-overflow-tooltip>
            <template #header>
                <el-input v-model="search" placeholder="搜索..." clearable />
            </template>

            <template #default="scope">

                <div id="row">
                    <div id="row-col">
                        <el-text size="small">{{ getShortDate(scope.row.Time) }}</el-text>
                        <div>
                            <el-text size="small" v-if="scope.row.CategoryName">{{ scope.row.CategoryName }}</el-text>
                            <el-tag v-else type="warning" size="small">丢失</el-tag>
                        </div>
                    </div>

                    <div id="row-col" v-if="scope.row.Tag">
                        <div style="display: flex; align-items: center">
                            <el-text size="small">{{ scope.row.Title }}</el-text>
                            <el-icon v-if="scope.row.Note"
                                     @click="msgBox(scope.row)"
                                     style="margin-left: 1px">
                                <icon-ep-info-filled />
                            </el-icon>
                        </div>

                        <div style="display: flex; align-items: center; gap: 2px;">
                            <el-tag size="small"
                                    v-for="tag of scope.row.Tag.split(';').filter((tag: string) => tag !== '')">
                                {{ tag }}
                            </el-tag>
                        </div>
                    </div>
                    <div id="row-col" v-else style="display: flex; justify-content: center;">
                        <el-text>{{ scope.row.Title }}</el-text>
                    </div>

                    <div style="margin-left: 5px; display: flex; align-items: center; justify-content: space-between;">
                        <span class="amount-plus" v-if="scope.row.IsPlus">+{{ scope.row.Amount }}</span>
                        <span class="amount-minus" v-else>-{{ scope.row.Amount }}</span>
                    </div>
                </div>

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

<style scoped>
#row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    overflow: hidden;
}

#row-col {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.amount-plus {
    font-weight: 700;
    color: green;
}

.amount-minus {
    font-weight: 700;
    color: #f56c6c;
}
</style>

<style>
.table-cell * {
    line-height: normal;
    align-self: unset;
}
</style>
