/* =========================================================================
   PRODUCTS-DATA.JS  —  لیستی بەرهەمەکان (Product List)
   =========================================================================
   ئەمە تاکە فایلێکە کە پێویستە بۆ ڕێکخستنی بەرهەمەکان دەستکاری بکەیت.
   This is the ONLY file you need to touch to manage your products.

   هەر بەرهەمێک ئەم خانانەی خوارەوەی هەیە:
   Every product has these fields:

     id          -> ژمارەیەکی تایبەت، دووبارە نەبێتەوە (unique number)
     name        -> ناوی بەرهەم بە کوردی (product name in Kurdish)
     category    -> کلیلی پۆل، دەبێت وەک یەکێک لە config.js بێت
                    (must match a "key" from the categories list in config.js)
     price       -> نرخی 1 کیلۆ بە دینار، تەنها ژمارە بنووسە
                    (price for 1 KG, numbers only — no commas, no text)
     image       -> بەستەری وێنە (image link or local file path)
     description -> ڕوونکردنەوەیەکی کورت (short description)
     bestSeller  -> true ئەگەر دەتەوێت لە بەشی "زۆرترین فرۆشراو" دەربکەوێت
                    (true = shown in the "Best Sellers" section on the home page)
     featured    -> true ئەگەر دەتەوێت لە بەشی "بەرهەمە تایبەتەکان" دەربکەوێت
                    (true = shown in the "Featured" section on the home page)

   -------------------------------------------------------------------------
   چۆنیەتی گۆڕینی نرخ یان ناو (HOW TO CHANGE A PRICE OR NAME)
   -------------------------------------------------------------------------
   تەنها نرخی "price" یان "name"ی ئەو بەرهەمە بگۆڕە کە دەتەوێت. نموونە:
   Just edit the "price" or "name" value of the product you want. Example:

       name: "فستقی خاو",     ->     name: "فستقی گەورە",
       price: 22000,           ->     price: 25000,

   -------------------------------------------------------------------------
   چۆنیەتی گۆڕینی وێنە (HOW TO CHANGE A PRODUCT IMAGE)
   -------------------------------------------------------------------------
   1. وێنەی خۆت (فۆرماتی jpg یان png) دابنێ لە فۆڵدەری  images/products/
   2. لە خانەی "image" ناوی فایلەکەت بنووسە، بۆ نموونە:
        image: "images/products/pistachio-raw.jpg"
   ئێستا بە بنەڕەت لینکی وێنەی کاتی (placeholder) بەکارهاتووە کە ناوی
   بەرهەمەکە پیشان دەدات — بۆ ئەوەی بزانیت کام وێنە بۆ کام بەرهەمە.

   1. Put your own photo (jpg or png) inside the images/products/ folder.
   2. Set the "image" field to that file's path, e.g:
        image: "images/products/pistachio-raw.jpg"
   Right now placeholder images are used by default (they show the product
   name) so it's easy to see which photo belongs to which product.

   -------------------------------------------------------------------------
   چۆنیەتی زیادکردنی بەرهەمی نوێ (HOW TO ADD A NEW PRODUCT)
   -------------------------------------------------------------------------
   ئۆبجێکتێکی نوێ کۆپی بکە و لە خوارەوەی لیستەکە زیادی بکە، وا دڵنیابەرەوە
   ID تازە و جیاواز بەکاردێنیت (بۆ نموونە 41):

   Copy a product block below and paste a new one at the end of the list.
   Just make sure the "id" is a new, unique number (e.g. 41):

       {
         id: 41,
         name: "ناوی بەرهەمی نوێ",
         category: "walnut",
         price: 18000,
         image: "https://placehold.co/600x600/EAF2FF/0B3E8C?text=New",
         description: "ڕوونکردنەوەیەکی کورت لێرە بنووسە",
         bestSeller: false,
         featured: false
       },

   -------------------------------------------------------------------------
   چۆنیەتی سڕینەوەی بەرهەم (HOW TO DELETE A PRODUCT)
   -------------------------------------------------------------------------
   تەنها بلۆکەکەی ئەو بەرهەمە بسڕەوە لە نێوان { و } دا، لەگەڵ کۆما.
   Just delete the whole { ... } block for that product, including its comma.
   ========================================================================= */

const PRODUCTS = [

  // ================= فستق / PISTACHIO =====================================
  { id: 1,  name: "فستقی ئەکبەری",                 category: "pistachio", price: 24000, image: "images/products/pistachios/فستقی-ئەکبەری.png",           description: "فستقی ئەکبەری دەرەجە یەک بە تامی عەنتاب",              bestSeller: true,  featured: true },
  { id: 2,  name: "فستقی ئەمریکی برژاو و خوێدار",       category: "pistachio", price: 20000, image: "images/products/pistachios/فستقی-ئەمریکی.png",         description: "برژاوی تەواو لەگەڵ تامی خوێی سووک.",           bestSeller: true,  featured: false },
  { id: 3,  name: "فستقی ئەمریکی ترشکراو",               category: "pistachio", price: 20000, image: "images/products/pistachios/فستقی-ئەمریکی-ترش.png",        description: "فستقی ئەمریکی ترشکراو بەتام و خۆش",         bestSeller: false, featured: true },
  { id: 4,  name: "فستقی بندقی",              category: "pistachio", price: 22000, image: "images/products/pistachios/فستقی-بندقی.png",       description: "فستقی بندقی بەتامی عەنتاب تامداری خۆش",          bestSeller: false, featured: false },
  { id: 5,  name: "فستقی بە ناوک",              category: "pistachio", price: 40000, image: "images/products/pistachios/فستقی-ناوک.png",       description: "فستقی بە ناوکی ئێرانی دەرەجە یەک",          bestSeller: false, featured: false },

  // ================= کشمیش / RAISINS =======================================
  { id: 6,  name: "مێوژی بێ ناوک",                category: "raisins",   price: 10000, image: "images/products/raisins/مێوژی-بێ-ناوک.png",         description: "مێوژی بێ ناوکی وزپاکستانی قەبارە ١٠٠",                     bestSeller: true,  featured: false },
  { id: 7,  name: "مێوژی خۆمالی دەرەجە یەک",                category: "raisins",   price: 8000, image: "images/products/raisins/مێوژی-خۆمانی-١.png",         description: "مێوژی خۆمالی بێ دارک سافی دەرەجە یەک",                bestSeller: false, featured: false },
  { id: 8,  name: "مێوژی خۆمالی دەرەجە دوو",                category: "raisins",   price: 5000, image: "images/products/raisins/مێوژی-خۆمانی-٢.png",         description: "مێوژی خۆمالی بۆ شەربەت دەرەجە یەک",          bestSeller: false, featured: true },
  { id: 9,  name: "مێوژی خۆمالی دەرەجە سێ",              category: "raisins",   price: 4000, image: "images/products/raisins/مێوژی-خۆمانی-٣.png",       description: "مێوژی خۆمالی بۆ شەربەتی بەتام",              bestSeller: false, featured: false },
  { id: 10,  name: "کشمیشی زەرد",              category: "raisins",   price: 7000, image: "images/products/raisins/کشمیشی-زەرد.png",       description: "کشمیشی زەرد دەرەجە یەک بۆ سەر برنچ و شیرنەمەنی",              bestSeller: false, featured: false },
  { id: 11,  name: "پونگی خۆمالی",              category: "raisins",   price: 6000, image: "images/products/raisins/پونگی-خۆمانی.png",       description: "پونگی خۆمالی بۆ شەربەت",              bestSeller: false, featured: false },

  // ================= تۆو / SEEDS ============================================
  { id: 12,  name: "تۆوی کودی زەرد",                   category: "seeds",     price: 8000,  image: "images/products/seeds/کودی-زەرد-برژاو.png",            description: "تۆوی کودی زەرد برژای بە خوێ", bestSeller: true,  featured: false },
  { id: 13, name: "تۆوی کودی زەردی خاو",                category: "seeds",     price: 8000, image: "images/products/seeds/کودی-زەرد-خاو.png",         description: "سرووشتی و پڕ لە پرۆتین بۆ دەرمان و نەخۆشی",                     bestSeller: false, featured: false },
  { id: 14, name: "تۆوی کودی سپی",                 category: "seeds",     price: 8000, image: "images/products/seeds/کودی-سپی-برژاو.png",          description: "کودی سپی برژاوی شەباح بە خوێ",           bestSeller: false, featured: false },
  { id: 15, name: "تۆوی کودی سپی خاو",                   category: "seeds",     price: 8000, image: "images/products/seeds/کودی-سپی-خاو.png",            description: "بۆ دەرمان و نەخۆشی پرۆستات",                     bestSeller: false, featured: true },
  { id: 16, name: "تۆوی کودی سوتای",                   category: "seeds",     price: 8000, image: "images/products/seeds/کودی-زەرد-سوتای.png",            description: "تۆوی کودی زەردی سوتای بە خوێ بە تام",                     bestSeller: false, featured: true },
  { id: 17, name: "ناوکە تۆوی کودی",                   category: "seeds",     price: 8000, image: "images/products/seeds/ناوکە-کودی.png",            description: "ناوکە کودی چوان و کەسک دەرەجە یەک",                     bestSeller: false, featured: true },
  { id: 18, name: "تۆوی مسری ",                   category: "seeds",     price: 6000, image: "images/products/seeds/تۆی-مسری-حامز.png",            description: "تۆوی مسری بە تامی لیمۆی ترش و بەتام",                     bestSeller: false, featured: true },
  { id: 19, name: "تۆوی شفتی",                   category: "seeds",     price: 10000, image: "images/products/seeds/تۆی-شفتی.png",            description: "تۆوی شفتی برژاو بە خوێ درشتی دەرەجە یەک",                     bestSeller: false, featured: true },
  { id: 20, name: "تۆوی گوڵە بەرۆژە",                   category: "seeds",     price: 5000, image: "images/products/seeds/تۆی-گوڵەبەرۆژە.png",            description: "تۆوی گوڵە بەرۆژەی درشت و بەتام",                     bestSeller: false, featured: true },

  // ================= سماق / SUMAC ==========================================
  { id: 21, name: "سماقی سۆری دنک",              category: "sumac",     price: 13000,  image: "images/products/sumacs/سماقی-سۆری-دنک.png",       description: "سماقی سۆری دنک ی ئاکرێ ترشو بەلە زەت",            bestSeller: false, featured: false },
  { id: 22, name: "سماقی سپی دنک",               category: "sumac",     price: 14000,  image: "images/products/sumacs/سماقی-سپی-دنک.png",        description: "سماقی سپی دنک ی ئاکرێ درشتو ترش",                 bestSeller: false, featured: false },
  { id: 23, name: "سماقی وردکراو",     category: "sumac",     price: 16000, image: "images/products/sumacs/سماقی-وردکراو.png",        description: "سماقی وردکراو ی ئاکرێ ساف سماق بێ خێو لیمدوزی",                    bestSeller: false, featured: false },

  // ================= چەرەسی تێکەلاو/ MIXED NUTS ============================
  { id: 24, name: "چەرەساتی دەرەجە یەک",         category: "mixed",     price: 18000, image: "images/products/mixeds/چەرەساتی-دەرەجە-یەک.png",        description: "چەرەساتی دەرەجە یەک پێک دێ لە سێ بابەت فستق گازۆ باوی",         bestSeller: true,  featured: true },
  { id: 25, name: "چەرەساتی دەرەجە دوو",      category: "mixed",     price: 14000, image: "images/products/mixeds/چەرەساتی-دەرەجە-دوو.png",     description: "چەرەساتی دەرەجە دوو پێک دێ لە پێنچ بابەت فستق و گازۆ و باوی و حەبیەد و تۆوی کودی سپی",            bestSeller: false, featured: false },

  // ================= کاجو / CASHEW ==========================================
  { id: 26, name: "گازۆی خاو",                 category: "cashew",    price: 18000, image: "images/products/cashews/گازۆی-خاو.png",          description: "گازۆی خاو ی ١٨٠ بەتام",                       bestSeller: true,  featured: false },
  { id: 27, name: "گازۆی برژایی",               category: "cashew",    price: 18000, image: "images/products/cashews/گازۆی-برژاو.png",        description: "گازۆی برژاوی ١٨٠ بە خوی برژاو نوێ",                   bestSeller: false, featured: true },

  // ================= بادام / ALMOND ========================================
  { id: 28, name: "بادامی خاو ئەمریکی",                 category: "almond",   price: 14000, image: "images/products/almonds/باوی-خاو-ئەمریکی.png",          description: "بادامی ئەمریکی خاو سروشتی و تازە",                       bestSeller: true,  featured: true },
  { id: 29, name: "بادامی برژاو",               category: "almond",   price: 14000, image: "images/products/almonds/باوی-برژاو.png",        description: "برژاوی تەواو، ترسکە و خۆش.",                  bestSeller: false, featured: false },
  { id: 30, name: "بادامی سپیکراو",             category: "almond",   price: 16000, image: "images/products/almonds/باوی-سپیکراو.png",      description: "بادەمی سپیکراو بۆ ناو خواردن",               bestSeller: false, featured: false },
  { id: 31, name: "بادەمی خاو خۆمالی",              category: "almond",   price: 20000, image: "images/products/almonds/باوی-خۆمالی-خاو.png",       description: "بادەمی خۆمالی بۆ نەخۆشی چەوری",                  bestSeller: false, featured: false },
  { id: 32, name: "بادەمی خاو ئیسپانی",              category: "almond",   price: 16000, image: "images/products/almonds/باوی-خاو-ئیسپانی.png",       description: "بادەمی ئیسپانی درشت و گەورە و بەتام",                  bestSeller: false, featured: false },
  { id: 33, name: "بادەمی بەپەلک",              category: "almond",   price: 4000, image: "images/products/almonds/باوی-بەپەلک.png",       description: "بادەمی بەپەلک ی خۆمالی سروشتی",                  bestSeller: false, featured: false },

  // ================= گوێز / WALNUT =========================================
  { id: 34, name: "گوێزی سینی",         category: "walnut",     price: 6000, image: "images/products/walnuts/گوێزی-سینی.png",        description: "گوێزی بە پەلک ی سینی دنک درشتی بە تام",         bestSeller: true,  featured: true },
  { id: 35, name: "گوێزی ئەمریکی",      category: "walnut",     price: 7000, image: "images/products/walnuts/گوێزی-ئەمریکی.png",     description: "گوێزی ئەمریکی بە پەلکی کاکلی سپی و سروشتی",            bestSeller: false, featured: false },
  { id: 36, name: "گوێزی کاکلی سۆر",      category: "walnut",     price: 12000, image: "images/products/walnuts/گوێزی-کاکل-سینی.png",     description: "گوێزی کاکلی سۆر ی سەنی بە تام و چەور",                     bestSeller: false, featured: false },
  { id: 37, name: "گوێزی کاکلی سپی",       category: "walnut",     price: 14000, image: "images/products/walnuts/گوێزی-کاکل-ئەمریکی.png",      description: "پۆشراو بە هەنگوینی سروشتی.",                  bestSeller: false, featured: false },

  // ================= نۆک / CHICKPEAS =======================================
  { id: 38, name: "نۆکی نەرمی برژاو",                 category: "chickpeas", price: 5000,  image: "images/products/chickpeas/نۆکی-نەرم.png",           description: "برژاوی تەواو و نەرمی خۆش",                       bestSeller: true,  featured: false },
  { id: 39, name: "نۆکی خۆمالی",                category: "chickpeas", price: 5000,  image: "images/products/chickpeas/نۆکی-خۆمالی.png",          description: "نۆکی خۆمالی برژاوی بە خوێ بە تام",                     bestSeller: false, featured: false },

  // ================= هەنجیری وشک / DRY FIG =================================
  { id: 40, name: "هەنجیری وشکراوی خۆمالی",        category: "fig",       price: 10000, image: "images/products/figs/هەنچەری-خۆمالی.png",       description: "شیرینی سروشتی و نەرمی تایبەت.",               bestSeller: true,  featured: true },
  { id: 41, name: "هەنجیری وشکراوی لەتک",            category: "fig",       price: 7000, image: "images/products/figs/هەنچیری-لەتک.png",           description: "هەنجیری لەتکی خۆمالی وشکراوی بە تام و شیرین",                 bestSeller: false, featured: false }

];
