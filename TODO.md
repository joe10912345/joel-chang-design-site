# TODO

Open items. When you finish one, move it to `CHANGELOG.md` with the date. Add new items here.

## Waiting on Joel's decision
- [ ] **About recommendations as frosted-glass cards with LinkedIn links**: Layout A chosen; Joel to pick a style from `preview/testimonials-ui.html` (A1/A2/A3/A4) and send the five LinkedIn URLs (Marcus Kung, Stanley Chai, Kuo Kai Liao, Rick Chen, Ike Tsao). Then build it into About desktop + iPad + phone (replaces the tiny phone quotes item below).
- [ ] **Same black-on-hover on other pages?** The Wix MouseOverPhoto skin (`.hhxEkR`) that made Ocean Series photos go black on hover is also used on: airgain-fwa-easy-installation-kit (8), moai-router (3), industrial (2), defense, electronics, networking (1 each). Check whether those should get the "dim at rest, bright + zoom on hover" treatment too.
- [ ] **Domain cutover**: point `www.joel-chang-design.com` at GitHub Pages (or Cloudflare in front). Keep `SITE_BASE` in `tools/siteconfig.py` as is. Then submit the sitemap in Google Search Console.
- [ ] **Languages**: zh-hant / zh-cn / ar are built but not published (`i18n-archive/README.md` says how to publish). Note: they were built before the 11-24 changes, so rebuild before publishing.

- [ ] **iPad on a real device**: tablet layout changed to 1440px wide (2026-11-24). Joel to check on a real iPad (portrait + landscape) once pushed; text in portrait is smaller than before (page scaled ~0.6).

## Known problems
- [ ] Phone About: testimonial quotes (Rick Chen, Ike Tsao, Kuo Kai Liao ...) are ~6px in the 320px layout, like "What I Believe" was. Same fix if Joel wants.
- [ ] 4K monitors: top images are the 2560px files, shown up to 3840px wide (1.5x, slightly soft). `media-originals/` has larger originals for most (2700-4000px) that could be copied into `site/assets/media/` for the desktop top images.
- [ ] Desktop windows narrower than ~1340px (e.g. a 1280px laptop window): the desktop layout is wider than the window and the category frames touch/cross the edges. Could shrink the page with CSS zoom below 1440 like the wide-screen zoom does above 1536.
- [ ] Two images are broken on live Wix too (403): one on `wi-fi7-hgu-ap`, one on `electronics` (blank placeholders with `data-live-src-missing`). Need replacement images.
- [ ] Site-wide social share image (og:image) is missing; needs a new one.
- [ ] `/scope` is password-protected on Wix; the export is only the password gate.
- [ ] Wix scroll-parallax effects not reproduced.

## Workflow / housekeeping
- [ ] `tools/build.py` and other export scripts use `/workspace/...` paths from the environment they were made in; they do not run on Joel's PC as-is. Today all edits are made directly in `site/`. Do NOT re-run `build.py` without checking: it would regenerate HTML from the raw Wix capture and could overwrite hand edits.
- [ ] `reference/asset-sources.json` differs from GitHub (same files, different original-name URLs); unclear which is newer, left uncommitted.
- [ ] README "Known limitations" should be kept in sync with this file.
