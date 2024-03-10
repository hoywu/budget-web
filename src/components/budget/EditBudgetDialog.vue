<script setup lang="ts">
import * as data from '@/globalData';

export interface BudgetDialogData {
    visible: boolean;
    isEdit: boolean;
    data: data.Budget | null;
}

const model = defineModel<BudgetDialogData>({ required: true });

watch(model.value, () => {
    if (model.value.isEdit) {
        dialogTitle.value = '编辑预算';
        dialogForm.value.Type = model.value.data!.Type;
        dialogForm.value.TypeName = model.value.data!.TypeName;
        dialogForm.value.Amount = model.value.data!.Amount;
        dialogForm.value.Cycle = model.value.data!.Cycle;
        dialogForm.value.FirstDayOfCycle = model.value.data!.FirstDayOfCycle;
        dialogForm.value.DisplayType = model.value.data!.DisplayType;
    } else {
        dialogTitle.value = '创建预算';
        clear();
    }
});

const dialogTitle = ref('创建预算');
const dialogForm = ref<data.Budget>({
    Type: 2,
    TypeName: '',
    Amount: '',
    Cycle: 3,
    FirstDayOfCycle: 1,
    DisplayType: 1,
});


const clear = () => {
    dialogForm.value.Type = 2;
    dialogForm.value.TypeName = '';
    dialogForm.value.Amount = '';
    dialogForm.value.Cycle = 3;
    dialogForm.value.FirstDayOfCycle = 1;
    dialogForm.value.DisplayType = 1;
}
const close = () => {
    clear();
    model.value.visible = false;
}
const check = () => {
    if (dialogForm.value.TypeName === '') {
        ElMessage({
            message: '名称不能为空',
            type: 'warning',
        });
        return false;
    }
    if (dialogForm.value.Amount === '') {
        ElMessage({
            message: '额度不能为空',
            type: 'warning',
        });
        return false;
    }
    return true;
}


function add() {
    data.NewBudget(dialogForm.value).then(() => {
        ElMessage.success('创建预算成功');
    }).catch((err) => {
        ElMessage.error(err.message);
    });
}
function edit() {
    const budget = Object.assign({}, dialogForm.value); // 注意!不能直接使用dialogForm.value
    budget.ID = model.value.data!.ID;
    data.UpdateBudget(budget).then(() => {
        ElMessage.success('编辑预算成功');
    }).catch((err) => {
        ElMessage.error(err.message);
    });
}
const handleConfirm = () => {
    if (!check()) return
    model.value.isEdit ? edit() : add();
    close();
}
</script>

<template>
    <el-dialog v-model="model.visible" :title="dialogTitle" width="350"
               :close-on-click-modal="false" :show-close="false">
        <el-form>
            <el-form-item label="预算类型" required>
                <el-radio-group v-model="dialogForm.Type">
                    <el-radio :value="1" disabled>标签Tag</el-radio>
                    <el-radio :value="2">类别</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="名称" required v-if="dialogForm.Type == 1">
                <el-input v-model="dialogForm.TypeName" placeholder="请输入标签名" />
            </el-form-item>
            <el-form-item label="名称" required v-if="dialogForm.Type == 2">
                <el-select v-model="dialogForm.TypeName" placeholder="请选择类别">
                    <el-option v-for="item in data.categoryList.value"
                               :key="item.ID"
                               :label="item.Name"
                               :value="item.Name" />
                </el-select>
            </el-form-item>

            <el-form-item label="额度" required>
                <el-input v-model="dialogForm.Amount" placeholder="0.00" clearable />
            </el-form-item>

            <el-form-item label="周期" required>
                <el-radio-group v-model="dialogForm.Cycle">
                    <el-radio :value="1">每日</el-radio>
                    <el-radio :value="2">每周</el-radio>
                    <el-radio :value="3">每月</el-radio>
                    <el-radio :value="4" disabled>每年</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item :label="(dialogForm.Cycle === 2 ? '周' : '月') + '起始日'" required
                          v-if="dialogForm.Cycle === 2 || dialogForm.Cycle === 3">
                <el-input-number v-model="dialogForm.FirstDayOfCycle" :min="1" :max="28" />
            </el-form-item>

            <el-form-item label="显示" required>
                <el-radio-group v-model="dialogForm.DisplayType">
                    <el-radio :value="1">首日回满</el-radio>
                    <el-radio :value="2">每日逐增</el-radio>
                </el-radio-group>
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
