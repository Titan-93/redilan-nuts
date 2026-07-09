/* =========================================================================
   CONFIG.JS  —  ڕێکخستنی گشتی فرۆشگا (Store Settings)
   =========================================================================
   ئەم فایلە هەموو زانیاریە گشتییەکانی فرۆشگاکەت لەخۆ دەگرێت.
   This file holds all the general information about your store.
   You only need to edit the values inside quotes " " below.
   ========================================================================= */

const STORE_CONFIG = {

  // ---- ناوی فرۆشگا / Store name (shown in the header & footer) ----------
  storeName: "فرۆشگای گوێز و بەروبووی وشک",

  // ----ووەسفی کورت / Short tagline shown under the store name in hero ----
  tagline: "تامی ڕەسەن، کوالێتی بەرز",

  /* -----------------------------------------------------------------------
     ژمارەی واتساپ  —  WhatsApp Number
     -----------------------------------------------------------------------
     بۆ گۆڕینی ژمارە: تەنها ژمارەکە بگۆڕە. کۆدی وڵات لەگەڵ بنووسە بەبێ (+) و
     بەبێ سفر لە سەرەتا.  نموونە: عێراق = 964  و دواتر ژمارەکەت بەبێ سفری
     یەکەم. ئەگەر ژمارەکەت 0750 123 4567 بێت، دەبێت بنووسیت: 9647501234567

     To change the number: keep the country code (no + and no leading 0),
     then the rest of the phone number.
     Example: if your number is 0750 123 4567 in Iraq, write: 9647501234567
     ----------------------------------------------------------------------- */
  whatsappNumber: "9647505268166",

  // ---- ژمارەی تەلەفۆن کە لەسەر پەیجی پەیوەندی نیشان دەدرێت ---------------
  phoneDisplay: "8166 526 0750",

  // ---- ناونیشانی فرۆشگا / Store address -----------------------------------
  address: "هەولێر، کوردستان - عێراق",

  // ---- بەستەری نەخشە (Google Maps embed link, optional) -------------------
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1564.218017730276!2d44.01351558625979!3d36.188299290040256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x400723cd7f7848e5%3A0x8bac6b3768604db2!2zUmVkaWxhbiBudXRzINqG25XYsduV2LPYp9iq24wg2LHbjiDYr9uM2YTYp9mG!5e0!3m2!1sen!2siq!4v1783586807414!5m2!1sen!2siq",

  // ---- بەستەری فەیسبووک، ئینستاگرام و تیک‌تۆک / Social links ---------------
  facebookUrl: "https://www.facebook.com/share/1QxvyiN1ip/",
  instagramUrl: "https://www.instagram.com/redilan.nuts?igsh=MWN5YTZtZGRjZzJ4aA==",
  tiktokUrl: "https://vt.tiktok.com/ZSCETNQpB/",

  /* -----------------------------------------------------------------------
     پارە / Currency label shown after every price
     ----------------------------------------------------------------------- */
  currencyLabel: "دینار",

  /* -----------------------------------------------------------------------
     پۆلەکان / CATEGORIES
     -----------------------------------------------------------------------
     بۆ گۆڕینی ناوی پۆلێک: تەنها نرخی "label" بگۆڕە.
     بۆ زیادکردنی پۆلی نوێ: هێڵێکی نوێ لە شێوەی خوارەوە زیاد بکە و "key"ـی
     نوێ و ناوی تایبەت پێی بدە، پاشان لە فایلی products-data.js بەرهەمی ئەو
     پۆلە زیاد بکە.
     بۆ سڕینەوەی پۆلێک: هێڵەکەی بسڕەوە (دڵنیابەرەوە هیچ بەرهەمێک ئەو
     پۆلەی بەکارنەهێناوە).

     To rename a category: change only the "label" value.
     To add a category: copy a line below, give it a new unique "key" and a
     "label", then add products with that same key in products-data.js.
     To delete a category: remove its line (make sure no product still
     uses that key).
     ----------------------------------------------------------------------- */
  categories: [
    { key: "pistachio",  label: "فستق",           icon: "🥜" },
    { key: "raisins",    label: "کشمیش",           icon: "🍇" },
    { key: "seeds",      label: "تۆو",             icon: "🌻" },
    { key: "sumac",      label: "سماق",            icon: "🌿" },
    { key: "mixed",      label: "چەرەسی تێکەلاو",   icon: "🥣" },
    { key: "cashew",     label: "گازۆ",            icon: "🌰" },
    { key: "almond",     label: "بادەم",           icon: "🌱" },
    { key: "walnut",     label: "گوێز",            icon: "🌳" },
    { key: "chickpeas",  label: "نۆک",             icon: "🌕" },
    { key: "fig",        label: "هەنجیری وشکراو",     icon: "🍐" }
  ]
};
