# Doctor Profile & Clinic Services Website

A premium, responsive frontend for a specialist doctor's clinic, built with **HTML5, CSS3, Bootstrap 5, vanilla JavaScript, Bootstrap Icons, Swiper.js and AOS.js**. No build step required — open `index.html` directly, or deploy the folder as-is to any static host.

## 1. Project Structure

```text
doctor-clinic/
├── index.html              Homepage (hero, doctor profile, stats, services, clinic info,
│                            appointment CTA, testimonials, affiliations, FAQ)
├── about.html               Full doctor profile, education/experience timeline
├── doctor-profile.html      Same as about.html (kept for the URL pattern in the brief)
├── doctors.html             Doctor listing (extensible if more doctors join the clinic)
├── services.html            Full services grid
├── service-details.html     Dynamic service detail page — reads ?service= and renders
│                            content from assets/js/data.js
├── departments.html         Clinical departments overview
├── appointment.html         Full appointment booking form (validated, frontend-only demo)
├── contact.html              Contact form + clinic info + map
├── testimonials.html        Patient testimonials grid
├── gallery.html              Filterable photo gallery with lightbox
├── blog.html                  Blog listing (rendered from assets/js/data.js)
├── blog-details.html         Dynamic article page — reads ?post=
│
├── assets/
│   ├── css/
│   │   ├── style.css         Design tokens (CSS variables) + all component styles
│   │   └── responsive.css    Breakpoint overrides (1200/992/768/576px)
│   ├── js/
│   │   ├── main.js           Nav, counters, gallery filter, back-to-top, language toggle, lightbox
│   │   ├── appointment.js    Appointment form submit handler (demo — see Section 5 below)
│   │   ├── validation.js     Shared client-side validation helpers
│   │   ├── data.js           Mock data for services & blog (replace with real content/API)
│   │   └── mock-appointment-payload.json  Example payload shape for a backend endpoint
│   ├── images/                doctor/ clinic/ services/ gallery/ blog/ — add your own photos here
│   └── vendor/                (optional local copies of libraries; CDNs are used by default)
└── README.md
```

All pages share the same header/footer markup (there's no server-side templating), so an edit to
the navigation or footer needs to be copied across pages — this keeps the project pure static HTML,
deployable anywhere with zero build tooling.

## 2. Editing Doctor & Clinic Information

Search each HTML file for `<!-- EDIT: ... -->` comments — every placeholder (doctor name, clinic
name, address, phone, registration number, qualifications, hours) is marked this way. Key places:

- **Doctor name / title** — appears in the navbar brand, hero, `about.html`, and the footer.
- **Clinic address / phone / email / hours** — top bar, footer, `#clinic-info` on the homepage,
  and `contact.html`.
- **Qualifications & biography** — `about.html` (`.qualification-list` and the paragraph beneath it).
- **Stats** — the `data-counter` attributes in `index.html` (e.g. `data-counter="20"`).
- **Structured data** — the `<script type="application/ld+json">` block in `index.html`; update
  with only real, verifiable information.

## 3. Replacing Images

Images currently use Unsplash URLs as generic placeholders. To use your own:

1. Add files to the matching subfolder under `assets/images/` (`doctor/`, `clinic/`, `services/`,
   `gallery/`, `blog/`).
2. Replace the `src="https://images.unsplash.com/..."` attribute with a relative path, e.g.
   `src="assets/images/doctor/doctor-hero.jpg"`.
3. Keep the `alt` text accurate and descriptive for accessibility and SEO.
4. Recommended sizes: hero backgrounds ~1600px wide, profile photos ~900px, gallery thumbs ~600px.

## 4. Adding or Editing Services

- **Homepage preview & `services.html`**: duplicate a `.service-card` block and update the icon
  (any [Bootstrap Icon](https://icons.getbootstrap.com/) class), title, description and the
  `service-details.html?service=your-key` link.
- **Service detail content**: add a new entry to `SERVICES_DATA` in `assets/js/data.js` using the
  same key you linked to (`your-key`), following the existing shape (`title`, `icon`, `image`,
  `overview`, `symptoms`, `diagnosis`, `treatment`, `whenToSee`, `faqs`).

## 5. Backend: Appointment & Contact Forms

Both forms now submit to a small, dependency-free **PHP backend included in `/api/`**:

- `api/appointments.php` and `api/contact.php` — validate and sanitize every field server-side
  (never trust `assets/js/validation.js` alone — that's a UX convenience only), log each
  submission to `api/storage/`, and email the clinic.
- `api/config.php` — the only file you need to edit: set your real domain, notify email, and
  "From" address.
- `api/README.md` — full setup, deployment, email-delivery, and spam-protection details. **Read
  this before going live.**

This requires a PHP-enabled web server (most shared hosting, or a VPS with PHP installed) — it
won't work by opening `index.html` directly from disk, or on a purely static host with no PHP
runtime. If you'd rather use a different stack (Laravel, Node/Express, etc.), the contract is the
same: `assets/js/mock-appointment-payload.json` shows the exact JSON shape both forms send, so you
can point `API_BASE` in `assets/js/appointment.js` (and the fetch URL in `contact.html`) at your
own endpoint instead.

**Security notes:**
- Client-side validation is UX only — the PHP endpoints re-validate and sanitize everything.
- Both forms include a hidden honeypot field and basic IP rate limiting against spam.
- Never place API keys or secrets in frontend JavaScript.
- `api/storage/` contains patient data in plain log files — see `api/README.md` §5 for handling it
  responsibly (access is blocked via `.htaccess` on Apache; add an equivalent rule on Nginx).

## 6. Language Toggle (English | বাংলা)

`main.js` includes a lightweight demo toggle that swaps any element carrying `data-en`/`data-bn`
attributes and switches the page to the Noto Sans Bengali font. This is intentionally minimal —
for full bilingual content, replace it with a proper i18n approach (e.g. per-language JSON
dictionaries, or separate `*-bn.html` pages) as the site grows.

## 7. Deploying to a VPS or Shared Hosting

This is a static site — no server-side runtime is required.

**Shared hosting (cPanel, etc.):**
1. Zip the `doctor-clinic/` folder contents (not the folder itself).
2. Upload and extract into `public_html/` via File Manager or FTP.
3. Ensure `index.html` sits at the web root.

**VPS (e.g. Ubuntu + Nginx):**
```bash
# Copy files to the server
scp -r doctor-clinic/* user@your-server:/var/www/clinic-site/

# Minimal Nginx server block
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/clinic-site;
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```
Then reload Nginx (`sudo nginx -s reload`) and point your domain's DNS A record at the server.

**Going forward:** once a backend exists, keep the frontend on the same host or serve it from a
CDN and point the form `fetch()` calls at your API's URL (update CORS settings on the API
accordingly).

## 8. Quality Checklist Covered

Sticky/collapsing navbar with dropdowns · hero slider (Swiper) · animated stat counters ·
service cards with hover states · dynamic service-details page · validated appointment & contact
forms with a success message (no server dependency) · FAQ accordion · filterable gallery with a
simple lightbox · back-to-top and floating action buttons · fully responsive down to 375px with no
horizontal scroll · semantic HTML, alt text, visible focus states, ARIA labels on icon-only
buttons · per-page SEO metadata (title, description, canonical, Open Graph, Twitter Card) and a
Physician schema.org block on the homepage.

## 9. Known Placeholders to Replace Before Launch

Every qualification, award, patient count, affiliation, and testimonial in this template is
**placeholder content** and must be replaced with real, verifiable information before publishing —
see the inline `<!-- EDIT -->` comments throughout the HTML.
