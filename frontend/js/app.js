import moment from 'Moment'


const now = moment()
console.log(now.format())
const year = now.year()
const calendarEl = $('.calendar');
let firstIteration = true;
let activeMonth = now.month(); // The month you are looking at at this point. Is defaulted to january for now
let activeYear = year;

for (let currentMonth = activeMonth; currentMonth < 1; currentMonth++) {
    const month = moment([year, currentMonth]);

    let monthEl = $('<div />').addClass('month');
    monthEl.data('month', currentMonth);
    monthEl.data('year', year);

    let firstDayOfMonthNumber = ((month.date(1).weekday() - 1) + 8);
    firstDayOfMonthNumber = (firstDayOfMonthNumber > 7) ? firstDayOfMonthNumber - 7 : firstDayOfMonthNumber;

    // get all the days before the first of this month to pre-fill the month (If january 1 is on a wednesday, fill monday and tuesday with 30 and 31 dec)
    const lastMonth = getLastMonth(year, currentMonth)
    const lastDayOfLastMonth = lastMonth.endOf('month').format('D');
    const daysInThisWeekFromLastMonth = (lastDayOfLastMonth - firstDayOfMonthNumber) + 2; // compensate 1 because sunday is day 0
    for (var i = daysInThisWeekFromLastMonth; i <= lastDayOfLastMonth; i++) {
        const thisDate = lastMonth.date(i);

        let dayEl = createDayElement(thisDate);
        dayEl.addClass('prev-month');
        monthEl.append(dayEl);
    }

    let dayIterator = firstDayOfMonthNumber;

    /*
        Use this to define which day in this month is last.
        We use this later on to decide how many days of the next month should be appended to this month
    */
    let lastDay = false;
    for (let i = 1; i <= month.daysInMonth(); i++) {
        const thisDate = moment([year, currentMonth]).date(i);
        if (thisDate >= now) {
            console.log(thisDate.format());
        }

        let dayEl = createDayElement(thisDate);
        monthEl.append(dayEl);
        monthEl.hide();

        if (dayIterator === 8) {
            dayIterator = 0;
        } else {
            ++dayIterator;
        }

        lastDay = thisDate;
    }

    if (firstIteration) {
        calendarEl.find('.navigation .month-name').html(month.format('MMMM'));
        addCalendarButtonListeners();

        firstIteration = false;
        monthEl.show();
    }

    /*
        we have saved the lastDay of the month iteration. So we can just count back from 7 to the last day in the month
        to figure out how many days from the next month should be added to this month's calendar
    */
    for (var nextMonthDay = 1; nextMonthDay <= (7 - lastDay.weekday()); nextMonthDay++) {
        const dateForNextMonth = moment([year, currentMonth +1, nextMonthDay]);

        let dayEl = createDayElement(dateForNextMonth);
        dayEl.addClass('next-month');
        monthEl.append(dayEl);
    }

    calendarEl.find('.months').append(monthEl);
}

function getLastMonth (year, month) {
    let newMonth = month - 1

    if (newMonth < 0) {
        newMonth = 11
        --year
    }

    return moment([year, newMonth])
}

function createDayElement (date) {
    let dayEl = $('<div/>').addClass('day');
    dayEl.data('date', date.format('YYYY-MM-DD'));
    dayEl.html(date.format('DD'));

    dayEl.on('click', function (e) {
        console.log($(this).data('date'));
    });

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


    return selectedMonth;
}
