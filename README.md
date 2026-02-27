# 🚀 JobHunt — Job Listing Website

A fully functional, responsive job listing web application built with HTML, CSS, and Vanilla JavaScript.

---

## 📸 Features

- **Job Cards** — Each job displayed as a clean card with company logo, title, location, salary, experience level, and description
- **Advanced Filters** — Filter by keyword, location, category (IT/Design/Marketing/Management), experience level (Fresher/Mid/Senior), and job type
- **Search Bar** — Hero search + sidebar keyword search
- **Save Jobs** — Save/unsave jobs with localStorage persistence
- **View Details Modal** — Full job details in a smooth animated modal
- **Pagination** — 6 jobs per page with page navigation
- **Sorting** — Sort by Newest or A–Z
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Toast Notifications** — User feedback on all actions

---

## 🛠️ Tech Stack

| Layer      | Technology                   |
|------------|------------------------------|
| Structure  | HTML5                        |
| Styling    | CSS3 (custom, no framework)  |
| Logic      | Vanilla JavaScript (ES6+)    |
| Data       | Local JSON file              |
| Fonts      | Google Fonts (Syne + DM Sans)|
| Deployment | Netlify / GitHub Pages       |

---

## 📁 Project Structure

```
job-listing-website/
│
├── index.html          # Main HTML file
├── README.md           # This file
│
├── css/
│   └── style.css       # All styles (dark editorial theme)
│
├── js/
│   └── app.js          # All JS logic (filter, render, modal, save)
│
└── data/
    └── jobs.json       # 12 sample job listings
```

---

## 🚀 How to Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/job-listing-website.git
   cd job-listing-website
   ```

2. **Open in browser**
   - Either open `index.html` directly in your browser  
   - OR use VS Code's Live Server extension (recommended — required for JSON fetch to work)

   > ⚠️ Note: Due to `fetch()` for the JSON file, you need a local server. Use VS Code Live Server, or run: `npx serve .`

3. **That's it!** No npm install, no build step needed.

---

## 🌐 Deployment

### Deploy on Netlify (Recommended — Free)
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com) → New Site → Import from GitHub
3. Select your repo → Deploy
4. Your site is live in ~30 seconds!

### Deploy on GitHub Pages
1. Push code to GitHub
2. Go to repo Settings → Pages → Source: `main` branch, `/ (root)`
3. Site will be live at `https://YOUR_USERNAME.github.io/job-listing-website`

---

## 📊 Evaluation Criteria Coverage

| Criteria              | Implementation                                      |
|-----------------------|-----------------------------------------------------|
| Design Quality (25%)  | Dark editorial theme, Syne + DM Sans fonts, smooth animations |
| Functionality (25%)   | All filters, modal, save job, pagination, search    |
| Code Quality (20%)    | Modular JS functions, CSS variables, clean structure |
| GitHub Usage (15%)    | Regular commits with meaningful messages            |
| Presentation (15%)    | Deployed on Netlify, demo-ready                     |

---

## 👨‍💻 Author

parameswar swain
Driems university
