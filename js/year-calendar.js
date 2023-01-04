class year_calendar {
	_current_year;
	_languages = ['ru', 'en'];
	_exception_dates = [];
	_element = null;
	_callback = undefined;

	_language = '';
	_month_name_list = {
		'ru': ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		'en': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};
	_weekday_name_list = {
		'ru': ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
		'en': ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
	};
	_first_day = {
		'ru': 1,
		'en': 0
	};

	_header = {
		'ru': 'Календарь на',
		'en': 'Calendar for'
	};
	_month_in_line = 4;

	getDaysInMonth(month, year) {
		let days_in_month = [31, (year % 4 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		return days_in_month[month];
	}

	constructor({ element, year = new Date().getFullYear(), lang = 'ru', callback = undefined, exception_dates = [] }) {

		if (element == undefined || element == null)
			throw ('элемент не может быть неопределённым');

		if (this._languages.indexOf(lang) >= 0)
			this._language = this._languages[this._languages.indexOf(lang)];
		else {
			this._language = this._languages[0];
		}

		this._element = element;
		if (callback != undefined) {
			if (typeof (callback) === 'function') {
				this._callback = callback;
			}
			else {
				throw ('callback функция не может быть не функцией');
			}
		}
		this._element.innerHTML = '';
		this._current_year = year;
		this._exception_dates = exception_dates;
	}

	clear_exception_date() {
		this.exception_dates = [];
	}

	add_exception_date(date) {
		if (date != null && date != undefined)
			this.exception_dates.push(date);
	}

	add_exception_dates(dates) {
		if (dates != null && dates != undefined)
			this.exception_dates = dates;
	}

	getMonthLayout(month, year) {
		let month_name_thead = `<th colspan="7" class="calendar_month_header">${this._month_name_list[this._language][month]}</th>`;
		let week_name_thead = `<tr><th>${this._weekday_name_list[this._language][0]}</th><th>${this._weekday_name_list[this._language][1]}</th><th>${this._weekday_name_list[this._language][2]}</th><th>${this._weekday_name_list[this._language][3]}</th><th>${this._weekday_name_list[this._language][4]}</th><th>${this._weekday_name_list[this._language][5]}</th><th>${this._weekday_name_list[this._language][6]}</th><tr>`;
		let weeks_layout = '';
		let daysInMonth = this.getDaysInMonth(month, year);
		let firstDay = new Date(year, month, 1).getDay();
		let day = 0;
		let now = new Date();
		let Weekend = [];

		if (this._first_day[this._language] == 1) {
			if (firstDay == 0) {
				firstDay = 6;
			}
			else {
				firstDay = firstDay - 1;
			}

			Weekend = [5, 6];
		}
		else {
			Weekend = [0, 6];
		}

		for (let week = 0; week <= Math.ceil(daysInMonth / 7); week++) {
			let week_row_layout = '<tr align="center" valign="center">';

			if (week == 0 && firstDay > 0) {
				for (let i = firstDay; i > 0; i--) {
					week_row_layout += '<td></td>';
				}
			}

			for (let dayOfWeek = firstDay; dayOfWeek < 7 && day < daysInMonth; dayOfWeek++) {
				day++;
				if (now.getDate() == day && month == now.getMonth() && year == now.getFullYear()) {
					week_row_layout += `<td class="calendar_day calendar_today" data-month="${month + 1}" data-year="${year}" data-day="${day}">${day}</td>`;
				}
				else {
					let current = String(day).padStart(2, '0') + '.' + String(month + 1).padStart(2, '0') + '.' + String(year);
					let is_exception_date = this._exception_dates.includes(current);

					if (Weekend.includes(dayOfWeek)) {
						week_row_layout += `<td class="calendar_day ${(!is_exception_date) ? 'calendar_weekend' : ''}" data-month="${month + 1}" data-year="${year}" data-day="${day}">${day}</td>`;
					}
					else {
						week_row_layout += `<td class="calendar_day ${(is_exception_date) ? 'calendar_weekend' : ''}" data-month="${month + 1}" data-year="${year}" data-day="${day}">${day}</td>`;
					}
				}
			}

			firstDay = 0;

			week_row_layout += '</tr>';
			weeks_layout += week_row_layout;
		}

		let month_layout = `<table class="calendar_month"><thead><tr>${month_name_thead}</tr><tr>${week_name_thead}</tr><tbody>${weeks_layout}</tbody></table>`;

		return month_layout;
	}

	getYearLayout(year) {
		let year_layout = `<table><thead><tr><th colspan="${this._month_in_line}">${this._header[this._language]} ${this._current_year}</th></tr></thead><tbody><tr align="center" valign="top">`;

		for (let month = 0; month < 12; month++) {
			let month_layout = this.getMonthLayout(month, this._current_year);
			year_layout += `<td style="padding: 10px;">${month_layout}</td>`
			if ((month + 1) % this._month_in_line == 0)
				year_layout += '</tr><tr align="center" valign="top">'
		}
		year_layout += '</tr></tbody></table>';
		return year_layout;
	}

	draw() {
		if (this._element == undefined || this._element == null)
			throw ('элемент не может быть неопределённым');
		else
			this._element.innerHTML = this.getYearLayout(this.current_year);

		if (typeof (this._callback) === 'function') {
			let days = this._element.getElementsByClassName('calendar_day');
			for (let i = 0; i < days.length; i++) {
				days[i].onclick = function (event) {
					this._callback(event.target, event.target.getAttribute('data-day'), event.target.getAttribute('data-month'), event.target.getAttribute('data-year'));
				}.bind(this);
			}
		}
	}
}