# CS15 Hub — Jazeera University CS Batch 15 Portal

A student-built academic portal for Computer Science **Batch 15** at Jazeera University. The platform combines course management, projects, messaging, elections, gamification, and more, plus the official **BTCH 15-B Profiling** class directory.

## Tech Stack

- **Frontend:** Vanilla JS single-page app (hash routing) + Bootstrap 5.3.2 + Bootstrap Icons + Chart.js
- **Backend:** PHP 8 (custom MVC under `app/`, REST API under `api/`)
- **Database:** MySQL (`cs15_hub`)
- **Environment:** XAMPP (Apache + MySQL + PHP)

## Quick Start (XAMPP)

1. Copy the `B15` folder into `C:\xampp\htdocs\` (the working directory is `batch15hub\B15`).
2. Create the database and import the schema:
   - Create a database named `cs15_hub`.
   - Import `../cs15_hub.sql` (dump located at the repository root).
3. Copy `app/Config/database.local.example.php` → `app/Config/database.local.php` and set your MySQL credentials and Google OAuth values.
4. Start Apache + MySQL from the XAMPP control panel.
5. Open `http://localhost/batch15hub/B15/` in a browser.

## Project Structure

| Path | Purpose |
| --- | --- |
| `index.php` / `index.html` | SPA entry points (SEO meta, favicons, asset loading) |
| `assets/js/app.js` | Hash router, route registration, guards |
| `assets/js/data.js` | Static demo data (no fabricated content) |
| `assets/js/members-data.js` | **BTCH 15-B Profiling** — official class directory (source of truth) |
| `assets/js/pages-*.js` | Public / auth / app / dashboard page templates |
| `app/` | PHP application: Config, Models, Controllers, Middleware |
| `api/` | REST API entry point |
| `uploads/` | User-uploaded content (git-ignored) |
| `favicon_io/` | Favicon package |
| `logo.png` | Official Batch 15 logo |
| `robots.txt`, `sitemap.xml` | SEO files |

## Maintaining the Class Directory

All 58 members are transcribed in `assets/js/members-data.js` from the official
`BTCH 15-B Profiling.pdf`. Fields map to the sheet columns:

```js
{
  id: 1,
  name: 'Aisha Abdirizak Ahmed',
  courses: ['MATH', 'JS', 'Management', 'DBMS'],   // "THIS SEMESTER"
  learningStyle: 'All rounder',                       // "OVERALL"
  programming: '90%',                                 // "OVERALL" (self-reported %)
  interests: ['IoT', 'Robotics', 'Embedded Systems'], // "INTRESTS"
  uniqueSkills: ['Resource & information gathering'],  // "UNIQUE SKILLS"
}
```

- "N/A" cells in the sheet are stored as empty arrays/strings — nothing is invented.
- To add or correct a student, edit this one file. Approved profiles created
  through the in-app profile system are merged alongside these records.

## SEO / Domain Note

`robots.txt`, `sitemap.xml`, and the canonical/OG meta tags reference
`https://batch15hub.xo.je`. If the production domain changes, update those three
places. Canonical, `og:url`, and `og:image` are also set dynamically from the
current URL in `index.php`/`index.html`, so they adapt to the active domain.

## Security

- `app/Config/database.local.php` is git-ignored. **Rotate the Google OAuth
  client secret** if the repository has ever been shared or pushed — the local
  file historically contained a real secret only in local config, but treat it
  as compromised to be safe.
- Access is role-based; sessions and API middleware enforce the permissions.

## License

Internal class project. Not for redistribution without the batch's consent.