---
name: Tailspin Shelter
description: Visual contract for a faithful migration of the existing responsive website.
status: final
sources:
  - ../epic-nextjs-frontend.md
updated: 2026-11-05
colors:
  page: '#0F172A'
  header: '#1D4ED8'
  white: '#FFFFFF'
  slate-100: '#F1F5F9'
  slate-200: '#E2E8F0'
  slate-300: '#CBD5E1'
  slate-400: '#94A3B8'
  slate-600: '#475569'
  slate-700: '#334155'
  slate-700-50: '#33415580'
  slate-800: '#1E293B'
  slate-800-50: '#1E293B80'
  slate-800-60: '#1E293B99'
  slate-800-70: '#1E293BB3'
  blue-400: '#60A5FA'
  blue-500: '#3B82F6'
  blue-500-10: '#3B82F61A'
  blue-600-10: '#2563EB1A'
  blue-500-50: '#3B82F680'
  blue-600: '#2563EB'
  blue-700: '#1D4ED8'
  purple-600-5: '#9333EA0D'
  green-400: '#4ADE80'
  green-500-20: '#22C55E33'
  amber-400: '#FBBF24'
  amber-500-20: '#F59E0B33'
  red-400: '#F87171'
  red-500-20: '#EF444433'
  red-500-50: '#EF444480'
typography:
  sans:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
  page-title:
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '40px'
  section-title:
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '32px'
  card-title:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '28px'
  body:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '24px'
  lead:
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '28px'
  detail-title:
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '36px'
  about-copy:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.625'
  small:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '20px'
rounded:
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  '10': 40px
  '12': 48px
components:
  shared-header:
    background: '{colors.header}'
    foreground: '{colors.white}'
    padding: '{spacing.4}'
  page-shell:
    background: '{colors.page}'
    max-width: 1280px
  dog-card:
    background: '{colors.slate-800-60}'
    border: '{colors.slate-700-50}'
    radius: '{rounded.xl}'
  dog-details:
    background: '{colors.slate-800-70}'
    border: '{colors.slate-700}'
    radius: '{rounded.xl}'
  about-panel:
    background: '{colors.slate-800-70}'
    border: '{colors.slate-700}'
    radius: '{rounded.xl}'
  back-link:
    background: '{colors.blue-600}'
    foreground: '{colors.white}'
    radius: '{rounded.lg}'
---

## Brand & Style

The visual contract continues the existing Tailspin Shelter website, not a new identity. Keep its dark slate canvas, strong blue header and links, cool-toned text, translucent slate panels, rounded corners, and restrained hover transitions. The system font stack is inherited from the current site. The approved adoption form uses this existing system rather than introducing a new theme, imagery, or interaction motif.

## Colors

The page canvas is `{colors.page}` with white header text. The header uses `{colors.header}`. Slate text roles distinguish primary headings (`{colors.slate-100}`), supporting copy (`{colors.slate-300}`), and subdued metadata (`{colors.slate-400}`). Cards and panels layer translucent `{colors.slate-800}` over the page; their borders use `{colors.slate-700}` at the opacity encoded by the named token.

Blue is the existing navigation and action color: `{colors.blue-400}` and `{colors.blue-600}` identify links/actions, while `{colors.blue-500}` provides the card hover border and blue-tinted shadow. The card hover wash uses `{colors.blue-600-10}` and `{colors.purple-600-5}`. Keep the existing status colors mapped to their meanings: green for Available, amber for Pending Adoption, and red for Adopted. Red also distinguishes visible API error text and its detail-page container. These colors are not a license to add badges or messages beyond those already present.

Contrast observations below are measurements of opaque source palette pairs for reference, not new acceptance thresholds or a formal conformance claim: white on blue header 6.70:1; slate-100 on slate-900 16.30:1; slate-300 on slate-900 12.02:1; slate-400 on slate-900 6.96:1; blue-400 on slate-800 5.75:1; green-400 on slate-800 8.40:1; amber-400 on slate-800 8.76:1; red-400 on slate-800 5.29:1; slate-600 on slate-800 1.93:1. Translucent panel composites vary with their underlying surface; preserve the palette and opacity tokens rather than treating these sample ratios as universal.

## Typography

Use `{typography.sans.fontFamily}` throughout. Preserve the existing Tailwind type roles: the homepage headline uses `{typography.page-title}`, section headings use `{typography.section-title}`, dog-card names use `{typography.card-title}`, the introductory sentence uses `{typography.lead}`, and detail-page dog names use `{typography.detail-title}`. About-page prose uses `{typography.about-copy}`. Weight, line-height, and size follow the source utility classes; do not substitute a display face or change the hierarchy.

## Layout & Spacing

The shared page shell is centered and capped at 1280px (`max-w-7xl`), with `{spacing.6}` vertical main padding and inner horizontal padding of `{spacing.4}` by default, `{spacing.6}` from the `sm` breakpoint, and `{spacing.8}` from `lg`. Page content adds its current `{spacing.8}` vertical padding. The header content is centered in the same container, keeps its title and two navigation links on one horizontal row, and uses `{spacing.4}` padding.

The homepage introduction is capped at 768px. Dog cards use one column by default, two columns at `sm` (640px), and three columns at `lg` (1024px), with `{spacing.6}` gaps. The dog-detail facts remain a two-column grid. The About panel is centered within a 1024px maximum-width section. Preserve the existing vertical padding and gaps rather than adding new responsive patterns.

## Elevation & Depth

The page uses no elevation to organize content. The header retains its subtle shadow. Translucent panel fills, thin slate borders, and background blur distinguish cards from the page. Preserve the dog-card shadow and its blue-tinted hover shadow; preserve the About panel's base shadow. Do not add shadows to other surfaces.

## Shapes

Use `{rounded.xl}` (12px) for dog cards, dog details, and the About panel. Use `{rounded.lg}` (8px) for action links, pagination controls, and the smaller rounded callout edge. Status labels retain their `{rounded.full}` pill shape. Keep image-free panels and text surfaces as implemented; do not add decorative image framing.

## Components

- **Shared header:** `{components.shared-header}`. Full-width blue bar with the bold “Tailspin Shelter” home link on the left and “Home” / “About” links on the right. Links underline on hover.
- **Page shell:** `{components.page-shell}`. Centers page content in the shared maximum-width container and preserves the existing responsive padding.
- **Homepage introduction:** One large heading and a single lead sentence, left aligned within the 768px text measure.
- **Dog list:** “Available Dogs” heading followed by a responsive grid. The empty state is a centered, padded, translucent slate panel with a thin slate border.
- **Dog card:** `{components.dog-card}`. The whole card is a link. Name and breed are left aligned in a padded panel; “View details” and a right-arrow icon finish the card. Hover changes the border to `{colors.blue-500-50}` and the name to `{colors.blue-400}`, reveals the existing blue (`{colors.blue-600-10}`) to purple (`{colors.purple-600-5}`) wash, lifts the card 6px, and increases its shadow.
- **Pagination:** Centered row with Previous, page information, and Next. Available links use slate surfaces and borders with blue hover styling. An unavailable direction is muted, translucent, and non-interactive.
- **Dog details:** `{components.dog-details}`. Padded panel with the name and status pill on the first row, breed/age/gender in two columns, then “About {name}” and the description.
- **Adoption form:** A bordered, translucent slate panel below the details, using the existing panel radius and spacing. Labels and inputs use the established slate text and surfaces; the submit button uses the existing blue action color. Success and errors use the existing green and red text colors.
- **About panel:** `{components.about-panel}`. Large bordered panel with a bold `{colors.blue-400}` heading and slate bottom rule, two prose paragraphs, a shaded note with a blue left border, and a centered blue “Back to Dogs” action.
- **Back links:** `{components.back-link}`. Blue rounded links with the existing left-arrow icon. Preserve the distinct “Back to All Dogs” and “Back to Dogs” labels on their respective pages.
- **Error surfaces:** Homepage uses a centered translucent slate panel and red error text. Dog-detail errors use a red-tinted background, red border/text, and padded rounded panel.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Match the existing Astro layout, palette, typography, spacing, and responsive breakpoints. | Redesign, rebrand, or introduce a light/dark theme switch. |
| Preserve the exact structure and appearance of current cards, panels, status labels, navigation, and hover states; style the approved adoption form with existing tokens. | Add dog photos, icons beyond the existing arrows, decorative patterns, or unrelated component types. |
| Retain current responsive grid changes and the horizontal header navigation. | Invent a mobile menu, reorder page content, or alter the detail facts grid. |
| Use the tokens here as the visual contract for the migration. | Let implementation differences from Astro change the rendered visual result. |
