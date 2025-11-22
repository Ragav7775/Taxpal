
// Utility to get YYYY-MM string
export const getMonthYear = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

// Calculate % change
export const calcPercentageChange = (current: number, prev: number) => {
    if (prev === 0 && current === 0) return "No change";
    if (prev === 0 && current > 0) return "↑100% (from 0 last month)";
    if (prev === 0 && current < 0) return "↓100% (from 0 last month)";

    const change = ((current - prev) / prev) * 100;
    const symbol = change > 0 ? "↑" : change < 0 ? "↓" : "";
    return change === 0
        ? "No change"
        : `${symbol}${Math.abs(change).toFixed(1)}% from last Month`;
};
