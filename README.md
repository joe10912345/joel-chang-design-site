# joel-chang-design.com — static export (off Wix)

> **Working on this site (people or AI)?** Read `CHANGELOG.md`, `TODO.md` and `DESIGN-SYSTEM.md` first, and add an entry to
> `CHANGELOG.md` after every change. Rules for AI assistants: `AGENTS.md`.

A self-contained copy of https://www.joel-chang-design.com/ (Wix classic editor site),
captured from the **live site** on 2026-11-23 (UTC+8). Every page was rendered in a headless
browser (scrolled to load lazy content), the final DOM saved, Wix runtime/tracking scripts
removed, and every image, font, stylesheet and video downloaded and re-linked locally.
No Wix server is needed to view it.

## Folder layout

| path | what |
|---|---|
| `site/` | The website. Open with any static server. `site/index.html` = home. |
| `site/<page>/index.html` | Desktop layout of each page (35 pages, see `PAGES.md`). |
| `site/m/<page>/index.html` | Mobile layout of each page (Wix classic keeps a separate mobile design). |
| `site/assets/media/` | Images exactly as displayed (sharpest size Wix served, i.e. the 2x variant). |
| `site/assets/fonts/`, `css/`, `video/`, `files/` | Fonts, stylesheets, background videos, favicon etc. |
| `site/assets/js/site.js` | Small hand-written script that replaces the Wix runtime (see below). |
| `site/assets/css/static-overrides.css` | Small CSS fixes for running without Wix. |
| `media-originals/` | The original uploaded files (no Wix crop/resize) for every image used — for future redesign work. Not linked from the site. |
| `content/<page>.md` | All text copy per page, in reading order. |
| `PAGES.md` | Page list: slug, title, live URL, local files. |
| `ASSETS.md`, `reference/asset-sources.json` | Asset counts and the live URL each local file came from. |
| `reference/screenshots-live/`, `reference/screenshots-local/` | Full-page screenshots, live vs. this copy (desktop 1440px, mobile 390px). |
| `reference/side-by-side/` | Live (left) vs local (right) comparison images. |
| `reference/responsive/` | Live vs local at phone / iPad / laptop / 1920 / 2560 sizes + `home-local-grid-all-sizes.jpg`. |
| `tools/` | Scripts used for the export (Playwright render, build, screenshot/compare) so it can be re-run. |

## View it locally

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000/
```

Layout choice matches live Wix: phones (touch screen, short side < 600px) get the mobile layout `m/`;
iPads/tablets get the desktop layout scaled to a 980px-wide viewport (exactly what Wix does);
desktop browsers get the desktop layout (a window narrower than 600px switches to mobile).
Force one with `?layout=desktop` or `?layout=mobile` (remembered for the browser tab).
Works over `file://` too (double-click `site/index.html`).

## What `site.js` replaces

- Entrance animations: removed on purpose (update 2). All text is static on desktop and mobile; the build strips Wix's float-in/fade-in/breathe motion rules.
- Mobile hamburger menu open/close.
- Desktop "Works" dropdown menu.
- Home hero slideshow: a continuous slide to the left with a seamless loop. Timing matches live: 4s per slide, 1s transition with cubic-bezier(.87,0,.13,1). All 10 slides (2 were missing from Wix's preload and were added from live), the n/10 counter, and swipe on touch.
- Full-bleed section backgrounds / slideshow images fill the viewport at any width (were frozen at 1440px);
  wide backgrounds are stored at up to 2560px.
- Pro Gallery hover overlays (title + description on hover, e.g. home "End-to-End Expertise" and "Works" grid,
  moai-router, interstellar05, ai-tool-kit) — markup harvested from live; on touch devices first tap shows it.
- Home "Works" grid tiles link to their project pages (on live this was Wix JS; the build turns them into real links using `tools/works-links.json`).
- Gallery slider arrows (next/prev) + native swipe/trackpad scrolling.
- Top-menu hover state on every item.
- Wix video player (wi-fi7-gaming-home-gateway) -> native HTML5 video with controls.

## Custom additions (update 2): `assets/css/custom.css` + `assets/js/custom.js`

These are changes Joel asked for that are **not** on the live Wix site. They are kept separate from the Wix-replacement code.
- **Design Approach cards (home)**: the 4 cards get a hover glow, an inner radial light that follows the cursor plus a soft outer glow, 0.3s. On touch devices a tap toggles it.
- **Menu**: an underline on the hovered top-level item, the other items fade, and the current page is underlined. Dropdown rows turn white on a lighter row (0.2s).
- **Cross-Category grid (home)**: each of the 18 product tiles lifts slightly with a blue glow behind it on hover; on touch devices a tap does the same.
- **Softer hovers**: gallery text overlays, the image darkening and both glows ease in and out over about 0.6s. Title, then description, fade in with a small rise.
- **Works dropdown**: no background box on hover; the text brightens to white and the other items dim.
- **Header auto-hide**: it slides up when you scroll down and slides back when you scroll up. It is always shown near the top and stays while a dropdown or the mobile menu is open, on all pages, desktop and mobile.

## Known limitations (things that only worked on Wix)

See the "Limitations" section of the export report; summary:
- **Contact form**: now sends through Web3Forms (`site/assets/js/custom.js`), not Wix.
- **Vimeo video** on the home page stays an embed from Vimeo (it's hosted there, not on Wix).
- **Gallery lightboxes**: reproduced for galleries that enlarged on click on live (custom.js). Wix scroll-parallax effects are not reproduced.
- **Two images are broken on the live site too** (Wix returns 403): on `wi-fi7-hgu-ap` and `electronics`. They're blank placeholders here (`data-live-src-missing` attribute keeps the old URL). The site-wide social share image (og:image) is also gone on Wix and was dropped.
- One link points to `/scope`, a live page not in the Wix sitemap (hidden page); it was not exported and still links to the live URL.
- The HTML is Wix's generated markup (absolute-positioned, hashed class names). It looks right, but for real UI/UX changes a rebuild with clean HTML/CSS (using `content/` + `media-originals/` + screenshots as the spec) will be easier than editing this markup.

## Deploying

The `site/` folder is the web root. It is already published to GitHub Pages at
https://joe10912345.github.io/joel-chang-design-site/ (workflow: `.github/workflows/pages.yml`).
The planned public host is the existing custom domain, with the same paths:

    https://www.joel-chang-design.com/

Do not add a `site/CNAME` file; the Actions deploy ignores it. Point the domain
at GitHub Pages (or Cloudflare in front of it) when you are ready to cut over.

## SEO and the public URL

Canonical tags, Open Graph, Twitter tags, JSON-LD, `sitemap.xml`, `robots.txt`,
`llms.txt`, and `llms-full.txt` are generated by `tools/seo_apply.py` from one
constant, `SITE_BASE`, in `tools/siteconfig.py`.

It is currently `https://www.joel-chang-design.com` — the same URLs the Wix site
uses. This is a hosting change, not a URL change. After the domain points at
this static host, leave `SITE_BASE` as it is. To preview tags against the
GitHub Pages project URL instead, set `SITE_BASE` to
`https://joe10912345.github.io/joel-chang-design-site` and run:

```bash
python3 tools/seo_apply.py
python3 tools/seo_verify.py
```

`tools/build.py` also runs `seo_apply.py` at the end of a rebuild.

**robots.txt on GitHub Pages:** crawlers only honor `robots.txt` at the host
root (`https://joe10912345.github.io/robots.txt`), not at a project subpath.
`site/robots.txt` is still included so it works once the custom domain is the
site root. Submit `https://www.joel-chang-design.com/sitemap.xml` in Google
Search Console after cutover.

Page titles and the Home / `/4` meta descriptions match live Wix. Other pages
had no meta description on Wix; those were filled from the page’s own copy.
Google and Bing site-verification tags from Wix are kept on every page.

The Wix page `/scope` (linked from Defense) is password-protected, so the
export is the password gate rather than the protected body. The Defense link
is a relative in-site path so it will not 404 after cutover.
