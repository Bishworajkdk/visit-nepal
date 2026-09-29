/*
  Visit Nepal settings
  ====================
  This is the only file you need to edit to change how the live parts of the site behave.
  Everything else updates itself.

  After editing, save the file and reload the page. No other changes are needed.
*/
window.VISIT_NEPAL_CONFIG = {

  /* How often the news reloads while a page is open, in minutes.
     Results are also remembered for this long, so visitors load faster and the
     free feed service is not overused. */
  refreshMinutes: 30,

  /* Services used to read news feeds. They are tried in order until one works.
     {url} is replaced with the address of the feed. */
  feedReaders: [
    { type: "json", url: "https://api.rss2json.com/v1/api.json?rss_url={url}" },
    { type: "xml", url: "https://api.allorigins.win/raw?url={url}" }
  ],

  /* News feeds. Each entry can list several feeds; the first one that
     returns headlines is shown. Any RSS feed address works here, for example a
     publisher's own feed or a Google News search.
     To change a Google News search, edit the words after q= (use + between words). */
  feeds: {
    nepal: [
      "https://news.google.com/rss/search?q=Nepal+when:3d&hl=en-US&gl=US&ceid=US:en"
    ],
    travel: [
      "https://news.google.com/rss/search?q=Nepal+(tourism+OR+trekking+OR+tourists)+when:14d&hl=en-US&gl=US&ceid=US:en"
    ],
    nepali: [
      "https://news.google.com/rss?hl=ne&gl=NP&ceid=NP:ne"
    ]
  },

  /* How many headlines to show in each list. */
  headlines: 8,

  /* Festivals and public days that fall on the same Nepali date every year.
     Format: "month-day", where Baisakh is month 0 and Chaitra is month 11. */
  fixedFestivals: {
    "0-1": "Nepali New Year",
    "1-15": "Republic Day",
    "2-15": "Paddy Day, Dahi Chiura",
    "5-3": "Constitution Day",
    "8-15": "Tamu Lhosar",
    "9-1": "Maghe Sankranti",
    "10-7": "Democracy Day"
  },

  /* A short note shown for each Nepali month, from Baisakh to Chaitra. */
  monthNotes: [
    "Nepali New Year on 1 Baisakh. Bisket Jatra fills Bhaktapur, and Buddha Jayanti often falls on the Baisakh full moon.",
    "Republic Day on 15 Jestha. Hot in the lowlands before the monsoon.",
    "The monsoon arrives. On 15 Asar families plant rice and eat curd and beaten rice.",
    "Monsoon month, sacred to Shiva. Janai Purnima often falls on the full moon.",
    "Gai Jatra, Teej and Krishna Janmashtami often fall this month. Indra Jatra comes at the end of Bhadra or early Asoj.",
    "Constitution Day on 3 Asoj. Dashain, Nepal's biggest festival, often begins this month.",
    "Tihar, the festival of lights, and Chhath in the Terai. Clear mountain views.",
    "Dry, clear and the start of the wedding season.",
    "The coldest month. The Gurung new year, Tamu Lhosar, falls on 15 Poush.",
    "Maghe Sankranti on 1 Magh. Sonam Lhosar and Basanta Panchami often fall this month.",
    "Democracy Day on 7 Falgun. Maha Shivaratri and Holi usually fall this month.",
    "Ghode Jatra, the horse festival, is held in Kathmandu. Spring flowers in the hills."
  ],

  /* Daily rashifal. Each sign opens its reading for today on Hamro Patro,
     which updates every day on its own. Change these links to use another source. */
  rashifal: {
    page: "https://www.hamropatro.com/rashifal",
    signs: {
      mesh: "https://www.hamropatro.com/rashifal",
      brish: "https://www.hamropatro.com/rashifal/brish",
      mithun: "https://www.hamropatro.com/rashifal/mithun",
      karkat: "https://www.hamropatro.com/rashifal/karkat",
      singha: "https://www.hamropatro.com/rashifal/singha",
      kanya: "https://www.hamropatro.com/rashifal/kanya",
      tula: "https://www.hamropatro.com/rashifal/tula",
      brischik: "https://www.hamropatro.com/rashifal/brischik",
      dhanu: "https://www.hamropatro.com/rashifal/dhanu",
      makar: "https://www.hamropatro.com/rashifal/makar",
      kumbha: "https://www.hamropatro.com/rashifal/kumbha",
      meen: "https://www.hamropatro.com/rashifal/meen"
    }
  },

  /* Map backgrounds. Visitors can switch between them with the button on the map.
     If the first one fails to load, the next one is used automatically.
     Keep each credit line visible; it is a condition of free use.
     Places and routes are in js/map-data.js. */
  map: {
    layers: [
      {
        name: "Streets",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
      },
      {
        name: "Satellite",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics'
      },
      {
        name: "Topographic",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        attribution: 'Tiles &copy; Esri and contributors'
      }
    ]
  },

  /* Live weather on the Guide page, from Open-Meteo (free, no key needed).
     Add or remove places; use the same latitude and longitude format. */
  weather: [
    { name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
    { name: "Pokhara", lat: 28.2096, lng: 83.9856 },
    { name: "Namche", lat: 27.8069, lng: 86.7140 },
    { name: "Chitwan", lat: 27.5746, lng: 84.4935 }
  ],

  /* Shown if a photo cannot load. */
  fallbackPhoto: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80"
};
