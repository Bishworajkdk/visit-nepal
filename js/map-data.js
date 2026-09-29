/*
  Visit Nepal map data
  ====================
  Add, remove or edit places here. Each place needs:
    name   English name
    ne     Nepali name (optional)
    type   heritage, spiritual, nature, trek, airport or closed
    lat    latitude  (right click a spot on openstreetmap.org and choose "Show address" to find it)
    lng    longitude
    text   one or two short sentences
    link   optional page on this site

  Locations and routes are approximate and meant for planning.
  They are not for navigation on the trail.
*/
window.MAP_DATA = {
  center: [28.25, 84.2],
  zoom: 7,

  places: [
    { name: "Kathmandu Durbar Square", ne: "काठमाडौं दरबार क्षेत्र", type: "heritage", lat: 27.7045, lng: 85.3073, text: "The old royal square of Kathmandu, with pagoda temples, the Hanuman Dhoka palace and the home of the Kumari.", link: "places.html#kathmandu" },
    { name: "Patan Durbar Square", ne: "पाटन दरबार क्षेत्र", type: "heritage", lat: 27.6727, lng: 85.3253, text: "Finely carved temples and the Patan Museum, one of the best in South Asia.", link: "places.html#kathmandu" },
    { name: "Bhaktapur Durbar Square", ne: "भक्तपुर दरबार क्षेत्र", type: "heritage", lat: 27.6720, lng: 85.4281, text: "A car-free old city of brick squares, the Palace of 55 Windows, potters and woodcarvers.", link: "index.html#crafts" },
    { name: "Changu Narayan", ne: "चाँगुनारायण", type: "heritage", lat: 27.7163, lng: 85.4278, text: "Thought to be the oldest temple in the Kathmandu Valley, on a quiet ridge above Bhaktapur." },
    { name: "Bandipur", ne: "बन्दीपुर", type: "heritage", lat: 27.9366, lng: 84.4079, text: "A preserved Newar hill town halfway between Kathmandu and Pokhara, with wide mountain views." },

    { name: "Swayambhunath", ne: "स्वयम्भूनाथ", type: "spiritual", lat: 27.7149, lng: 85.2904, text: "The hilltop stupa with painted eyes, looking over Kathmandu. Climb the eastern stairway at sunrise.", link: "places.html#kathmandu" },
    { name: "Boudhanath", ne: "बौद्धनाथ", type: "spiritual", lat: 27.7215, lng: 85.3620, text: "One of the largest stupas in the world and the centre of Tibetan Buddhist life in Kathmandu.", link: "places.html#kathmandu" },
    { name: "Pashupatinath", ne: "पशुपतिनाथ", type: "spiritual", lat: 27.7105, lng: 85.3488, text: "The great temple of Shiva on the Bagmati River. Come for the evening aarti.", link: "places.html#kathmandu" },
    { name: "Maya Devi Temple, Lumbini", ne: "लुम्बिनी", type: "spiritual", lat: 27.4696, lng: 83.2759, text: "The birthplace of the Buddha, surrounded by monasteries from across the world.", link: "places.html#lumbini" },
    { name: "Muktinath", ne: "मुक्तिनाथ", type: "spiritual", lat: 28.8167, lng: 83.8717, text: "A high shrine sacred to Hindus and Buddhists, with 108 water spouts.", link: "places.html#mustang" },
    { name: "Janaki Mandir, Janakpur", ne: "जानकी मन्दिर", type: "spiritual", lat: 26.7307, lng: 85.9253, text: "A grand white temple to Sita in the heart of Mithila culture." },
    { name: "World Peace Pagoda, Pokhara", ne: "शान्ति स्तूप", type: "spiritual", lat: 28.2011, lng: 83.9447, text: "A white stupa above Phewa Lake with views of the Annapurnas." },
    { name: "Tengboche Monastery", ne: "तेङबोचे गुम्बा", type: "spiritual", lat: 27.8362, lng: 86.7646, text: "The best known monastery of the Khumbu, beneath Ama Dablam.", link: "places.html#everest" },

    { name: "Phewa Lake, Pokhara", ne: "फेवा ताल", type: "nature", lat: 28.2096, lng: 83.9586, text: "Paddle across the lake to the island temple of Tal Barahi.", link: "places.html#annapurna" },
    { name: "Sarangkot", ne: "सराङकोट", type: "nature", lat: 28.2439, lng: 83.9486, text: "The classic sunrise viewpoint over the Annapurnas, and a paragliding launch." },
    { name: "Nagarkot", ne: "नगरकोट", type: "nature", lat: 27.7172, lng: 85.5200, text: "A hill resort on the valley rim with Himalayan sunrises on clear days." },
    { name: "Chitwan National Park, Sauraha", ne: "चितवन", type: "nature", lat: 27.5746, lng: 84.4935, text: "Jungle walks, canoe trips and one-horned rhinos. Check road conditions after the 2026 flood.", link: "places.html#chitwan" },
    { name: "Rara Lake", ne: "रारा ताल", type: "nature", lat: 29.5200, lng: 82.0833, text: "Nepal's largest lake, remote and peaceful in the far west." },

    { name: "Lukla", ne: "लुक्ला", type: "trek", lat: 27.6869, lng: 86.7314, text: "The mountain airstrip where the Everest trek begins.", link: "places.html#everest" },
    { name: "Namche Bazaar", ne: "नाम्चे बजार", type: "trek", lat: 27.8069, lng: 86.7140, text: "The Sherpa capital. Rest here a full day to adjust to the altitude.", link: "places.html#everest" },
    { name: "Everest Base Camp", ne: "सगरमाथा आधार शिविर", type: "trek", lat: 28.0026, lng: 86.8528, text: "At about 5,364 metres, the goal of the classic Khumbu trek.", link: "places.html#everest" },
    { name: "Kala Patthar", ne: "कालापत्थर", type: "trek", lat: 27.9957, lng: 86.8285, text: "The rocky viewpoint with the closest look at Everest's summit.", link: "places.html#everest" },
    { name: "Poon Hill", ne: "पुनहिल", type: "trek", lat: 28.4000, lng: 83.6936, text: "An easy four or five day trek to a famous sunrise over Dhaulagiri and Annapurna.", link: "places.html#annapurna" },
    { name: "Annapurna Base Camp", ne: "अन्नपूर्ण आधार शिविर", type: "trek", lat: 28.5300, lng: 83.8780, text: "A ring of giant peaks around a glacier basin." },
    { name: "Manang", ne: "मनाङ", type: "trek", lat: 28.6667, lng: 84.0167, text: "A stone village on the Annapurna Circuit and the start of the Tilicho side trip.", link: "places.html#annapurna" },
    { name: "Tilicho Lake", ne: "तिलिचो ताल", type: "trek", lat: 28.6833, lng: 83.8500, text: "A glacial lake at 4,919 metres.", link: "places.html#annapurna" },
    { name: "Thorong La", ne: "थोरोङ ला", type: "trek", lat: 28.7930, lng: 83.9380, text: "The high pass of the Annapurna Circuit at 5,416 metres." },
    { name: "Jomsom", ne: "जोमसोम", type: "trek", lat: 28.7800, lng: 83.7300, text: "Airstrip and trail hub of lower Mustang, in the windy Kali Gandaki valley.", link: "places.html#mustang" },
    { name: "Lo Manthang", ne: "लो मान्थाङ", type: "trek", lat: 29.1833, lng: 83.9583, text: "The walled capital of Upper Mustang. A special permit is needed." },

    { name: "Tribhuvan International Airport", ne: "त्रिभुवन अन्तर्राष्ट्रिय विमानस्थल", type: "airport", lat: 27.6966, lng: 85.3591, text: "Kathmandu, Nepal's main international gateway." },
    { name: "Pokhara International Airport", ne: "पोखरा अन्तर्राष्ट्रिय विमानस्थल", type: "airport", lat: 28.1845, lng: 84.0147, text: "Flights from Kathmandu take about 25 minutes." },
    { name: "Gautam Buddha International Airport", ne: "गौतम बुद्ध अन्तर्राष्ट्रिय विमानस्थल", type: "airport", lat: 27.5057, lng: 83.4163, text: "Near Bhairahawa, the closest airport to Lumbini." },

    { name: "Langtang Valley and Syabrubesi", ne: "लाङटाङ", type: "closed", lat: 28.1617, lng: 85.3456, text: "Hit by the August 2026 flood. Avoid until authorities confirm it is safe.", link: "support.html#travel" },
    { name: "Gosaikunda", ne: "गोसाइँकुण्ड", type: "closed", lat: 28.0833, lng: 85.4167, text: "Access routes affected by the August 2026 flood. Check before travelling.", link: "support.html#travel" }
  ],

  routes: [
    { name: "Everest Base Camp trek", color: "#2a62ad",
      points: [[27.6869, 86.7314], [27.7400, 86.7130], [27.8069, 86.7140], [27.8362, 86.7646], [27.8920, 86.8310], [27.9483, 86.8103], [27.9806, 86.8290], [28.0026, 86.8528]] },
    { name: "Annapurna Circuit", color: "#2a62ad",
      points: [[28.2300, 84.3800], [28.5500, 84.2400], [28.6667, 84.0167], [28.7050, 83.9950], [28.7700, 83.9700], [28.7930, 83.9380], [28.8167, 83.8717], [28.7800, 83.7300]] },
    { name: "Tilicho Lake side trip", color: "#2a62ad",
      points: [[28.6667, 84.0167], [28.6700, 83.9700], [28.6833, 83.8500]] }
  ]
};
