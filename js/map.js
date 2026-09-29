(function () {
  "use strict";
  var data = window.MAP_DATA;
  var cfg = (window.VISIT_NEPAL_CONFIG || {}).map || {};
  var el = document.getElementById("nepal-map");
  if (!data || !el) return;
  if (!window.L) {
    el.innerHTML = '<p class="map-error">The map could not load. Please check your connection and reload the page.</p>';
    return;
  }

  var COLORS = { heritage: "#b3122c", spiritual: "#d99a14", nature: "#2f8a57", trek: "#2a62ad", airport: "#5b6b80", closed: "#8a8f98" };
  var LABELS = { heritage: "Heritage", spiritual: "Spiritual", nature: "Nature and wildlife", trek: "Treks", airport: "Airport", closed: "Closed after the flood" };

  var map = L.map(el, { scrollWheelZoom: false, zoomControl: true }).setView(data.center, data.zoom);
  var layerDefs = cfg.layers && cfg.layers.length ? cfg.layers : [{
    name: "Streets",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
  }];
  var bases = {};
  var layers = layerDefs.map(function (d) {
    var layer = L.tileLayer(d.url, { maxZoom: 18, subdomains: d.subdomains || "abc", attribution: d.attribution || "" });
    bases[d.name] = layer;
    return layer;
  });
  var active = 0;
  function useLayer(i) {
    layers.forEach(function (l) { if (map.hasLayer(l)) map.removeLayer(l); });
    active = i;
    var layer = layers[i];
    var ok = false, errors = 0;
    layer.off("tileload tileerror");
    layer.on("tileload", function () { ok = true; });
    layer.on("tileerror", function () {
      errors += 1;
      if (!ok && errors > 4 && active === i && i + 1 < layers.length) useLayer(i + 1);
    });
    layer.addTo(map);
  }
  useLayer(0);
  if (layers.length > 1) L.control.layers(bases, null, { position: "topright", collapsed: false }).addTo(map);

  /* Scroll to zoom only after the map is clicked, so the page still scrolls normally */
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });

  var routeLayer = L.layerGroup().addTo(map);
  (data.routes || []).forEach(function (r) {
    L.polyline(r.points, { color: r.color || "#2a62ad", weight: 4, opacity: 0.75, dashArray: "8 8" })
      .bindTooltip(r.name, { sticky: true })
      .addTo(routeLayer);
  });

  function esc(s) { var d = document.createElement("div"); d.textContent = s || ""; return d.innerHTML; }

  var list = document.querySelector(".map-list");
  var entries = data.places.map(function (p, i) {
    var color = COLORS[p.type] || "#16213b";
    var marker = L.circleMarker([p.lat, p.lng], {
      radius: 9, color: "#fff", weight: 2.5, fillColor: color, fillOpacity: 1
    });
    var osm = "https://www.openstreetmap.org/?mlat=" + p.lat + "&mlon=" + p.lng + "#map=13/" + p.lat + "/" + p.lng;
    var gmaps = "https://www.google.com/maps/search/?api=1&query=" + p.lat + "," + p.lng;
    var html = '<div class="pop"><span class="pop-type" style="color:' + color + '">' + esc(LABELS[p.type]) + "</span>" +
      "<strong>" + esc(p.name) + "</strong>" + (p.ne ? '<span class="pop-ne" lang="ne">' + esc(p.ne) + "</span>" : "") +
      "<p>" + esc(p.text) + "</p>" +
      '<p class="pop-links">' + (p.link ? '<a href="' + esc(p.link) + '">Read more</a>' : "") +
      '<a href="' + gmaps + '" target="_blank" rel="noopener">Open in Google Maps</a><a href="' + osm + '" target="_blank" rel="noopener">OpenStreetMap</a></p></div>';
    marker.bindPopup(html, { maxWidth: 280 });
    marker.addTo(map);

    var li = document.createElement("li");
    li.setAttribute("data-type", p.type);
    li.innerHTML = '<button type="button"><span class="dot" style="background:' + color + '"></span><span><strong>' + esc(p.name) + "</strong>" +
      (p.ne ? '<small lang="ne">' + esc(p.ne) + "</small>" : "") + "</span></button>";
    li.querySelector("button").addEventListener("click", function () {
      map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 11), { duration: 1.1 });
      setTimeout(function () { marker.openPopup(); }, 900);
      if (window.innerWidth < 900) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    if (list) list.appendChild(li);
    return { place: p, marker: marker, item: li };
  });

  /* Filters */
  var chips = document.querySelectorAll("[data-map-filter]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-map-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
      var shown = [];
      entries.forEach(function (e) {
        var on = f === "all" || e.place.type === f;
        e.item.hidden = !on;
        if (on) { e.marker.addTo(map); shown.push([e.place.lat, e.place.lng]); } else { map.removeLayer(e.marker); }
      });
      if (f === "all" || f === "trek") routeLayer.addTo(map); else map.removeLayer(routeLayer);
      if (shown.length > 1) map.flyToBounds(shown, { padding: [40, 40], duration: 1 });
      else if (shown.length === 1) map.flyTo(shown[0], 11, { duration: 1 });
    });
  });

  map.fitBounds(data.places.map(function (p) { return [p.lat, p.lng]; }), { padding: [30, 30] });
  window.addEventListener("resize", function () { map.invalidateSize(); });
})();
