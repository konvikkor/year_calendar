/**
 * @typedef {Object} CalendarOptions
 * @property {'month'|'year'=} type
 * @property {number=}start
 * @property {number=}end
 */

import { CreateEvent } from "./tools.js";
export class calendar extends EventTarget{
    /** @type {HTMLElement} */ #root;
    /** @type {CalendarOptions} */ #localOptions;
    /** @param {CustomEvent} event */
    #init(event){
        let localCalendar = event.detail;
        console.log(`Init DEMO`, localCalendar);
    }
    get options(){return Object.assign({},this.#localOptions);}
    get root(){return this.#root;}
    /** @param {CalendarOptions} options */
    constructor(options){
        super();
        /** @type {CalendarOptions} */
        let tmpOption = {type:"month"};
        this.#localOptions = Object.assign(tmpOption,options);
        this.addEventListener('init',this.#init,{once:true});
        let localEvent = CreateEvent('init',this);
        this.dispatchEvent(localEvent);
        calendarList.push(this);
    }
    free(){
        return calendarList.findIndex(v=>{return v == this})
    }
}

export const calendarList = [];