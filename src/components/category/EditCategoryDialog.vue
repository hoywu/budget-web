<script setup lang="ts">
import * as data from '@/globalData';

export interface CategoryDialogData {
    visible: boolean;
    isEdit: boolean;
    data: data.Category | null;
}

const model = defineModel<CategoryDialogData>({ required: true });

const dialogTitle = ref('新建类别');
const dialogForm = ref({
    Name: '',
});

watch(model.value, (val) => {
    if (val.isEdit) {
        dialogTitle.value = '编辑类别';
        dialogForm.value.Name = model.value.data!.Name;
    } else {
        dialogTitle.value = '新建类别';
        dialogForm.value.Name = '';
    }
});

const check = () => {
    if (dialogForm.value.Name === '') {
        ElMessage({
            message: '类别名不能为空',
            type: 'warning',
        });
        return false;
    }
    return true;
}

function add() {
    data.NewCategory(dialogForm.value.Name).then(() => {
        ElMessage({
            message: '新建类别成功',
            type: 'success',
        });
    }).catch((err) => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
    model.value.visible = false;
}

function edit() {
    data.UpdateCategory(model.value.data!.ID, dialogForm.value.Name).then(() => {
        ElMessage({
            message: '编辑类别成功',
            type: 'success',
        });
    }).catch((err) => {
        ElMessage({
            message: err.message,
            type: 'error',
        });
    });
    model.value.visible = false;
}

const handleConfirm = () => {
    if (!check()) return

    if (model.value.isEdit) {
        edit();
    } else {
        add();
    }
}

const close = () => {
    model.value.visible = false;
}
</script>

<template>
    <el-dialog v-model="model.visible" :title="dialogTitle" width="350">
        <el-form>
            <el-form-item label="类别名" required>
                <el-input v-model="dialogForm.Name" autocomplete="off" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </div>
        </template>
    </el-dialog>
</template>
