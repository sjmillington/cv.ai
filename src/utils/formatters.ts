
export const formatMonthYearDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' : ''}${date.getMonth()+1}`
}