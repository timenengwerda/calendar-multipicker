import moment from 'Moment'


const now = moment()
let year = now.year()

const calendarEl = $('.calendar');
let previousBtn = calendarEl.find('.navigation .previous');
let nextBtn = calendarEl.find('.navigation .next');
let isAnimating = false;

let firstIteration = true;
let activeMonth = now.month(); // The month you are looking at at this point. Is defaulted to january for now
let activeYear = year;

let addedDates = [];
for (let currentMonth = activeMonth; currentMonth < 12; currentMonth++) {
    let thisMonth = currentMonth;
    if (currentMonth > 11) {

        thisMonth = currentMonth - 12;

        if (thisMonth === 0) {
            ++year
        }
    }
    // const thisMonth = (currentMonth > 11) ? currentMonth - 12 : currentMonth;
    const month = moment([year, thisMonth]);

    let monthEl = $('<div />').addClass('month');
    monthEl.data('month', thisMonth);
    monthEl.data('year', year);

    let firstDayOfMonthNumber = ((month.date(1).weekday() - 1) + 8);
    firstDayOfMonthNumber = (firstDayOfMonthNumber > 7) ? firstDayOfMonthNumber - 7 : firstDayOfMonthNumber;

    // get all the days before the first of this month to pre-fill the month (If january 1 is on a wednesday, fill monday and tuesday with 30 and 31 dec)
    const lastMonth = getLastMonth(year, thisMonth)
    const lastDayOfLastMonth = lastMonth.endOf('month').format('D');
    const daysInThisWeekFromLastMonth = (lastDayOfLastMonth - firstDayOfMonthNumber) + 2; // compensate 1 because sunday is day 0
    for (var i = daysInThisWeekFromLastMonth; i <= lastDayOfLastMonth; i++) {
        const thisDate = lastMonth.date(i);
        // set this date to the absolute last second of the day
        thisDate.hours(23)
        thisDate.minutes(59)
        thisDate.seconds(59)
        thisDate.milliseconds(59)

        let dayEl = createDayElement(thisDate);
        dayEl.addClass('prev-month');
        dayEl.data('is-prev-month', true);

        if (thisDate < now) {
            // This date is in the past. Deactive it
            dayEl.addClass('inactive');
            dayEl.data('inactive', true);
        }

        monthEl.append(dayEl);
    }

    let dayIterator = firstDayOfMonthNumber;

    /*
        Use lastDay to define which day in this month is last.
        We use this later on to decide how many days of the next month should be appended to this month
    */
    let lastDay = false;
    for (let i = 1; i <= month.daysInMonth(); i++) {
        const thisDate = moment([year, thisMonth]).date(i);
        // set this date to the absolute last second of the day
        thisDate.hours(23)
        thisDate.minutes(59)
        thisDate.seconds(59)
        thisDate.milliseconds(59)

        let dayEl = createDayElement(thisDate);
        if (thisDate < now) {
            // This date is in the past. Deactive it
            dayEl.addClass('inactive');
            dayEl.data('inactive', true);
        }

        monthEl.append(dayEl);

        if (dayIterator === 8) {
            dayIterator = 0;
        } else {
            ++dayIterator;
        }

        lastDay = thisDate;
    }

    if (firstIteration) {
        calendarEl.find('.navigation .month-name').html(month.format('MMMM YYYY'));
        addCalendarButtonListeners();

        firstIteration = false;
        monthEl.css({
            'opacity': 1,
            'display': 'block'
        });
    }

    /*
        we have saved the lastDay of the month iteration. So we can just count back from 7 to the last day in the month
        to figure out how many days from the next month should be added to this month's calendar
    */
    if (lastDay.weekday() > 0) {
        const daysToAppend = (7 - lastDay.weekday())
        for (var nextMonthDay = 1; nextMonthDay <= daysToAppend; nextMonthDay++) {
            const dateForNextMonth = moment([year, thisMonth +1, nextMonthDay]);
            dateForNextMonth.hours(23)
            dateForNextMonth.minutes(59)
            dateForNextMonth.seconds(59)
            dateForNextMonth.milliseconds(59)

            let dayEl = createDayElement(dateForNextMonth);
            dayEl.addClass('next-month');
            dayEl.data('is-next-month', true);
            monthEl.append(dayEl);
        }
    }
    calendarEl.find('.months').append(monthEl);

    // make the months div as high as 6 day's stacked on top of eachother
    calendarEl.find('.months').height($('.month .day').outerHeight() * 6);

    buttonsHideOrShow();
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
    let dayEl = $('<a/>').addClass('day');
    dayEl.attr('href', '#');
    dayEl.data('date', date.format('x'));
    dayEl.attr('data-date', date.format('x'));

    let day = date.format('DD');
    if (day === '01') {
        day = date.format('DD MMM')
    }
    dayEl.html(day);

    dayEl.on('click', function (e) {
        // If the button is inactive, toss it out
        if ($(this).data('inactive') && $(this).data('inactive') === true) {
            return;
        }

        let date = $(this).data('date');
        const indexOfDate = addedDates.findIndex(a => a === date)
        if (indexOfDate < 0) {
            addedDates.push(date);
            $(`[data-date=${date}]`).addClass('selected');
        } else {
            addedDates.splice(indexOfDate, 1);
            $(`[data-date=${date}]`).removeClass('selected');
        }


        if ($(this).data('is-next-month') && $(this).data('is-next-month') === true) {
            navigateToNextMonth();
        } else if ($(this).data('is-prev-month') && $(this).data('is-prev-month') === true) {
            navigateToPreviousMonth();
        }
    });

    return dayEl;
}



function addCalendarButtonListeners () {
    previousBtn.addClass('inactive'); // Its hidden because we always start at the front, and theres no previous there

    nextBtn = calendarEl.find('.navigation .next').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('inactive')){
            return;
        }
        navigateToNextMonth();
    });

    previousBtn = calendarEl.find('.navigation .previous').on('click', function (e) {
        e.preventDefault();
        if ($(this).hasClass('inactive')){
            return;
        }
        navigateToPreviousMonth();
    });
}

function getNextMonth () {
    let m = activeMonth;
    let y = activeYear;

    if ((m + 1) < 12) {
        ++m
    } else {
        y++
        m = 0
    }

    return findCalendarView(m, y)
}

function getPreviousMonth () {
    let m = activeMonth;
    let y = activeYear;

    if ((m - 1) < 0) {
        m = 11
        --y
    } else {
        --m
    }

    return findCalendarView(m, y)
}

function navigateToNextMonth () {
    if (!isAnimating) {
        isAnimating = true;
        if ((activeMonth + 1) < 12) {
            ++activeMonth
        } else {
            activeYear++
            activeMonth = 0
        }

        navigateToMonth(activeMonth, activeYear);
        buttonsHideOrShow();
    }
}

function navigateToPreviousMonth () {
    if (!isAnimating) {
        isAnimating = true;
        if ((activeMonth - 1) < 0) {
            activeMonth = 11
            --activeYear
        } else {
            --activeMonth
        }

        navigateToMonth(activeMonth, activeYear);
        buttonsHideOrShow();
    }
}

function buttonsHideOrShow () {
    if (!getNextMonth().length) {
        nextBtn.addClass('inactive')
    } else {
        nextBtn.removeClass('inactive')
    }

    if (!getPreviousMonth().length) {
        previousBtn.addClass('inactive');
    } else {
        previousBtn.removeClass('inactive');
    }
}


function navigateToMonth (month, year) {
    calendarEl.find('.navigation .month-name').html(moment([year, month, 1]).format('MMMM YYYY'));
    const monthToShow = findCalendarView(month, year);
    if (monthToShow) {
        $('.month').not(monthToShow).animate({
            opacity: 0
        }, 300, function () {
            $(this).hide();
        });

        monthToShow.show();
        monthToShow.animate({
            opacity: 1
        }, 300, function () {
            isAnimating = false
        });
    }
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
