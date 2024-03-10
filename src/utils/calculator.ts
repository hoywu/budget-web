import Big from 'big.js';
import * as data from "@/globalData";
import { isSameDay } from "./date";

export function getLastSevenDaysExpenseArray() {
    const today = new Date();
    const arr: number[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        let sum = new Big(0);
        for (let record of data.recordList.value!) {
            if (record.IsPlus) continue;

            if (isSameDay(new Date(record.Time), date)) {
                sum = sum.plus(record.Amount);
            }
        }

        arr.push(parseFloat(sum.toFixed(2)));
    }

    return arr.reverse();
}

function getCategoryName(record: data.Record) {
    if (record.CategoryName) return record.CategoryName;

    let find = data.categoryList.value!.find((category) => category.ID === record.CategoryID)
    if (find) {
        record.CategoryName = find.Name;
    }
    return record.CategoryName;
}

export function getCategoryBudgetUsage(categoryName: string, cycle: number, startDay: number) {
    if (cycle === 1) return getCategoryBudgetUsageDaily(categoryName);
    if (cycle === 2) return getCategoryBudgetUsageWeekly(categoryName, startDay);
    if (cycle === 3) return getCategoryBudgetUsageMonthly(categoryName, startDay);
    return 0; // TODO: 年预算待实现
}

function getCategoryBudgetUsageDaily(categoryName: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sum = new Big(0);
    for (let record of data.recordList.value!) {
        if (!isSameDay(new Date(record.Time), today)) break;
        if (record.IsPlus) continue;
        if (getCategoryName(record) !== categoryName) continue;

        sum = sum.plus(record.Amount);
    }

    return parseFloat(sum.toFixed(2));
}

function getCategoryBudgetUsageWeekly(categoryName: string, startDay: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let endDate = new Date(today);
    endDate.setDate(today.getDate() - (today.getDay() + 7 - startDay) % 7);

    let sum = new Big(0);
    for (let record of data.recordList.value!) {
        if (new Date(record.Time).getTime() < endDate.getTime()) break;
        if (record.IsPlus) continue;
        if (getCategoryName(record) !== categoryName) continue;

        sum = sum.plus(record.Amount);
    }

    return parseFloat(sum.toFixed(2));
}

function getCategoryBudgetUsageMonthly(categoryName: string, startDay: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let endDate = new Date(today);
    if (today.getDate() < startDay) {
        endDate.setMonth(today.getMonth() - 1);
        endDate.setDate(startDay);
    } else {
        endDate.setDate(startDay);
    }

    let sum = new Big(0);
    for (let record of data.recordList.value!) {
        if (new Date(record.Time).getTime() < endDate.getTime()) break;
        if (record.IsPlus) continue;
        if (getCategoryName(record) !== categoryName) continue;

        sum = sum.plus(record.Amount);
    }

    return parseFloat(sum.toFixed(2));
}

export function getBudgetPassedDays(cycle: number, startDay: number) {
    // 获取周期内已经过去的天数
    if (cycle === 1) return 0;
    if (cycle === 2) return getBudgetPassedDaysWeekly(startDay);
    if (cycle === 3) return getBudgetPassedDaysMonthly(startDay);
    return 0; // TODO: 年预算待实现
}

function getBudgetPassedDaysWeekly(startDay: number) {
    const today = new Date().getDay();
    return (today + 7 - startDay) % 7;
}

function getBudgetPassedDaysMonthly(startDay: number) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (today.getDate() < startDay) {
        let lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1, startDay);
        return (today.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24);
    } else {
        let startDate = new Date(today);
        startDate.setDate(startDay);
        return (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    }
}

export function getBudgetCycleDays(cycle: number, startDay: number) {
    // 获取周期天数
    if (cycle === 1) return 1;
    if (cycle === 2) return 7;
    if (cycle === 3) return getMonthlyCycleDays(startDay);
    const year = new Date().getFullYear();
    const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    return isLeapYear ? 366 : 365;
}

function getMonthlyCycleDays(startDay: number) {
    // 获取月预算的周期天数
    let day = new Date();
    day.setHours(0, 0, 0, 0);

    if (day.getDate() < startDay) {
        let lastMonth = new Date(day);
        lastMonth.setMonth(day.getMonth() - 1, startDay);
        day.setDate(startDay);
        return (day.getTime() - lastMonth.getTime()) / (1000 * 60 * 60 * 24);
    } else {
        let nextMonth = new Date(day);
        nextMonth.setMonth(day.getMonth() + 1, startDay);
        day.setDate(startDay);
        return (nextMonth.getTime() - day.getTime()) / (1000 * 60 * 60 * 24);
    }
}

export function getDailyBudget(cycle: number, amount: string, startDay?: number) {
    // 获取周期内平均每天的预算
    if (cycle === 1) {
        return parseFloat(amount);
    }
    if (cycle === 2) {
        return parseFloat(amount) / 7;
    }
    if (cycle === 3) {
        return parseFloat(amount) / getMonthlyCycleDays(startDay!);
    }
    const year = new Date().getFullYear();
    const isLeapYear = ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    return parseFloat(amount) / (isLeapYear ? 366 : 365);
}
