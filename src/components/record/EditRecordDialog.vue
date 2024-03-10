<script setup lang="ts">
import type { ElInput } from 'element-plus';
import * as data from '@/globalData';
import { formatDate } from '@/utils/date';

export interface RecordDialogData {
    visible: boolean;
    isEdit: boolean;
    data: data.Record | null;
}
const model = defineModel<RecordDialogData>({ required: true });

const dialogTitle = ref('新建记录');
const dialogForm = ref<{
    time: Date;
    title: string;
    amount: string;
    isPlus: boolean;
    categoryID: number | undefined;
    tags: string[];
    note: string;
}>({
    time: new Date(),
    title: '',
    amount: '',
    isPlus: false,
    categoryID: undefined,
    tags: [],
    note: '',
});

const clear = () => {
    dialogForm.value.time = new Date();
    dialogForm.value.title = '';
    dialogForm.value.amount = '';
    // dialogForm.value.isPlus = false;
    // dialogForm.value.categoryID = undefined;
    dialogForm.value.tags = [];
    dialogForm.value.note = '';
}

watch(model.value, (val) => {
    if (val.isEdit) {
        dialogTitle.value = '编辑记录';
        dialogForm.value.time = new Date(model.value.data!.Time);
        dialogForm.value.title = model.value.data!.Title;
        dialogForm.value.amount = model.value.data!.Amount;
        dialogForm.value.isPlus = model.value.data!.IsPlus;
        dialogForm.value.categoryID = model.value.data!.CategoryID;
        dialogForm.value.tags = model.value.data!.Tag.split(';').filter((item) => item !== '');
        dialogForm.value.note = model.value.data!.Note;
    } else {
        dialogTitle.value = '新建记录';
        clear();
    }
});

const tagInputVisible = ref(false);
const tagInputRef = ref<InstanceType<typeof ElInput>>();
const tagInputValue = ref('');
const showTagInput = () => {
    tagInputValue.value = '';
    tagInputVisible.value = true;
    nextTick(() => {
        tagInputRef.value!.input!.focus()
    });
}
const handleTagClose = (tag: string) => {
    dialogForm.value.tags = dialogForm.value.tags.filter((item) => item !== tag);
}
const handleTagInputConfirm = () => {
    tagInputValue.value = tagInputValue.value.trim().replace(/[;]/g, '');
    if (tagInputValue.value) {
        dialogForm.value.tags.push(tagInputValue.value);
    }
    tagInputVisible.value = false;
}

const check = () => {
    if (!dialogForm.value.time) {
        ElMessage.warning('发生时间不能为空');
        return false;
    }
    if (!dialogForm.value.title) {
        ElMessage.warning('标题不能为空');
        return false;
    }
    if (!dialogForm.value.categoryID) {
        ElMessage.warning('类别不能为空');
        return false;
    }
    if (!dialogForm.value.amount) {
        ElMessage.warning('金额不能为空');
        return false;
    }
    return true;
}
const add = () => {
    let record = {
        Time: formatDate(dialogForm.value.time),
        Title: dialogForm.value.title,
        Amount: dialogForm.value.amount,
        IsPlus: dialogForm.value.isPlus,
        Tag: dialogForm.value.tags.join(';'),
        Note: dialogForm.value.note,
        CategoryID: dialogForm.value.categoryID!,
    };
    data.NewRecord(record).then(() => {
        ElMessage({
            message: '新建记录成功',
            type: 'success',
        });
    }).catch((err) => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
}
const edit = () => {
    let record = {
        ID: model.value.data!.ID,
        Time: formatDate(dialogForm.value.time),
        Title: dialogForm.value.title,
        Amount: dialogForm.value.amount,
        IsPlus: dialogForm.value.isPlus,
        Tag: dialogForm.value.tags.join(';'),
        Note: dialogForm.value.note,
        CategoryID: dialogForm.value.categoryID!,
    };
    data.UpdateRecord(record).then(() => {
        ElMessage({
            message: '编辑记录成功',
            type: 'success',
        });
    }).catch((err) => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
}
const confirm = () => {
    if (!check()) return;
    if (model.value.isEdit) {
        edit();
    } else {
        add();
    }
    close();
}
const close = () => {
    model.value.visible = false;
}
</script>

<template>
    <el-dialog v-model="model.visible" :title="dialogTitle" width="350"
               :close-on-click-modal="false" :show-close="false">
        <template #header>
            <div class="dialog-header">
                <span class="el-dialog__title">{{ dialogTitle }}</span>
                <el-switch v-model="dialogForm.isPlus"
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           inactive-text="支出" active-text="收入" />
            </div>
        </template>
        <el-form label-position="top">
            <el-form-item label="发生时间" required>
                <el-date-picker v-model="dialogForm.time"
                                type="datetime"
                                placeholder="选择记录发生时间" />
            </el-form-item>
            <el-form-item label="标题" required>
                <el-input v-model="dialogForm.title" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item label="类别" required>
                <el-select v-model="dialogForm.categoryID" placeholder="请选择类别"
                           style="width: 240px">
                    <el-option v-for="item in data.categoryList.value"
                               :key="item.ID"
                               :label="item.Name"
                               :value="item.ID" />
                </el-select>
            </el-form-item>
            <el-form-item label="金额" required>
                <el-input v-model="dialogForm.amount" placeholder="0.00" clearable />
            </el-form-item>
            <el-form-item label="自定义Tag">
                <div class="tag-group">
                    <el-tag v-for="tag in dialogForm.tags"
                            :key="tag"
                            :disable-transitions="false"
                            closable
                            @close="handleTagClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="tagInputVisible"
                              ref="tagInputRef"
                              v-model="tagInputValue"
                              size="small"
                              @keyup.enter="handleTagInputConfirm"
                              @blur="handleTagInputConfirm" />
                    <el-button v-else class="button-new-tag" size="small" @click="showTagInput">
                        + New Tag
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="dialogForm.note" placeholder="额外备注信息" clearable />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="confirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tag-group {
    display: flex;
    gap: 5px;
}
</style>
