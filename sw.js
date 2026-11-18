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

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener("periodicsync", (event) => {
    if (event.tag === "daily-holiday-check") {
        event.waitUntil(checkHolidayInBackground());
    }
});

async function checkHolidayInBackground() {
    const today = new Date();
    const holidayKey = `${today.getMonth() + 1}-${today.getDate()}`;
    const holiday = indianHolidays[holidayKey];

    if (holiday) {
        self.registration.showNotification(`🇮🇳 ${holiday.name}`, {
            body: holiday.wish,
            tag: `holiday-${holidayKey}`
        });
    }
}
