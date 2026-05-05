# Website review - aidisruption.ca

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
