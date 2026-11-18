const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");
const notifyBtn = document.getElementById("notifyBtn");
const themeToggle = document.getElementById("themeToggle");

const selectedDateText = document.getElementById("selectedDateText");
const holidayBox = document.getElementById("holidayBox");
const holidayBanner = document.getElementById("holidayBanner");
const whatsappHolidayBtn = document.getElementById("whatsappHolidayBtn");

const eventTitleInput = document.getElementById("eventTitle");
const eventTimeInput = document.getElementById("eventTime");
const eventCategoryInput = document.getElementById("eventCategory");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");

let currentDate = new Date();
let selectedDateKey = formatDateKey(new Date());
let events = JSON.parse(localStorage.getItem("modernCalendarEvents")) || {};
let currentHolidayObj = null;

const indianHolidays = {
    "1-1": { name: "🎉 New Year's Day", wish: "🎉 Naye Saal ki aap aur aapke parivar ko hardik shubhkamnaye! ✨" },
    "1-14": { name: "🪁 Makar Sankranti", wish: "🪁 Makar Sankranti ke paavan parv ki hardik shubhkamnaye! 🌞" },
    "1-26": { name: "🇮🇳 Republic Day", wish: "🇮🇳 Gantantra Diwas ki hardik shubhkamnaye! Jai Hind! 🫡" },
    "2-15": { name: "🔱 Maha Shivaratri", wish: "🔱 Har Har Mahadev! Maha Shivaratri ki hardik shubhkamnaye. 🙏" },
    "3-4": { name: "🎨 Holi", wish: "🎨 Rangon ke tyohar Holi ki hardik shubhkamnaye! 🌈" },
    "3-27": { name: "🏹 Ram Navami", wish: "🏹 Jai Shri Ram! Ram Navami ki hardik shubhkamnaye. 🙏" },
    "8-15": { name: "🇮🇳 Independence Day", wish: "🇮🇳 Swatantrata Diwas ki hardik shubhkamnaye! Vande Mataram! 🇮🇳" },
    "8-28": { name: "🧵 Raksha Bandhan", wish: "🧵 Raksha Bandhan ki hardik shubhkamnaye! ✨" },
    "9-4": { name: "🪈 Janmashtami", wish: "🪈 Shri Krishna Janmashtami ki hardik shubhkamnaye! 🙏" },
    "9-5": { name: "📚 Teachers' Day", wish: "📚 Shikshak Diwas ki hardik shubhkamnaye! 🙏" },
    "9-14": { name: "🐘 Ganesh Chaturthi", wish: "🐘 Ganpati Bappa Morya! Ganesh Chaturthi ki hardik shubhkamnaye. 🙏" },
    "10-2": { name: "🕊️ Gandhi Jayanti", wish: "🕊️ Gandhi Jayanti ki hardik shubhkamnaye! 🙏" },
    "10-20": { name: "🏹 Dusshera", wish: "🏹 Vijayadashami (Dusshera) ki hardik shubhkamnaye! 🙏" },
    "11-8": { name: "🪔 Deepawali", wish: "🪔 Shubh Deepawali! Maa Lakshmi ki kripa sada bani rahe. ✨" },
    "11-14": { name: "🎈 Children's Day", wish: "🎈 Bal Diwas ki hardik shubhkamnaye! ✨" },
    "11-15": { name: "🌅 Chhath Puja", wish: "🌅 Chhath Puja ki hardik shubhkamnaye! 🙏" },
    "12-25": { name: "🎄 Christmas Day", wish: "🎄 Merry Christmas! ✨" }
};

function formatDateKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function checkHoliday(holidayKey) {
    if (indianHolidays[holidayKey]) {
        currentHolidayObj = indianHolidays[holidayKey];
        holidayBox.style.display = "block";
        holidayBanner.innerText = currentHolidayObj.name;
    } else {
        currentHolidayObj = null;
        holidayBox.style.display = "none";
    }
}

function renderCalendar() {
    calendarDays.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    monthYear.innerText = `${monthNames[month]} ${year}`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("empty");
        calendarDays.appendChild(emptyDiv);
    }

    for (let day = 1; day <= lastDay; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.innerText = day;

        const dateKey = `${year}-${month + 1}-${day}`;
        const holidayKey = `${month + 1}-${day}`;

        if (indianHolidays[holidayKey]) {
            dayDiv.classList.add("holiday-day");
            dayDiv.title = indianHolidays[holidayKey].name;
        }

        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add("today");
        }

        if (dateKey === selectedDateKey) {
            dayDiv.classList.add("selected");
        }

        if (events[dateKey] && events[dateKey].length > 0) {
            dayDiv.classList.add("has-event");
        }

        dayDiv.addEventListener("click", () => {
            selectedDateKey = dateKey;
            selectedDateText.innerText = `${day} ${monthNames[month]} ${year}`;
            checkHoliday(holidayKey);
            renderCalendar();
            renderEvents();
        });

        calendarDays.appendChild(dayDiv);
    }
}

function renderEvents() {
    eventList.innerHTML = "";
    const dayEvents = events[selectedDateKey] || [];

    dayEvents.forEach((ev, index) => {
        const li = document.createElement("li");
        li.classList.add(ev.category);

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("event-details");
        detailsDiv.innerHTML = `<strong>${ev.title}</strong>${ev.time ? `<span class="event-time-tag">⏰ ${ev.time}</span>` : ""}`;

        const delBtn = document.createElement("button");
        delBtn.classList.add("delete-btn");
        delBtn.innerText = "X";
        delBtn.addEventListener("click", () => {
            events[selectedDateKey].splice(index, 1);
            localStorage.setItem("modernCalendarEvents", JSON.stringify(events));
            renderCalendar();
            renderEvents();
        });

        li.appendChild(detailsDiv);
        li.appendChild(delBtn);
        eventList.appendChild(li);
    });
}

function addNewEvent() {
    const title = eventTitleInput.value.trim();
    if (!title) return;

    const newEvent = {
        title: title,
        time: eventTimeInput.value,
        category: eventCategoryInput.value
    };

    if (!events[selectedDateKey]) {
        events[selectedDateKey] = [];
    }
    events[selectedDateKey].push(newEvent);

    localStorage.setItem("modernCalendarEvents", JSON.stringify(events));
    eventTitleInput.value = "";
    eventTimeInput.value = "";
    renderCalendar();
    renderEvents();
}

addEventBtn.addEventListener("click", addNewEvent);
eventTitleInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addNewEvent();
});

prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    selectedDateKey = formatDateKey(currentDate);
    selectedDateText.innerText = "Events for Today";
    checkHoliday(`${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
    renderCalendar();
    renderEvents();
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️ Light" : "🌙 Dark";
});

notifyBtn.addEventListener("click", () => {
    if (!("Notification" in window)) {
        alert("Browser notifications support nahi karta.");
        return;
    }
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            notifyBtn.innerText = "✅ Alerts On";
        }
    });
});

whatsappHolidayBtn.addEventListener("click", () => {
    if (!currentHolidayObj) return;
    const statusText = encodeURIComponent(`${currentHolidayObj.wish}\n\n📅 (${selectedDateText.innerText})`);
    window.open(`https://wa.me{statusText}`, "_blank");
});

// Page load hote hi turant calendar aur dates render karein
checkHoliday(`${currentDate.getMonth() + 1}-${currentDate.getDate()}`);
renderCalendar();
renderEvents();
