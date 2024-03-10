export function formatDate(date: Date): string {
    const padStart = (value: number) => value.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = padStart(date.getMonth() + 1);
    const day = padStart(date.getDate());
    const hour = padStart(date.getHours());
    const minute = padStart(date.getMinutes());
    const second = padStart(date.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getShortDate(date: string): string {
    let s = date.split(/[- :]/);
    return `${s[1]}/${s[2]} ${s[3]}:${s[4]}`;
}

export function getLastSevenDaysArray(): string[] {
    const today = new Date();
    const arr: string[] = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        arr.push(date.getDate() + '日');
    }

    return arr.reverse();
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
}
