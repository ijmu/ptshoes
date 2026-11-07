(function () {
  var root = document.body;
  var languageButton = document.querySelector("[data-language-toggle]");
  var stored = localStorage.getItem("pt-language");
  var language = stored === "zh-CN" ? "zh-CN" : "en";

  function applyLanguage(next) {
    language = next;
    root.dataset.siteLang = language;
    document.documentElement.lang = language;
    if (languageButton) {
      languageButton.textContent = language === "en" ? "中文" : "EN";
      languageButton.setAttribute("aria-label", language === "en" ? "切换到中文" : "Switch to English");
    }
    try { localStorage.setItem("pt-language", language); } catch (_) {}
  }

  applyLanguage(language);
  if (languageButton) {
    languageButton.addEventListener("click", function () {
      applyLanguage(language === "en" ? "zh-CN" : "en");
    });
  }

  function fallbackCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var ok = document.execCommand("copy");
    field.remove();
    return ok;
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function announce(messageEn, messageZh) {
    var status = document.querySelector("[data-copy-status]");
    if (!status) return;
    status.textContent = language === "zh-CN" ? messageZh : messageEn;
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(function () { status.textContent = ""; }, 2800);
  }

  document.querySelectorAll("[data-copy-whatsapp]").forEach(function (button) {
    button.addEventListener("click", function () {
      copyText("btc188").then(function (ok) {
        announce(ok ? "WhatsApp ID copied: btc188" : "Copy failed. WhatsApp ID: btc188", ok ? "已复制 WhatsApp ID：btc188" : "复制失败，请手动复制：btc188");
      });
    });
  });

  document.querySelectorAll("[data-inquiry]").forEach(function (link) {
    link.addEventListener("click", function () {
      var sku = link.getAttribute("data-inquiry") || "PT-CATALOG";
      var message = language === "zh-CN"
        ? "你好，我想咨询 " + sku + "。请提供当前实拍、可选颜色与尺码、价格、运费和预计配送时间。"
        : "Hi, I would like to ask about " + sku + ". Please share current photos, available colors and sizes, price, shipping cost, and estimated delivery time.";
      copyText(message).then(function (ok) {
        if (ok) announce("Inquiry copied — paste it into Telegram.", "咨询内容已复制，请粘贴到 Telegram。");
      });
    });
  });

  var filters = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-category]");
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.getAttribute("data-filter");
      filters.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      cards.forEach(function (card) {
        card.hidden = filter !== "all" && card.getAttribute("data-category") !== filter;
      });
    });
  });
})();
