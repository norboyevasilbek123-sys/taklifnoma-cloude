# Konvertli to‘y taklifnomasi

Mehmon havolani ochadi, konvert muhrini bosadi, konvert ochiladi va taklifnoma ko‘rinadi:
ismlar, sana, to‘yxona, xarita, to‘ygacha jonli taymer, suratlar va ixtiyoriy musiqa.

Sayt oddiy fayllardan iborat (HTML, CSS, JavaScript). Serverga, bazaga yoki pullik xizmatga ehtiyoj yo‘q. Reklama yo‘q.

## Fayllar

| Fayl | Nima uchun |
|---|---|
| `index.html`, `style.css`, `app.js` | Sayt kodi. Odatda tegmaysiz. |
| `data/namuna.json` | Taklifnoma ma'lumoti: ismlar, sana, rang. **Shuni o‘zgartirasiz.** |
| `data/yashil.json`, `kok.json`, `pushti.json` | Boshqa ranglarga namuna. |
| `photos/` | Suratlar shu yerga yuklanadi. |

## Yangi taklifnoma qo‘shish (har bir mijoz uchun)

1. `data/` papkasidagi `namuna.json` ni nusxalang va yangi nom bering, masalan `shohruh-sevinch.json` (faqat kichik lotin harflari, raqam va `-`).
2. Ichidagi ismlar, sana, to‘yxona va rangni o‘zgartiring (pastda tushuntirilgan).
3. Havola: `https://SAYT-MANZILI/?i=shohruh-sevinch`

`?i=` bo‘lmasa, `namuna.json` ochiladi.

## data/*.json maydonlari

```json
{
  "sarlavha": "Nikoh to‘yiga taklifnoma",
  "kuyov": "Shohruh",
  "kelin": "Sevinch",
  "belgi": "&",
  "ochish": "Muhrni bosib oching",
  "matn": "Aziz mehmonimiz! ...",
  "sana": "2026-12-20 18:00",
  "tuyxona": "“Navro‘z” to‘yxonasi",
  "manzil": "Toshkent sh., Chilonzor tumani, ...",
  "xarita": "https://maps.google.com/...",
  "telefon": "+998901234567",
  "rang": "bordo",
  "ranglar": {},
  "muhr": "kapalak",
  "gul": true,
  "suratlar": [],
  "musiqa": "",
  "yakun": "Sizni kutib qolamiz!",
  "mezbonlar": "Hurmat bilan, ... oilasi"
}
```

- **sana**: `YYYY-OO-KK SS:DD` ko‘rinishida, O‘zbekiston vaqti bilan. Masalan `2026-12-20 18:00`.
- **sarlavha**: "To‘y taklifnomasi", "Unashtiruv to‘yiga taklifnoma", "Tug‘ilgan kun taklifnomasi" va h.k. Istalganini yozing.
- **xarita**, **telefon**, **mezbonlar**, **matn**: kerak bo‘lmasa bo‘sh qoldiring (`""`), tugma yoki qator chiqmaydi.
- **muhr**: muhr ichidagi belgi: `"kapalak"`, `"yurak"` yoki `"harflar"` (ism bosh harflari, masalan `S&S`).
- **gul**: konvert chetidagi gul shoxi. `false` qilsangiz yo‘qoladi.

## Rang

`"rang"` ga tayyor nomlardan birini yozing: `bordo`, `yashil`, `kok`, `pushti`, `qora`, `binafsha`.

O‘zingiz xohlagan rang kerak bo‘lsa, `"ranglar"` ga yozing (qolganlari tayyor rangdan olinadi):

```json
"rang": "bordo",
"ranglar": {
  "fon": "#7b2f34",
  "konvert": "#6b1d26",
  "muhr": "#7d1622",
  "oltin": "#d9b26a",
  "qogoz": "#fbf6ec"
}
```

- `fon`: orqa fon
- `konvert`: konvert va sarlavha matni (to‘q rang tanlang, oq qog‘ozda yaxshi o‘qilishi uchun)
- `muhr`: mum muhr
- `oltin`: chiziq va bezaklar
- `qogoz`: taklifnoma qog‘ozi

## Suratlar va musiqa

- Suratlarni `photos/` papkasiga yuklang (JPG, har biri 300 KB dan kichik bo‘lsa yaxshi, sayt tez ochiladi).
- `"suratlar": ["photos/1.jpg", "photos/2.jpg"]`
- Musiqa: `.mp3` faylni yuklab, `"musiqa": "photos/musiqa.mp3"` deb yozing. Mehmon muhrni bosganda boshlanadi, o‘ng pastdagi tugma bilan o‘chiriladi. Mualliflik huquqi bilan himoyalangan qo‘shiqdan ehtiyot bo‘ling.

## GitHub'ga yuklash

Telefon yoki kompyuterda, dasturlashsiz:

1. github.com ga kiring, **New repository** ni bosing, nom yozing (masalan `taklifnoma`), **Create repository**.
2. **uploading an existing file** havolasini bosing.
3. Zipni oching, ichidagi **hamma fayl va papkalarni** (`index.html`, `app.js`, `style.css`, `data`, `photos`, `.nojekyll`) tortib tashlang yoki tanlang.
4. **Commit changes** ni bosing.

Yangi taklifnoma qo‘shish: repository ichida `data` → **Add file → Create new file** → `shohruh-sevinch.json` nomi bilan matnni joylang → **Commit**.

## Saytni internetga chiqarish

Repository'ni **Cloudflare Pages** ga ulash tavsiya etiladi (Workers & Pages → Create → GitHub repository'ni tanlash). Build buyrug‘i va "build output" kerak emas, bo‘sh qoldiring. Har safar GitHub'ga fayl qo‘shsangiz, sayt o‘zi yangilanadi. Cloudflare reklama qo‘ymaydi va tijoriy foydalanishga ruxsat beradi.

GitHub Pages ham ishlaydi, lekin uning shartlari pullik xizmat sifatida foydalanishni cheklaydi. Mijozlarga sotadigan bo‘lsangiz, Cloudflare Pages xavfsizroq.

## Eslatma

- Havolani Telegramga yuborganda barcha taklifnomalar uchun bir xil ko‘rinish chiqadi (havola oldindan ko‘rinishida ism bo‘lmaydi). Bu statik saytning cheklovi.
- Shriftlar Google Fonts'dan yuklanadi. Internet sust bo‘lsa, vaqtincha oddiy shrift ko‘rinadi, hammasi ishlayveradi.
- Sahifa qidiruv tizimlaridan yashirilgan (`noindex`).
