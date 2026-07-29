# فرۆشگای گوێز و بەروبووی وشک — ماڵپەڕ
# Nuts & Dry Fruits Store — Website

ماڵپەڕێکی تەواو، ڕاستەوخۆ ئامادەیە بۆ بەکارهێنان. هیچ npm، هیچ build tool، و هیچ سێرڤەرێکی تایبەت پێویست ناکات — تەنها فایلی HTML/CSS/JS سادەیە.

A complete, ready-to-use website. No npm, no build tools, no special server required — just plain HTML/CSS/JS files.

---

## 📁 پێکهاتەی فۆڵدەر / Folder Structure

```
nuts-store/
├── index.html              ← پەڕەی سەرەکی (Home page)
├── berhemakan.html         ← پەڕەی بەرهەمەکان (Products page)
├── peywendi.html           ← پەڕەی پەیوەندی (Contact page)
├── css/
│   └── style.css           ← هەموو ستایلەکان (all styling — colors, layout, animations)
├── js/
│   ├── config.js           ← ⭐ ناوی فرۆشگا، ژمارەی واتساپ، پۆلەکان (store settings)
│   ├── products-data.js    ← ⭐⭐ تاکە فایلی بەرهەمەکان (THE product data file)
│   ├── cart.js             ← لۆجیکی سەبەتەی داواکاری (cart/order logic)
│   └── main.js              ← نیشاندان، فلتەرکردن، گەڕان (rendering, filters, search)
└── images/
    └── products/            ← وێنە خۆتی لێرە دابنێ (put your own product photos here)
```

⭐ ئەم دوو فایلە تاکە فایلانەن کە بۆ کاری ڕۆژانە پێویستە دەستکاریان بکەیت.
⭐ These two files are the only ones you'll usually need to edit day-to-day.

---

## 🚀 چۆن ماڵپەڕەکە کاری پێبکەیت / How to Run the Website

1. هەموو فۆڵدەرەکە دابگرە بۆ کۆمپیوتەرەکەت. / Download the whole folder to your computer.
2. فایلی `index.html` بکەرەوە بە هەر مرۆرێک (Chrome, Firefox, Edge...). / Just double-click `index.html` to open it in any browser (Chrome, Firefox, Edge...).

هیچ ئینتەرنێت یان سێرڤەرێکی تایبەت پێویست ناکات بۆ تاقیکردنەوە لە کۆمپیوتەری خۆت.
No internet or special server is required to test it on your own computer.
(هەر پێویستە ئینتەرنێت بۆ فۆنتەکان و وێنە کاتییەکان / Internet is only needed to load the Google Fonts and the placeholder images.)

---

## ✏️ گۆڕینی نرخ، ناو، یان زیادکردنی بەرهەمی نوێ

هەموو ئەمانە لە فایلی **`js/products-data.js`** دەکرێن. فایلەکە خۆی پڕە لە کۆمێنتی ڕوونکەرەوە بە کوردی و ئینگلیزی بۆ هەر کارێک:

- گۆڕینی نرخ ✅
- گۆڕینی ناو ✅
- گۆڕینی وێنە ✅
- زیادکردنی بەرهەمی نوێ ✅
- سڕینەوەی بەرهەم ✅

Just open `js/products-data.js` in any text editor (even Notepad works). Every product looks like this:

```js
{
  id: 1,
  name: "فستقی خاو",
  category: "pistachio",
  price: 22000,
  image: "https://placehold.co/600x600/EAF2FF/0B3E8C?text=فستقی+خاو",
  description: "فستقی سروشتی و تازە، بەبێ خوێ.",
  bestSeller: true,
  featured: true
}
```

To add a product, copy one whole block (from `{` to `}`), paste it at the end of the list, give it a new unique `id`, and change the details.

---

## 🖼️ گۆڕینی وێنەکان بە وێنەی خۆت / Replacing Placeholder Images

ئێستا وێنە کاتییەکان (placeholder) ناوی هەر بەرهەمێک پیشان دەدەن، بۆ ئەوەی بزانیت کام وێنە بۆ کام بەرهەمە.

1. وێنەی خۆت (jpg یان png، باشترە هەموویان یەک قەبارە بن، بۆ نموونە 800×800px) لە فۆڵدەری `images/products/` دابنێ.
2. لە فایلی `js/products-data.js` خانەی `image` ی ئەو بەرهەمە بگۆڕە بۆ ناوی فایلەکەت، بۆ نموونە:

```js
image: "images/products/pistachio-raw.jpg"
```

To replace a placeholder with your own photo:
1. Put your photo file (jpg or png, ideally square, e.g. 800×800px) inside `images/products/`.
2. Change the `image` field of that product in `js/products-data.js` to the file's path, e.g:
   `image: "images/products/pistachio-raw.jpg"`

---

## 🏷️ گۆڕینی پۆلەکان / Changing Categories

لە فایلی **`js/config.js`**، بەشی `categories`. بۆ گۆڕین، زیادکردن، یان سڕینەوەی پۆل، ڕێنماییەکانی ناو فایلەکە بخوێنەرەوە.

In `js/config.js`, inside the `categories` list. See the comments in that file for exact steps to rename, add, or remove a category.

---

## 📱 گۆڕینی ژمارەی واتساپ / Changing the WhatsApp Number

لە فایلی **`js/config.js`**، خانەی `whatsappNumber` بگۆڕە. کۆدی وڵات (964 بۆ عێراق) لەگەڵ بنووسە، بەبێ (+) و بەبێ سفری سەرەتا.

In `js/config.js`, edit the `whatsappNumber` field. Include the country code (964 for Iraq) with no `+` and no leading `0`.

Example: phone `0750 123 4567` → `whatsappNumber: "9647501234567"`

---

## 🖼️ لۆگۆ / Your Logo (already added ✅)

لۆگۆکەت زیادکراوە و لە هەموو شوێنێک بەکارهاتووە:

- `images/logo-icon.png` — تەنها وێنۆچکەی گوێز و گەڵا (بەبێ نووسین)، بۆ ئایکۆنی سەرەوە (navbar)، فووتەر، فەیڤیکۆن، و ناوەوەی خشرەی شینی سەرەکی (hero blob).

Your logo has already been added and wired in throughout the site:

- `images/logo-icon.png` — just the walnut + leaf mark (no text), used in the navbar badge, footer, favicon, and inside the blue hero circle.

If you get a new/updated logo later, just replace `images/logo-icon.png` with the new file using the exact same filename — no code changes required.

---

## 🔗 لینکی پۆرتفۆلیۆ و دۆمەین / Portfolio link & live domain

لە فایلی **`js/config.js`** دوو خانەی نوێ زیادکراوە:

- `portfolioUrl` — لینکی پۆرتفۆلیۆی گەشەپێدەر (Titan-93Dev)، لە فووتەری هەر سێ پەڕەکە بەکاردێت. ئێستا `"#"`ـە وەک جێگرەوە.
- `siteUrl` — دۆمەینی ڕاستەقینەی ماڵپەڕەکە دوای بڵاوکردنەوە، بۆ بەستەری canonical و Open Graph تاگەکان لە `<head>`ی هەر پەڕەیەک، هەروەها `sitemap.xml`.

Two new fields were added to **`js/config.js`**:

- `portfolioUrl` — the developer's (Titan-93Dev) portfolio link, used in the footer credit on all three pages. Currently set to `"#"` as a placeholder.
- `siteUrl` — the site's real domain once deployed, used for the canonical link and Open Graph tags in each page's `<head>`, and in `sitemap.xml`.

Once the site is live, update `portfolioUrl` in `js/config.js`, then find-and-replace every `redilan-nuts.example.com` (in the three HTML files' `<head>` and in `sitemap.xml`) with the real domain.

---

## 🌐 بڵاوکردنەوەی ماڵپەڕ (Deployment)

هەر کام لەمانە بەخۆڕایی و ئاسانن، هیچ کۆدنووسینێکی زیاتریان پێویست نییە:

**هەڵبژاردەی ١ — Netlify (زۆر ئاسان):**
1. بڕۆ بۆ netlify.com و هەژمارێک دروست بکە.
2. فۆڵدەرەکەی ماڵپەڕەکەت ڕاستەوخۆ بکشێنە (drag & drop) بۆ ناو Netlify.
3. ماڵپەڕەکەت خۆکارانە بڵاو دەبێتەوە و لینکێکت پێدەدرێت.

**هەڵبژاردەی ٢ — GitHub Pages:**
1. فۆڵدەرەکە بکە بە repository لەسەر GitHub.
2. لە ڕێکخستنەکانی repository، بەشی Pages چالاک بکە.
3. ماڵپەڕەکەت لەسەر لینکێکی `username.github.io` بڵاو دەبێتەوە.

**هەڵبژاردەی ٣ — هەر هۆستێکی ئاسایی (cPanel, Hostinger, ...):**
تەنها هەموو فایلەکان بارکە (upload) بۆ فۆڵدەری `public_html`.

All three options above are free and require no extra coding — just upload the whole folder. Netlify's drag-and-drop is the easiest for beginners.

---

## ✅ تایبەتمەندییەکان / Features Included

- زمانی کوردی سۆرانی بۆ هەموو ناوەڕۆک (Full Kurdish Sorani interface, RTL layout)
- ڕەنگی شین و سپی، ستایلی مۆدێرن و پرۆفیشناڵ (Blue & white premium modern design)
- سیستەمی داواکاری بەبێ پارەدان — ڕاستەوخۆ بۆ واتساپ (No-checkout ordering — straight to WhatsApp)
- گەڕان و فلتەرکردنی بەرهەمەکان بەپێی پۆل (Search & category filtering)
- مێنیوی مۆبایل، دووگمەی گەڕانەوە بۆ سەرەوە، دووگمەی فلۆتینگی واتساپ (Mobile menu, back-to-top, floating WhatsApp button)
- Lazy-loading بۆ وێنەکان، ئێفێکتی سکرۆڵ، لۆدینگ ئانیمەیشن (Lazy image loading, scroll reveal, loading animation)
- هەموو داتای بەرهەم لە یەک فایل — ئاسان بۆ دەستکاریکردن (All product data in a single, beginner-friendly file)

خۆشحاڵ بین، سەرکەوتووبیت لە بازرگانیت! 🥜
Good luck with your store!
