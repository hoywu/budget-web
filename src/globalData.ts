import type { Ref } from 'vue';
import $ from "./utils/api";

export let EnteryPath: string = '/dashboard';
export const HeaderInfo = {
    nickname: ref(''),
};

export interface UserInfo {
    Nickname: string;
    Avatar: string;
}
export interface Category {
    ID: number;
    Name: string;
    Icon: string;
}
export interface Record {
    ID?: number;
    Time: string;
    Title: string;
    Amount: string;
    IsPlus: boolean;
    Tag: string;
    Note: string;
    CategoryID: number;
    CategoryName?: string;
}
export interface Budget {
    ID?: number
    Type: number;
    TypeName: string;
    Amount: string;
    Cycle: number;
    FirstDayOfCycle: number;
    DisplayType: number;
}

export const userInfo: Ref<UserInfo | null> = ref(null);
export const categoryList: Ref<Category[] | null> = ref(null);
export const recordList: Ref<Record[] | null> = ref(null);
export const budgetList: Ref<Budget[] | null> = ref(null);

export const InitGlobalData = function jumpToLoadingPageIfNoUserInfo() {
    const router = useRouter()
    const path = location.pathname.replace(import.meta.env.BASE_URL, '');
    if (path !== '/' && path !== '') {
        // 记录下用户刷新的位置，以便全局数据初始化完成后跳转回来
        EnteryPath = path;
    }
    if (userInfo.value === null) {
        // 跳转到loading页组件，由该组件负责获取加载数据
        router.push({ name: 'loading' })
    }
};

// Init
export async function InitUserInfo(): Promise<any> {
    if (userInfo.value !== null) {
        return userInfo;
    }
    const res = await $.getUserInfo();
    if (res.data.code === 0) {
        userInfo.value = res.data.data.userInfo;
        HeaderInfo.nickname.value = userInfo.value!.Nickname;
        return userInfo;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function InitCategoryList(): Promise<any> {
    if (categoryList.value !== null) {
        return categoryList;
    }
    const res = await $.getCategoryList();
    if (res.data.code === 0) {
        categoryList.value = res.data.data.Categories;
        return categoryList;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function InitRecordList(): Promise<any> {
    if (recordList.value !== null) {
        return recordList;
    }
    const res = await $.getRecordList();
    if (res.data.code === 0) {
        recordList.value = res.data.data.Records;
        return recordList;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function InitBudgetList(): Promise<any> {
    if (budgetList.value !== null) {
        return budgetList;
    }
    const res = await $.getBudgetList();
    if (res.data.code === 0) {
        budgetList.value = res.data.data.Budgets;
        return budgetList;
    } else {
        throw new Error(res.data.msg);
    }
}

// Category
export async function NewCategory(name: string) {
    const res = await $.newCategory(name);
    if (res.data.code === 0) {
        categoryList.value!.push(res.data.data.Category);
        return res.data.data.Category;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function UpdateCategory(ID: number, newName: string) {
    const res = await $.updateCategory(ID, newName);
    if (res.data.code === 0) {
        let index = categoryList.value!.findIndex((item) => item.ID === ID);
        categoryList.value![index].Name = newName;
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}
export async function DeleteCategory(name: string) {
    const res = await $.deleteCategory(name);
    if (res.data.code === 0) {
        let index = categoryList.value!.findIndex((item) => item.Name === name);
        categoryList.value!.splice(index, 1);
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}

// Record
export async function NewRecord(r: Record) {
    const res = await $.newRecord(r);
    if (res.data.code === 0) {
        recordList.value!.unshift(res.data.data.Record);
        return res.data.data.Record;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function UpdateRecord(r: Record) {
    const res = await $.updateRecord(r);
    if (res.data.code === 0) {
        let index = recordList.value!.findIndex((item) => item.ID === r.ID);
        recordList.value![index] = r;
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}
export async function DeleteRecord(id: number) {
    const res = await $.deleteRecord(id);
    if (res.data.code === 0) {
        let index = recordList.value!.findIndex((item) => item.ID === id);
        recordList.value!.splice(index, 1);
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}

// Budget
export async function NewBudget(b: Budget) {
    const res = await $.newBudget(b);
    if (res.data.code === 0) {
        budgetList.value!.push(res.data.data.Budget);
        return res.data.data.Budget;
    } else {
        throw new Error(res.data.msg);
    }
}
export async function UpdateBudget(b: Budget) {
    const res = await $.updateBudget(b);
    if (res.data.code === 0) {
        let index = budgetList.value!.findIndex((item) => item.ID === b.ID);
        budgetList.value![index] = b;
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}
export async function DeleteBudget(id: number) {
    const res = await $.deleteBudget(id);
    if (res.data.code === 0) {
        let index = budgetList.value!.findIndex((item) => item.ID === id);
        budgetList.value!.splice(index, 1);
        return Promise.resolve();
    } else {
        throw new Error(res.data.msg);
    }
}
