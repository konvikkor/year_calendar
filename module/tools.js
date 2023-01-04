/**
 * @param {String} name 
 * @param {*} data 
 * @returns {CustomEvent}
 */
export function CreateEvent(name, data){ return new CustomEvent(name, { detail: data }); }
/**
 * @param {Date} targetDate 
 * @returns {Date[]}
 */
export function GetAllDaysInAMonth(targetDate){
    if (targetDate.constructor.name !== 'Date'){ throw "Parameter must be a date" }
    let ret = [], localYear = targetDate.getUTCFullYear(), localMonth = targetDate.getUTCMonth();
    let localDate = new Date(localYear, localMonth, 1, 0, 0, 0, 0);
    do {
        ret.push(new Date(localDate));
        localDate.setTime(localDate.getTime()+(60*60*24*1000));
    } while (localDate.getUTCMonth() == localMonth);
    return ret;
}
/**
 * @param {Date} targetDate 
 * @param {Intl.LocalesArgument} locale 
 * @returns {String}
 */
export function DayOfTheWeekToText(targetDate, locale = 'default'){
    if (targetDate.constructor.name !== 'Date'){ throw "Parameter must be a date" }
    return targetDate.toLocaleString(locale,{weekday:"short"});
}
/**
 * @param {Date} targetDate 
 * @param {Intl.LocalesArgument} locale 
 * @returns {String}
 */
export function MonthToText(targetDate, locale = 'default'){
    if (targetDate.constructor.name !== 'Date'){ throw "Parameter must be a date" }
    return targetDate.toLocaleString(locale,{month:"short"})
}


