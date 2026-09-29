# Visit Nepal

A free, non-profit guide to Nepal by Bishworaj Khadka.

## What updates on its own

* **News** reloads every 30 minutes while a page is open, and is remembered between visits for the same time.
* **Rashifal** cards open each sign's daily reading on Hamro Patro, which updates every morning.
* **Today's Nepali date** and the **calendar** move to the new day at midnight on their own.
* If a photo ever fails to load, a backup photo is shown instead.

## Where to make changes later

| To change | Edit this file |
| :- | :- |
| News sources, refresh time, number of headlines | `js/config.js` |
| Rashifal links | `js/config.js` |
| Fixed festival days and monthly festival notes | `js/config.js` |
| Map tiles, weather places and the backup photo | `js/config.js` |
| Places and trek routes on the tourist map | `js/map-data.js` |
| Add Nepali calendar years after 2089 BS | `js/calendar-data.js` |
| Colours, fonts and layout | `css/site.css` |
| Page text | the `.html` file of that page |

Each file has short notes at the top explaining what to change.

## Publishing

Upload the whole folder, keeping `css` and `js` beside the pages, to any free static host such as Netlify, GitHub Pages or Cloudflare Pages. The live news and the map need the site to be online; they will not load when a page is opened straight from your computer.
