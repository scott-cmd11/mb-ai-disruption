# Website review - aidisruption.ca

## 2026-05-11 2026 design standards pass

Audit notes:

- Local audit origin confirmed: `http://127.0.0.1:4560`.
- The strongest existing direction is the civic intelligence atlas/report-cover system on the homepage.
- The main polish gap is route-to-route consistency: older dark hero treatments, repeated ad hoc rounded cards, one-off inline control styles, and several tool surfaces that look less designed than the homepage.
- Shared leverage points are `src/app/globals.css`, `src/app/layout.tsx`, `src/components/RelatedLinks.tsx`, the homepage sections, and the client-heavy tool files for calculator, explorer, occupation, scenarios, and threat simulator.
- Risk areas to avoid heavy rewrites: React Flow geometry in `/explorer`, heatmap cell sizing, calculator state flow, and occupation detail-panel behaviour.

Design strategy:

- Chosen direction: "Prairie civic intelligence desk" - a refined 2026 public-data product using report rules, quiet paper/cool-grey surfaces, black ink, clay/red accents, restrained steel-blue and sage support colours, and dense but readable tool panels.
- Visual system updates: reduce global beige dominance with cooler information bands; make buttons chunkier and clearer; add reusable civic panel/card/table/control treatments; sharpen focus states; make hover states add emphasis without hiding content; remove legacy decorative motion from visible surfaces.
- Homepage updates: make the hero more composed and less brittle, remove the hidden legacy hero block, convert the key-stat strip and tool cards into more intentional data-publication sections, and replace the final dark CTA card with a high-contrast report-style CTA surface.
- Interior route updates: normalize civic page heroes, panels, tables, related links, legal/editorial pages, and tool surfaces through shared CSS classes/selectors before touching individual logic-heavy components.
- Tool route updates: improve calculator cards/controls, Explorer panels, occupation controls/cards, scenarios tables, threat simulator cards, and heatmap framing without changing their domain logic.
- Verification plan: run TypeScript and production build, inspect all major routes at desktop and mobile, check no horizontal overflow, click/snapshot core interactive surfaces, and record results here.

Implementation checklist:

- [x] Add/refine shared 2026 civic design primitives in `globals.css`.
- [x] Polish shell/header/footer and shared related-link/card treatments.
- [x] Polish homepage above/below the fold without changing content intent.
- [x] Normalize interior route hero and editorial/legal page treatments.
- [x] Polish calculator, explorer, occupation, heatmap, scenarios, and threat simulator surfaces.
- [x] Verify desktop and mobile routes, type/build checks, and browser screenshots.

Review:

- Added a cooler civic data palette, sharper button states, stronger focus treatment, reusable civic panels/tables/tool bands, and dark-surface contrast fixes.
- Polished the site shell, mobile nav, footer, share buttons, related-links strip, homepage hero/stat/tool/table/CTA sections, calculator intro, and scenarios table overflow behaviour.
- Fixed the dark `civic-page-hero-dark` text override risk and improved default visibility for footer/share controls and keyboard-focused calculator tiles.
- Verification passed: `npx tsc --noEmit`, `npm run build`, local `http://127.0.0.1:4560/` served 200 after a clean dev-server restart, and browser checks found no horizontal overflow on `/`, `/calculator`, `/explorer`, `/occupation`, `/heatmap`, `/scenarios`, `/threat-model`, `/threat-simulator`, `/about`, `/policy`, `/privacy`, or `/terms` at mobile width.
- Visual screenshots reviewed for homepage desktop/mobile, calculator mobile, explorer mobile, scenarios mobile, and threat-model desktop dark-section contrast.

## 2026-05-09 Dark CTA readability fix

- [x] Find the low-contrast button state shown in the screenshot.
- [x] Patch the affected CTA so text is visible before hover.
- [x] Run a focused build/check and record the result.
- [x] Commit, push, deploy, and verify production.

Review:

- Added an inverse secondary-button variant for dark sections and applied it to the homepage "Research & sources" CTA.
- `npx tsc --noEmit` passed.
- Fresh local page on `http://127.0.0.1:4557/` rendered the CTA with light text and a visible light border before hover.
- Full `npm run build` did not complete within the local timeout window during this pass.
- Production deploy completed and `https://www.aidisruption.ca/` contains the inverse CTA markup and CSS rule.

## 2026-05-08 Whole-site audit plan

- [x] Reconfirm local route inventory and production metadata.
- [x] Build the app and note warnings/errors.
- [x] Run the site locally and inspect every public route at desktop/mobile sizes.
- [x] Check core interactions for calculator, explorer, heatmap, occupation, scenarios, and threat simulator.
- [x] Review SEO surfaces: titles, descriptions, robots, sitemap, social image, structured data, headings, internal links, and crawlable content.
- [x] Prioritize recommendations by likely impact and implementation effort.
- [x] Add a review summary with findings and suggested changes.

## 2026-05-08 Audit review

Build verification: `npm run build` passes. Local confirmed origin: `http://127.0.0.1:4556`. Live spot checks for `/`, `/explorer`, `/threat-model`, `/policy`, `/robots.txt`, and `/sitemap.xml` return 200 at `https://www.aidisruption.ca`.

Findings:

- High SEO impact: `/policy` and `/threat-model` are public, indexable routes but are missing from `sitemap.xml`.
- High SEO/social impact: all routes inherit the same generic Open Graph title and description even when the page title and meta description are route-specific.
- Medium SEO impact: no canonical links are emitted, so shared URLs with calculator query params and host variants have weaker canonicalization.
- Medium SEO/UX impact: `/explorer` is client-only and initially renders a blank full-height shell before the lazy React Flow import loads. Its useful content is not present in the initial HTML.
- Medium conversion impact: `/calculator` has only a title override and inherits the homepage meta description; it should have a route-specific description and social preview.
- Medium polish impact: homepage visual direction is strong and distinctive, but several interior heroes still use the older dark grid/glow pattern, making the site feel like two design systems.
- Medium UX impact: the homepage mobile first view is memorable, but the ledger begins immediately below the fold with a very heavy dark block; a lighter transition or smaller mobile ledger would feel calmer.
- Low polish impact: icon assets from the default Next template still exist in `public/` and can be removed if unused.
- Low performance impact: current bundle sizes are reasonable for an interactive Next app, but React Flow should stay isolated to `/explorer`; avoid letting it leak into shared routes.

Suggested changes:

- Add `/policy` and `/threat-model` to the sitemap and consider stable `lastModified` dates from content/data updates instead of `new Date()` on every build.
- Add per-route Open Graph/Twitter metadata and canonicals through metadata alternates.
- Replace the Explorer blank shell with a meaningful loading skeleton or server-rendered mobile/list fallback containing the top sectors and an H1.
- Give `/calculator` a route-specific description and structured intro text outside the client component.
- Unify interior page art direction with the civic atlas/report-cover homepage: reduce dark glows, use paper bands, rule lines, tables, and report-style callouts.
- Add more crawlable, keyword-relevant page copy around high-intent searches such as "Manitoba AI risk calculator", "AI disruption by industry in Manitoba", and "AI risk by occupation".
- Add structured data beyond Dataset where useful: WebApplication for the calculator, BreadcrumbList for interior pages, and FAQPage for methodology/privacy questions.
- Keep performance tight by preserving static generation for content routes and using dynamic imports only on heavy interactive widgets.

## 2026-05-08 Implementation plan

- [x] Add shared SEO metadata helper with canonical, Open Graph, and Twitter defaults.
- [x] Add page-specific metadata for all public routes, including calculator.
- [x] Add missing sitemap routes and stable last-modified dates.
- [x] Add WebApplication and Breadcrumb/FAQ structured data where it helps.
- [x] Replace the Explorer blank first paint with a crawlable loading fallback.
- [x] Add a crawlable calculator intro and keyword-relevant page framing.
- [x] Align interior page hero surfaces with the civic report-cover direction.
- [x] Build, run local checks, commit, push, and verify the deployed site.

## 2026-05-08 Implementation results

- Added route-level canonical, Open Graph, and Twitter metadata through a shared SEO helper.
- Added `/policy` and `/threat-model` to the sitemap and replaced build-time `new Date()` sitemap values with a stable 2026-05-08 update date.
- Added WebApplication and breadcrumb structured data to the calculator route.
- Added a crawlable calculator intro for "Manitoba AI risk calculator" intent.
- Replaced the Explorer blank first paint with a ranked, crawlable sector fallback and kept the interactive map behaviour after hydration.
- Added an accessible Explorer H1 and shifted interior hero treatments toward the homepage's civic report-cover style.

Verification:

- `npm run build` passed.
- Local production server returned 200 for `/calculator`, `/explorer`, `/occupation`, and `/sitemap.xml`.
- Local metadata check confirmed route-specific canonical and Open Graph values for `/`, `/calculator`, `/explorer`, `/threat-model`, and `/policy`.
- Local sitemap check confirmed `/policy` and `/threat-model` are included.
- Mobile screenshots for `/calculator`, `/explorer`, and `/occupation` were reviewed after the changes.

## Plan

- [x] Inspect the local Next.js app structure and current uncommitted state.
- [x] Review the live website at https://www.aidisruption.ca/ across key pages.
- [x] Compare live behaviour against the codebase and project design constraints.
- [x] Identify code, UX, content, accessibility, performance, and visual-design improvements.
- [x] Document prioritized recommendations and verification notes.
- [x] Fix Explorer sector assessment links.
- [x] Make Explorer usable on mobile.
- [x] Align workforce slider copy with validation.
- [x] Add desktop active-nav styling.
- [x] Fix the Turbopack project-root warning.
- [x] Verify build and responsive behaviour.

## Review

## Review

Build verification: `npm run build` completed successfully.

Build warning to address: Next/Turbopack inferred the workspace root as `C:\Users\scott` because it found a higher-level `package-lock.json`. Set `turbopack.root` in `next.config.ts` so the project root is unambiguous.

Findings:

- Explorer `Assess this sector` creates a calculator URL with `primaryTasks: []`, but the calculator decoder rejects shared payloads unless `primaryTasks.length > 0`. Live verification shows the URL lands on step 1 instead of prefilled results.
- Explorer is not mobile-ready: toolbar and graph/sidebar stay in a wide desktop split, producing horizontal overflow and a cramped sector detail panel on a 390px viewport.
- Step 5 says workforce percentages may overlap, but validation blocks totals over 100%. The model copy and behaviour should be aligned.
- Desktop active navigation only visually highlights the primary Calculator link; active non-primary routes rely on `nav-link-active`, but no CSS rule exists.

Design opportunities:

- Keep the institutional editorial direction. It feels credible and avoids generic AI styling.
- Add a mobile-specific Explorer mode: selected-sector list/table first, graph as optional expandable map, sticky filter chips, and a full-width detail sheet.
- Improve the homepage's first-view information density on mobile by trimming the hero stat card or moving it below the stat strip.
- Add one restrained visual asset only if it carries meaning: an editorial Manitoba labour-market map/photo texture or report-cover style social preview. Avoid decorative AI art.

## Implementation results

- Fixed Explorer sector assessment links by sending a valid default task profile to the calculator.
- Reworked the Explorer for mobile with a ranked sector list first, optional map view, and full-width sector details.
- Kept the desktop Explorer graph layout intact.
- Clarified workforce slider copy so it matches the 100% validation rule.
- Added a visible active style for desktop navigation.
- Set the Turbopack project root in `next.config.ts`.
- Reduced homepage mobile hero density by hiding the large stat card on small screens.

Verification:

- `npm run build` passed.
- Turbopack root warning is gone.
- Local mobile browser check passed for `/` and `/explorer`.
- Shared calculator payload now opens Finance & Insurance results instead of restarting at Step 1.

## Visual redesign pass

- [x] Replace the generic dark-grid/SaaS visual language with a civic intelligence atlas direction.
- [x] Rework the homepage above the fold so the change is immediately visible.
- [x] Carry the new system into cards, tables, buttons, header, and footer.
- [x] Verify desktop and mobile in the in-app browser.

Visual verification:

- Desktop homepage now presents as a civic data publication/report cover rather than a dark SaaS dashboard.
- Mobile homepage keeps the CTA visible above the fold.
- `npm run build` passes after the redesign.
