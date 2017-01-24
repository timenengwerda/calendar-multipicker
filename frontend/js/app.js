import moment from 'Moment'



const year = 2017
const calendarEl = $('.calendar');
let firstIteration = true;
let activeMonth = 0; // The month you are looking at at this point. Is defaulted to january for now
let activeYear = 2017;

for (let currentMonth = activeMonth; currentMonth <= 1; currentMonth++) {
    const month = moment([year, currentMonth]);

    let monthEl = $('<div />').addClass('month');
    monthEl.data('month', currentMonth);
    monthEl.data('year', year);

    // add blank days until the first day of the month is reached
    // i.e if february 1 starts on a wednesday the monday and tuesday before that should be greyed out
    let firstDayOfMonthNumber = ((month.date(1).weekday() - 1) + 8);
    firstDayOfMonthNumber = (firstDayOfMonthNumber > 7) ? firstDayOfMonthNumber - 7 : firstDayOfMonthNumber;
    for (var i = 1; i < firstDayOfMonthNumber; i++) {
        let dayEl = $('<div/>').addClass('day').addClass('inactive');
        monthEl.append(dayEl);
    }

    /*
        Use a day iterator to see where the month ends(31 january is on wednesday for example,
        we want to know this so we can add blank days up until the following sunday)
    */

    let dayIterator = firstDayOfMonthNumber;

    for (let i = 1; i <= month.daysInMonth(); i++) {
        const thisDate = moment([year, currentMonth]).date(i);

        let dayEl = createDayElement(thisDate)p

        monthEl.append(dayEl);
        monthEl.hide();

        if (dayIterator === 8) {
            dayIterator = 0;
        } else {
            ++dayIterator;
        }
        // console.log(dayIterator);
    }

    if (firstIteration) {
        calendarEl.find('.navigation .month-name').html(month.format('MMMM'));
        addCalendarButtonListeners();

        firstIteration = false;
        monthEl.show();
    }

    // See how many days it iterated this week. Subtract this by 7(The number of days in a week)
    for (var nextMonthDay = 1; nextMonthDay <= (7 - dayIterator); nextMonthDay++) {
        console.log(moment([year, currentMonth + 1, nextMonthDay]).format() +'<--');
    }

    calendarEl.find('.months').append(monthEl);
}

function createDayElement (date) {
    let dayEl = $('<div/>').addClass('day');
    dayEl.data('date', date.format('YYYY-MM-DD'));
    dayEl.html(date.format('DD'));

    return dayEl;
}

function addCalendarButtonListeners () {
    let previousBtn = calendarEl.find('.navigation .previous');
    let nextBtn = calendarEl.find('.navigation .next');

    previousBtn.hide(); // Its hidden because we always start at the front, and theres no previous there

    nextBtn = calendarEl.find('.navigation .next').on('click', function (e) {
        e.preventDefault();
        // console.log(activeMonth, activeYear);

        slideToNextMonth();
    });

    previousBtn = calendarEl.find('.navigation .previous').on('click', function (e) {
        e.preventDefault();
    });
}

function slideToNextMonth () {
    slideToMonth(activeMonth + 1, activeYear);
}

function slideToMonth (month, year) {

}

function findCalendarView(month, year) {
    let selectedMonth = false;
    $('.month').each(function () {
        if ($(this).data('month') === month && $(this).data('year') === year) {
            selectedMonth = $(this);

            return;
        }
    });

    console.log(selectedMonth);

    return selectedMonth;
}
