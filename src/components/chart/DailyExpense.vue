<script setup lang="ts">
import * as echarts from 'echarts';
import * as c from "@/utils/calculator";
import { getLastSevenDaysArray } from '@/utils/date';

const props = defineProps<{
    width: string;
    height: string;
}>();

const chartElem = ref<HTMLElement | null>(null);

const setChart = (option: any) => {
    let chart = echarts.init(chartElem.value);
    chart.setOption(option);

    window.addEventListener('resize', () => {
        chart.resize();
    });
};

const option = {
    grid: { top: 10, left: 0, right: 0, bottom: 0, containLabel: true },
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
    },
    xAxis: {
        type: 'category',
        data: getLastSevenDaysArray(),
    },
    yAxis: {
        type: 'value',
    },
    series: [
        {
            data: c.getLastSevenDaysExpenseArray(),
            type: 'line',
            smooth: true,
        }
    ],
};

onMounted(() => {
    setChart(option);
});
</script>

<template>
    <div class="chart-wrapper">
        <div class="chart-title">近7日支出</div>
        <div ref="chartElem" :style="{ width: props.width, height: props.height }"></div>
    </div>
</template>

<style scoped>
.chart-wrapper {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
}

.chart-title {
    font-weight: 700;
    color: #606266;
}
</style>
