import moment from 'Moment'

const year = 2017
const calendarEl = $('.calendar');
let firstIteration = true;
let activeMonth = 0; // The month you are looking at at this point. Is defaulted to january for now
let activeYear = 2017;

for (let currentMonth = 0; currentMonth <= 1; currentMonth++) {
    const month = moment([year, currentMonth]);

    let monthEl = $('<div />').addClass('month');
    monthEl.data('month', currentMonth);
    monthEl.data('year', year);

    for (let i = 1; i <= month.daysInMonth(); i++) {
        const thisDate = moment([year, currentMonth]).date(i);
        let dayEl = $('<div/>').addClass('day');
        dayEl.data('date', thisDate.format('YYYY-MM-DD'));
        dayEl.html(thisDate.format('DD'));

        monthEl.append(dayEl);
        monthEl.hide();
    }


    if (firstIteration) {
        calendarEl.find('.navigation .month-name').html(month.format('MMMM'));
        addCalendarButtonListeners();

        firstIteration = false;
        monthEl.show();
    }


    calendarEl.find('.months').append(monthEl);

}

function addCalendarButtonListeners () {
    const nextBtn = calendarEl.find('.navigation .next').on('click', function (e) {
        e.preventDefault();
        console.log(activeMonth, activeYear);
    });

    const previousBtn = calendarEl.find('.navigation .previous').on('click', function (e) {
        e.preventDefault();
    });
}
