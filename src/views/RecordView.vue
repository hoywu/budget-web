<script setup lang="ts">
import type { Record } from '@/globalData';
import * as data from '@/globalData';
import RecordTableV2 from '@/components/record/RecordTableV2.vue';
import EditRecordDialog from '@/components/record/EditRecordDialog.vue';
import type { RecordDialogData } from '@/components/record/EditRecordDialog.vue';

const dialogData = ref<RecordDialogData>({
    visible: false,
    isEdit: false,
    data: null,
});

const selection = ref<Record[]>();

const handleAdd = () => {
    if (!data.categoryList.value
        || data.categoryList.value.length === 0) {
        ElMessage.warning('请先新建至少一个分类');
        return;
    }
    dialogData.value.isEdit = false;
    dialogData.value.visible = true;
};
const handleEdit = (row: Record) => {
    dialogData.value.isEdit = true;
    dialogData.value.data = row;
    dialogData.value.visible = true;
};
const handleDelete = () => {
    for (const record of selection.value!) {
        data.DeleteRecord(record.ID!).then(() => {
            ElMessage.success('删除记录成功');
        }).catch((err) => {
            ElMessage.error(err.message);
        });
    }
};

const editBtn = () => {
    if (selection.value && selection.value.length === 1) {
        handleEdit(selection.value[0]);
    } else {
        ElMessage.warning('只能选择一条记录编辑哦');
    }
};
const popconfirmTitle = computed(() => {
    return '确认删除 ' + selection.value?.length + ' 条记录？';
});
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

            <el-button type="primary" @click="editBtn"
                       :disabled="!selection || !selection.length">
                <el-icon class="el-icon--left">
                    <icon-ep-edit />
                </el-icon>
                编辑
            </el-button>

            <el-popconfirm :title="popconfirmTitle" @confirm="handleDelete">
                <template #reference>
                    <el-button type="danger"
                               :disabled="!selection || !selection.length">
                        <el-icon class="el-icon--left">
                            <icon-ep-delete />
                        </el-icon>
                        删除
                    </el-button>
                </template>
            </el-popconfirm>
        </div>

        <RecordTableV2 @edit="handleEdit" v-model="selection" />
    </main>

    <EditRecordDialog v-model="dialogData" />
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
}
</style>
