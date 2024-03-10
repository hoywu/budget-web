<script setup lang="ts">
import * as data from '@/globalData';
import * as c from "@/utils/calculator";

const props = defineProps<{
    item: data.Budget;
}>();
const emit = defineEmits<{
    edit: [row: data.Budget];
}>();

const showDetail = ref(false);

const usage = computed(() => {
    if (props.item.Type === 1) {
        // TODO
        ElMessage.error('Tag 类型预算未实现');
    }
    if (props.item.Type === 2) {
        return c.getCategoryBudgetUsage(
            props.item.TypeName, props.item.Cycle, props.item.FirstDayOfCycle
        );
    }
    return 0;
});
const budgetAmount = computed(() => {
    return parseFloat(props.item.Amount);
});
const percentage = computed(() => {
    let remain;
    let p;
    if (props.item.DisplayType === 1) {
        remain = budgetAmount.value - usage.value;
        p = (remain / budgetAmount.value) * 100;
    } else {
        p = (dailyRemain.value / cumulativeBudget.value) * 100;
    }
    if (p < 0) return 0;
    if (p > 100) return 100;
    return p;
});
const colors = computed(() => {
    if (props.item.DisplayType === 1) {
        return [
            { color: '#f56c6c', percentage: 20 },
            { color: '#e6a23c', percentage: 50 },
            { color: '#409eff', percentage: 100 },
        ]
    }
    return [
        { color: '#409eff', percentage: 100 },
    ]
});
const cycleDays = computed(() => {
    return c.getBudgetCycleDays(props.item.Cycle, props.item.FirstDayOfCycle);
});
const dailyBudget = computed(() => {
    let r = c.getDailyBudget(props.item.Cycle, props.item.Amount, props.item.FirstDayOfCycle);
    return Math.floor(r * 100) / 100;
});
const passedDays = computed(() => {
    return c.getBudgetPassedDays(props.item.Cycle, props.item.FirstDayOfCycle);
});
const cumulativeBudget = computed(() => {
    const day = passedDays.value + 1;
    const sum = dailyBudget.value * day;
    return Math.floor(sum * 100) / 100;
});
const dailyRemain = computed(() => {
    const v = cumulativeBudget.value - usage.value;
    return Math.floor(v * 100) / 100;
});
const avgUsage = computed(() => {
    return Math.floor((usage.value / (passedDays.value + 1)) * 100) / 100;
});

const handleClick = () => {
    showDetail.value = !showDetail.value;
}
const handleEdit = (budget: data.Budget) => {
    emit('edit', budget);
}
const handleDelete = (budget: data.Budget) => {
    data.DeleteBudget(budget.ID!).then(() => {
        ElMessage.success('删除预算成功');
    }).catch((err) => {
        ElMessage.error(err.message);
    });
}
</script>

<template>
    <el-card shadow="hover" body-class="my-card">

        <div class="card-body" @click="handleClick">
            <div class="card-header">
                <div class="card-header-left">
                    {{ props.item.TypeName }}
                    <el-tag type="primary" size="small" class="tag">
                        <span class="tag-icon"><icon-lucide-timer-reset /></span>
                        <span>{{ props.item.FirstDayOfCycle }}日</span>
                    </el-tag>
                </div>

                <div class="card-header-right">
                    <div v-if="props.item.DisplayType === 1">
                        <el-text :type="usage >= budgetAmount ? 'danger' : ''">
                            ¥{{ usage }} / ¥{{ props.item.Amount }}
                        </el-text>
                    </div>

                    <div v-if="props.item.DisplayType === 2" style="display: flex; align-items: center;">
                        <icon-tabler-droplet-dollar />
                        <el-text>¥{{ dailyRemain }}(+{{ dailyBudget }}) / ¥{{ props.item.Amount }}</el-text>
                    </div>
                </div>
            </div>

            <el-progress :percentage="percentage" :color="colors" :show-text="false" />
        </div>

        <div class="card-detail" v-if="showDetail">
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <el-button type="primary" @click="handleEdit(props.item)">编辑预算</el-button>
                    <el-popconfirm title="确认删除？" @confirm="handleDelete(props.item)">
                        <template #reference>
                            <el-button type="danger">删除预算</el-button>
                        </template>
                    </el-popconfirm>
                </div>
                <div style="display: flex; align-items: center;">
                    <el-text size="small">日均支出: ¥{{ avgUsage }}</el-text>
                </div>
            </div>
            <div>
                <el-text size="small">周期已过: {{ passedDays }}/{{ cycleDays }}天</el-text>
                <el-progress :percentage="(passedDays / cycleDays) * 100" status="success" :show-text="false" />
            </div>
        </div>

    </el-card>
</template>

<style>
.my-card {
    padding: 10px;
}

.tag>* {
    display: flex;
    align-items: center;
    gap: 1px;
}
</style>

<style scoped>
.card-body {
    display: flex;
    flex-direction: column;
    gap: 5px;

    font-size: 14px;
    color: #606266;
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-header-left {
    display: flex;
    align-items: center;
    gap: 5px;
}

.card-header-right {
    display: flex;
    align-items: center;
    gap: 1px;
}

.card-detail {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.tag-icon {
    height: 13px;
    width: 13px;
}

.tag-icon svg {
    height: 100%;
    width: 100%;
}
</style>
