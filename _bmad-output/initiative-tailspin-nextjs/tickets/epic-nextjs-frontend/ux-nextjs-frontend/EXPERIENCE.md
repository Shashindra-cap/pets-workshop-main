---
name: Tailspin Shelter — Experience
status: final
sources:
  - ../epic-nextjs-frontend.md
updated: 2026-11-04
---

# Tailspin Shelter — Experience Spine

## Foundation

Responsive website for desktop and mobile browsers. The experience is a faithful migration of the current Astro site; no additional UI system is prescribed. `DESIGN.md` is the visual identity reference and owns component appearance. This spine owns routes, content, behavior, states, and accessibility behavior.

The epic ticket's R1–R4 are the source brief. This contract records their observable UX consequences without replacing or restating the implementation requirements. The Astro pages and components under `app/client/src/` are the fidelity reference for current layout, copy, navigation, and state handling.

## Information Architecture

| Surface | Path | Reached from | Purpose |
|---|---|---|---|
| Home / dog listing | `/` and `/?page={n}` | Home navigation link; Back links | Browse the current page of available dogs; page size is six. |
| Dog details | `/dog/{id}` | Selecting a dog card | Read that dog's name, status, breed, age, gender, and description. |
| About | `/about` | About navigation link | Read the existing shelter story and fictional-organization note. |

The shared header links to Home (`/`) and About (`/`). The home listing owns pagination; dog details and About each provide an in-content link back to `/`.

## Voice and Tone

Preserve the site's existing wording, capitalization, punctuation, and dynamic text. Do not rewrite copy or add explanatory, promotional, or loading messages.

| Context | Exact current text |
|---|---|
| Home document title | `Tailspin Shelter - Find Your Forever Friend` |
| Dog-details document title | `Dog Details - Tailspin Shelter` |
| About document title | `About - Tailspin Shelter` |
| Shared header | `Tailspin Shelter` · `Home` · `About` |
| Home introduction | `Welcome to Tailspin Shelter` · `Find your perfect companion from our wonderful selection of dogs looking for their forever homes.` |
| Listing heading and card action | `Available Dogs` · `View details` |
| Empty listing | `No dogs available at the moment.` |
| Pagination | `← Previous` · `Page {page} of {totalPages}` · `Next →` |
| Dog-details labels | `Breed: {breed}` · `Age: {age} year` for age 1, otherwise `Age: {age} years` · `Gender: {gender}` · `About {name}` |
| Dog statuses | `Available` · `Pending Adoption` · `Adopted` |
| Dog-details fallback | `No dog information available` |
| Dog-details back link | `Back to All Dogs` |
| About heading and note | `About Tailspin Shelter` · `Note:` · `Tailspin Shelter is a fictional organization, created for this workshop.` |
| About back link | `Back to Dogs` |

The About page's two paragraphs remain verbatim:

> Nestled in the heart of Seattle, Tailspin Shelter is a warm, welcoming haven for dogs of all breeds and backgrounds. Founded in 2015 by a small group of dog lovers and rescue advocates, our mission is to give every dog a second chance at a happy, healthy life. Whether it's finding forever homes, providing medical care, or offering behavioral training, our dedicated team works tirelessly to ensure each dog's journey has a joyful destination. Inspired by Seattle's vibrant and compassionate community, we've grown from a small foster network into a full-service shelter and adoption center.
>
> The name "Tailspin" reflects both the whirlwind of emotions dogs often experience when they first arrive — and the joyful, spinning tails we see when they find their perfect match. For us, a "tailspin" is a reminder of the transformations we witness daily: from uncertainty and fear to trust, love, and boundless energy. It's this journey that fuels our work and reminds us why we do what we do. Every wagging tail is a testament to resilience and hope.

## Component Patterns

This section covers behavior; visual treatment is specified in the Components section of `DESIGN.md`.

| Component | Use | Behavioral contract |
|---|---|---|
| Shared header | All pages | “Tailspin Shelter” and “Home” navigate to `/`; “About” navigates to `/about`. Keep them as links. |
| Page shell | All pages | Preserve the shared centered content area and responsive padding; it does not change route or page content. |
| Homepage introduction | Home listing | Keep the current welcome heading and supporting sentence above the listing, including when a listing request fails. |
| Dog list | Home listing | Show “Available Dogs” and either the returned cards or the current empty state. A listing failure shows the error surface instead of the list. |
| Dog card | Home listing | The entire card is one link to `/dog/{id}`. It contains the API-provided name and breed and the `View details` label. |
| Pagination | Home listing with multiple pages | Render only when `totalPages > 1`. An available direction is a link to `/?page={n}`; an unavailable direction is a non-interactive span. Show the current `Page {page} of {totalPages}`. |
| Dog details | Dog detail route | Show name, status, breed, age, gender, and description. Render singular `year` only for age 1. Map `AVAILABLE` to `Available`, `PENDING` to `Pending Adoption`, and the remaining status branch to `Adopted`. |
| Back links | Dog details and About | “Back to All Dogs” and “Back to Dogs” both navigate to `/`; retain the distinct labels. |
| About panel | About route | Display the two exact paragraphs and fictional-organization note in their current order, followed by the “Back to Dogs” link. |
| Error surfaces | Home listing and dog details | Show the existing route-specific error message and keep each route's currently available navigation. Do not invent error actions. |

Keep the current `data-testid` hooks and their scope so the unchanged Playwright assertions continue to address the same elements:

- Home/list: `error-message`, `empty-state`, `dog-list`, `dog-card`, `dog-name`, `dog-breed`.
- Pagination: `pagination`, `pagination-prev`, `pagination-info`, `pagination-next`. The `prev` and `next` hooks are on the available links only; disabled directions remain untagged spans.
- Dog details: `dog-details`, `dog-name`, `dog-status`, `dog-breed`, `dog-age`, `dog-gender`, `dog-description`, `back-link`.
- About: `back-link`.

Repeated hooks such as `dog-name` and `dog-breed` remain repeated per dog card; do not rename, move, or deduplicate them.

## State Patterns

| State | Surface | Current behavior and exact message |
|---|---|---|
| Successful listing | Home | Render the API-returned dogs and page metadata. The visible list contains up to six dogs per page. |
| Empty listing | Home | Render `empty-state` with `No dogs available at the moment.` |
| Listing HTTP failure | Home | Keep the home introduction; render `error-message` with `Failed to fetch data: {status} {statusText}`. Do not render the dog list or pagination for this state. |
| Listing request failure | Home | Keep the home introduction; render `error-message` with `Error: {error.message}` (or `Error: {String(error)}` when the thrown value is not an `Error`). Do not render the dog list or pagination for this state. |
| Missing or invalid page query | Home | Use page 1 when `page` is absent, non-numeric, zero, or negative. |
| One-page result | Home | Omit pagination. |
| First / last page | Home | The unavailable Previous / Next control is a muted, non-interactive span with its existing arrow label; only the available direction is a link. |
| Dog found | Dog details | Render the detail panel and the status text corresponding to the API status. |
| Dog not found (HTTP 404) | Dog details | Render `error-message` with `Dog not found`; keep the `Back to All Dogs` link available. |
| Other dog HTTP failure | Dog details | Render `error-message` with `Failed to fetch dog: {status} {statusText}`; keep the back link available. |
| Dog request failure | Dog details | Render `error-message` with `Error: {error.message}` (or `Error: {String(error)}` for a non-`Error` thrown value); keep the back link available. |
| Successful response without a dog object | Dog details | Render `No dog information available`; keep the back link available. |
| Page content loading | All | The reference renders the fetched page content directly and defines no loading skeleton, progress indicator, or client-side loading copy. Do not invent one. |

## Interaction Primitives

- Use native links for navigation and pagination. A dog card remains a single whole-card link, not a clickable container with nested links or buttons.
- Keep ordinary browser navigation behavior for Home, About, dog details, pagination, and back links. Do not introduce modal flows, client-side filters, or other actions.
- An unavailable pagination direction is not an active link and cannot be activated.
- Preserve existing pointer hover treatments as visual feedback; navigation remains available through the semantic links and keyboard operation.
- Keep keyboard focus on native links visible using the browser's native focus behavior; preserve a logical focus and reading order.
- Dog information is read-only on these pages. No adoption, contact, search, or editing interaction is part of this experience.

## Accessibility Floor

Use semantic navigation and native keyboard-operable anchors for all current navigation controls. Keep the existing headings, text, and controls as real text and links rather than replacing them with non-semantic click targets. Preserve reading order and the actual content hierarchy. This is the agreed interaction floor; it is not a claim of formal WCAG conformance or a new accessibility audit.

Retain native anchor keyboard-focus behavior; do not suppress it or replace links with non-semantic click targets. Visual styling is governed by `DESIGN.md`; this contract does not add a contrast threshold or a custom focus treatment.

## Responsive & Platform

| Viewport | Existing behavior to preserve |
|---|---|
| Desktop browser | Center the shared shell within its 1280px maximum width. Keep header title and navigation links in one row. Show three dog-card columns at `lg` (1024px and wider). |
| Mobile browser | Keep the same header links and content order. Show one dog-card column below `sm` (640px); show two from `sm` to below `lg`. Keep the dog-detail facts in two columns. |
| All browser widths | Retain the current shared side padding changes (16px default, 24px at `sm`, 32px at `lg`), route behavior, and link labels. Do not add a separate native-app or mobile-menu experience. |

## Key Flows

### Flow 1 — Browse dogs on a phone (Riley, prospective adopter)

1. Riley opens the site on a phone and lands on `/`.
2. The home introduction and first page of dog cards appear. Each card identifies a dog by name and breed and offers `View details`.
3. If Riley wants to see more dogs, they follow the available `Next →` link. The URL changes to `/?page=2` and the next API-provided page appears; Riley can use `← Previous` to return to the prior page.
4. Riley follows a dog-card link for a dog that interests them.
5. The `/dog/{id}` page presents the dog's name, availability status, breed, age, gender, and description.
6. **Climax:** Riley reaches the complete current information for the selected dog within the existing browse-to-details flow.
7. Riley uses `Back to All Dogs` to return to `/`.

Failure and empty outcomes: a listing/API failure displays its exact current error text while retaining the home introduction; an empty response displays `No dogs available at the moment.`; a missing dog displays `Dog not found` and keeps the back link available.

### Flow 2 — Read about the shelter (Riley)

1. Riley follows `About` in the shared header to `/about`.
2. The page shows the current shelter story and the note that the organization is fictional.
3. **Climax:** Riley finishes the information and sees the existing `Back to Dogs` link, which returns to `/`.
