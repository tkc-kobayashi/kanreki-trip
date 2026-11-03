(function () {
  "use strict";

  var MAP_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z"/>' +
    '<circle cx="12" cy="10" r="2.5"/>' +
    "</svg>";

  function mapUrl(query) {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query);
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function renderItinerary(days) {
    var container = document.getElementById("itinerary-days");
    days.forEach(function (day) {
      var block = el("div", "day-block");
      block.appendChild(el("h3", "day-heading", day.label));
      block.appendChild(el("p", "day-place", day.place));

      var timeline = el("div", "timeline");
      day.items.forEach(function (item) {
        var itemEl = el("div", "timeline-item" + (item.end ? " is-visit" : ""));
        itemEl.appendChild(el("span", "timeline-dot"));
        itemEl.appendChild(el("span", "timeline-time", item.start));
        itemEl.appendChild(el("div", "timeline-title", item.title));
        if (item.desc) {
          itemEl.appendChild(el("div", "timeline-desc", item.desc));
        }
        if (item.mapUrl || item.map) {
          var link = document.createElement("a");
          link.className = "map-button";
          link.href = item.mapUrl || mapUrl(item.map);
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.innerHTML = MAP_ICON + "<span>地図</span>";
          itemEl.appendChild(link);
        }
        if (item.end) {
          var endEl = el("div", "timeline-end");
          endEl.appendChild(el("span", "timeline-dot is-end"));
          endEl.appendChild(el("span", "timeline-time", item.end));
          itemEl.appendChild(endEl);
        }
        timeline.appendChild(itemEl);
      });
      block.appendChild(timeline);
      container.appendChild(block);
    });
  }

  var LINK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M14 4h6v6"/><line x1="20" y1="4" x2="11" y2="13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>' +
    "</svg>";

  function renderLinks(links) {
    var container = document.getElementById("link-cards");
    links.forEach(function (item) {
      var card = el("div", "link-card");
      var name = el("div", "link-name");
      name.textContent = item.name;
      card.appendChild(name);

      var link = document.createElement("a");
      link.className = "map-button";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = item.type === "map"
        ? MAP_ICON + "<span>地図で見る</span>"
        : LINK_ICON + "<span>公式サイトを開く</span>";
      card.appendChild(link);

      container.appendChild(card);
    });
  }

  var NOTE_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="13"/><circle cx="12" cy="16.5" r="0.6" fill="currentColor"/>' +
    "</svg>";

  function renderNotes(notes) {
    var list = document.getElementById("notes-list");
    notes.forEach(function (text) {
      var li = el("li", "", NOTE_ICON);
      var span = document.createElement("span");
      span.textContent = text;
      li.appendChild(span);
      list.appendChild(li);
    });
  }

  function init(data) {
    renderItinerary(data.days);
    renderLinks(data.links);
    renderNotes(data.notes);
  }

  fetch("data.json")
    .then(function (res) {
      return res.json();
    })
    .then(init)
    .catch(function (err) {
      console.error("data.jsonの読み込みに失敗しました", err);
      var msg = el("p", "load-error",
        "旅程データを読み込めませんでした。ファイルを直接開いた場合は表示されません。公開ページまたはローカルサーバーから開いてください。");
      document.getElementById("itinerary-days").appendChild(msg);
    });
})();
