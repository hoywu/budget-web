import axios from 'axios';
import config from '@/config/config';
import type { Record, Budget } from '@/globalData';

const $ = axios.create({
    baseURL: config.apiBaseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
    },
});

function updateToken() {
    let token = localStorage.getItem('token');
    if (!token) {
        location.href = config.loginPagePath;
    }
    $.defaults.headers.Authorization = token;
}

const api = {
    getUserInfo() {
        updateToken();
        return $.get(config.apiGetUserInfo);
    },

    // Category
    getCategoryList() {
        updateToken();
        return $.get(config.apiGetCategoryList);
    },
    newCategory(name: string) {
        updateToken();
        return $.post(config.apiNewCategory, {
            name,
            icon: '',
        });
    },
    updateCategory(ID: number, newName: string) {
        updateToken();
        return $.post(config.apiUpdateCategory, {
            ID,
            name: newName,
            icon: '',
        });
    },
    deleteCategory(name: string) {
        updateToken();
        return $.post(config.apiDeleteCategory, {
            name,
        });
    },

    // Record
    getRecordList() {
        updateToken();
        return $.get(config.apiGetRecordList);
    },
    newRecord(r: Record) {
        updateToken();
        return $.post(config.apiNewRecord, {
            time: r.Time,
            title: r.Title,
            amount: r.Amount,
            isPlus: r.IsPlus,
            tag: r.Tag,
            note: r.Note,
            cid: r.CategoryID,
        });
    },
    updateRecord(r: Record) {
        updateToken();
        return $.post(config.apiUpdateRecord, {
            id: r.ID,
            data: {
                time: r.Time,
                title: r.Title,
                amount: r.Amount,
                isPlus: r.IsPlus,
                tag: r.Tag,
                note: r.Note,
                cid: r.CategoryID,
            },
        });
    },
    deleteRecord(id: number) {
        updateToken();
        return $.post(config.apiDeleteRecord, {
            id,
        });
    },

    // Budget
    getBudgetList() {
        updateToken();
        return $.get(config.apiGetBudgetList);
    },
    newBudget(b: Budget) {
        updateToken();
        return $.post(config.apiNewBudget, {
            type: b.Type,
            typeName: b.TypeName,
            amount: b.Amount,
            cycle: b.Cycle,
            firstDayOfCycle: b.FirstDayOfCycle,
            displayType: b.DisplayType,
        });
    },
    updateBudget(b: Budget) {
        updateToken();
        return $.post(config.apiUpdateBudget, {
            id: b.ID,
            data: {
                type: b.Type,
                typeName: b.TypeName,
                amount: b.Amount,
                cycle: b.Cycle,
                firstDayOfCycle: b.FirstDayOfCycle,
                displayType: b.DisplayType,
            },
        });
    },
    deleteBudget(id: number) {
        updateToken();
        return $.post(config.apiDeleteBudget, {
            id,
        });
    },
};

export default api;
