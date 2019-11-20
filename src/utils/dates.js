const nextYear = () => {
    const YEAR_IN_MILLISECONDS = 365 * 24 * 60 * 60 * 1000
    let date = new Date()
    date.setTime(date.getTime()+YEAR_IN_MILLISECONDS)
    return date
}

const nextDay = () => {
    const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000
    let date = new Date()
    date.setTime(date.getTime()+DAY_IN_MILLISECONDS)
    return date
}

module.exports = {
    nextYear,
    nextDay
}