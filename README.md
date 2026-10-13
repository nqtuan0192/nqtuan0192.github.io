# Nguyen Quoc Tuan — Researcher profile

Static, bilingual (English/Vietnamese) academic profile for Nguyễn Quốc Tuấn, SoICT, Hanoi University of Science and Technology. The layout is inspired by Minimal-style academic pages and i3 workspaces. Light mode is the default; language and theme preferences are stored locally.

## Run locally

Requires Node.js 18 or later; no installation or dependencies needed.

```sh
npm run dev
npm test
```

Open http://localhost:3000. Use HTTP rather than opening the HTML file directly so the browser can load modules and the bibliography.

## Update content

- `index.html` contains the page structure and English fallback content.
- `assets/i18n.js` holds the English/Vietnamese text. Update the matching translation keys when editing text marked with `data-i18n`.
- `assets/profile-portrait.webp` is the optimized 360×540 portrait (8.45 kB) from the supplied SoICT profile. The page prefers WebP and retains `assets/profile-portrait.jpg` as a fallback. The displayed 164px frame has sufficient resolution for 2× screens. To replace the portrait, edit both image paths in `index.html` and the `photoAlt` translations.
- `publications.bib` contains eight selected publications from the SoICT profiles. The page automatically formats, sorts, searches, and filters these records, with DOI links and BibTeX downloads. This is a selected list, not a claim of a complete publication history.

## Bibliography sources

Original BibTeX exports from Crossref are preserved in `data/bibtex-sources.json`. See `data/bibliography-notes.md` for author-name normalization, publication types, and the 2021 online / 2022 journal-year distinction.

Regenerate the bibliography from these archived exports, without network access:

```sh
node scripts/import-bibliography.mjs
```

This importer is specific to the eight archived records. To add publications, append valid entries to `publications.bib` and maintain unique keys and DOIs. Rerunning the archive importer replaces the file with the original eight records.

The reader supports nested braces, quoted fields, macros, concatenation, common LaTeX accents, and standard author names. It is a lightweight formatter rather than a full TeX or CSL citation engine.

## GitHub Pages

Push the files to GitHub, then choose **Settings → Pages → Deploy from a branch**, your branch, and **/ (root)**. No build step is required. Relative asset paths support both user and project sites.

## Design and sources

System monospace fonts, 18px body text, generous line spacing, and responsive layouts. The supplied Alacritty palettes are defined in `assets/style.css`; `hl-blue`, `hl-green`, etc. provide text highlighting. Bold highlights use normal colors in light mode and bright colors in dark mode. Small dark-mode links and magenta labels use bright variants for contrast.

Profile information and portrait were retrieved from:
- https://soict.hust.edu.vn/ts-nguyen-quoc-tuan.html
- https://soict.hust.edu.vn/en/ph-d-nguyen-quoc-tuan.html

The two pages agree on degrees, affiliation, research areas, institutional email, scholarships, and the eight selected publications. Profile and bibliography sources were checked on 2026-10-14. No analytics or backend services are included.

## Historical background and profile links

Historical education and project-research details, GitHub, Google Scholar, and ORCID links were checked against https://profile.nqtuan0192.me/ on 2026-10-14. The archived page describes the Ph.D. as awarded by SOKENDAI and lists NII as the research institution. It calls the 2015 qualification an engineering degree, while SoICT abbreviates it as B.S.; this site uses the more specific engineering designation. The old page's Ph.D.-student label and “currently” project-researcher wording are not reused as present-day job titles; the present affiliation follows SoICT. The Location button points to HUST in Hanoi, not the historical Tokyo location.
