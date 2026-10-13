# Nguyen Quoc Tuan — Researcher profile

Static, bilingual (English/Vietnamese) academic profile for Nguyễn Quốc Tuấn, SoICT, Hanoi University of Science and Technology. The layout is inspired by Minimal-style academic pages and i3 workspaces. Dark mode and English are the defaults; language and theme preferences are stored locally.

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


