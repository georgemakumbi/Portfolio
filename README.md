# Makumbi George — Portfolio Website

**Full Stack Developer | Database Administrator | GIS Specialist | Systems Administrator**

A modern, responsive, and SEO-optimised professional portfolio website built with HTML5, CSS3, and JavaScript, with a PHP backend for the contact form.

---

## 📁 Project Structure

```
D:/portfolio/
├── index.html               ← Main portfolio page (all sections)
├── contact.php              ← PHP contact form handler (email + auto-reply)
├── .htaccess                ← Apache security, caching & clean URLs
│
└── assets/
    ├── css/
    │   └── style.css        ← Full stylesheet (CSS custom properties, animations)
    ├── js/
    │   └── main.js          ← Interactive JS (dark mode, slider, scroll, filter)
    ├── images/
    │   ├── profile.png          ← Hero & About profile photo
    │   ├── project-gis.png      ← GIS project screenshot
    │   ├── project-database.png ← Database project screenshot
    │   └── project-dashboard.png← Dashboard project screenshot
    └── cv/
        └── Makumbi_George_CV.pdf  ← Place your CV here
```

---

## ✨ Features

| Feature | Details |
|---|---|
| **Dark / Light Mode** | Toggle with memory (localStorage) |
| **Mobile-First Responsive** | Fully responsive from 320px to 4K |
| **Smooth Animations** | CSS animations + Intersection Observer |
| **Animated Skill Bars** | Triggered on scroll-into-view |
| **Animated Counters** | Stats animate on hero section load |
| **Project Filter** | Filter by Web, GIS, Database, Systems, Data |
| **Testimonials Slider** | Auto-play with dot/arrow controls |
| **Contact Form** | PHP backend with validation, rate limit, HTML email + auto-reply |
| **SEO Optimised** | Meta tags, OG tags, semantic HTML5, proper heading hierarchy |
| **Accessibility** | ARIA labels, roles, skip links, keyboard navigable |
| **Performance** | .htaccess gzip + cache headers, lazy-loaded images |

---

## 🎨 Design System

- **Colors:** Navy Blue (`#0a2342`) · Accent Blue (`#1e6fba`) · Teal (`#0d9488`) · Gold (`#c9a84c`)
- **Fonts:** Outfit (headings) · Inter (body) · JetBrains Mono (code/tags)
- **Radius Scale:** 8px → 14px → 20px → 30px → 9999px
- **Shadows:** 4-level elevation system with glow effects

---

## 🚀 Deployment

### Option 1: PHP Hosting (Recommended — full contact form)
1. Upload all files to your web host's `public_html/` or `www/` directory
2. Place your `Makumbi_George_CV.pdf` in `assets/cv/`
3. Update email address in `contact.php` line 14:
   ```php
   define('RECIPIENT_EMAIL', 'your-real-email@domain.com');
   ```
4. Ensure Apache's `mod_rewrite` and `mod_headers` are enabled
5. Visit your domain — done!

### Option 2: Static Hosting (GitHub Pages, Netlify, Vercel)
- Upload `index.html`, `assets/` folder
- Contact form will silently succeed (fetch fallback handles it)
- For real email on static hosts, integrate **Formspree** or **EmailJS**

---

## 🛠 Customisation Checklist

- [ ] Replace `profile.png` with your actual photo
- [ ] Add `Makumbi_George_CV.pdf` to `assets/cv/`
- [ ] Update email: `contact.php` line 14 & all HTML `mailto:` links
- [ ] Update phone: search & replace `+256 700 000 000`
- [ ] Update LinkedIn: `linkedin.com/in/makumbigeorge`
- [ ] Update GitHub: `github.com/makumbigeorge`
- [ ] Replace project GitHub/demo links in `index.html`
- [ ] Update Google Maps embed in contact section (optional)
- [ ] Swap project screenshots with real screenshots

---

## 📞 Contact

**Makumbi George**  
📧 makumbigeorge@email.com  
📍 Kampala, Uganda  
🔗 [LinkedIn](https://linkedin.com/in/makumbigeorge) · [GitHub](https://github.com/makumbigeorge)

---

*Built with HTML5 · CSS3 · JavaScript · PHP*
