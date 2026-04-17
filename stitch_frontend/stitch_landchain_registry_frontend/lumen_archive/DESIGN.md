# Design System Specification: The Modern Archive

## 1. Overview & Creative North Star: "The Digital Archivist"
This design system rejects the ephemeral, "neon-and-noise" aesthetic common in Web3. Instead, it draws inspiration from the permanence of land and the gravitas of historical records. The Creative North Star is **The Digital Archivist**: a bridge between the physical weight of real estate and the immutable precision of the blockchain. 

We move away from standard grid-heavy templates toward an **Editorial Experience**. This is achieved through intentional asymmetry—allowing large serif headlines to "overhang" content containers—and high-contrast typography scales. The layout should feel like a high-end architectural journal: spacious, authoritative, and meticulously curated. We prioritize "Digital Parchment" (tactile, warm surfaces) over "Neon Glass" (synthetic, cold transparency).

---

## 2. Colors & Surface Philosophy
The palette is grounded in earth and stone, using Deep Slate and Veridian Green to establish a sense of institutional trust.

### The Palette
*   **Primary (Veridian Green):** `#00322d` — Used for core branding and high-importance actions.
*   **Secondary (Deep Slate/Muted Blue):** `#595f66` — Used for supportive elements and secondary CTAs.
*   **Surface (Warm Grey/Parchment):** `#fcf9f4` — The base "paper" of the archive.
*   **Tertiary (Deep Earth):** `#312b25` — Used for high-contrast accents and grounding typography.

### The "No-Line" Rule
To maintain a premium, editorial feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting on a `surface` background provides enough contrast to indicate a transition without creating visual "clutter" or a "cheap" UI look.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper. 
*   **Layer 0 (Background):** `surface` (`#fcf9f4`)
*   **Layer 1 (Main Content):** `surface-container-low` (`#f6f3ee`)
*   **Layer 2 (Floating/Interactive):** `surface-container-high` (`#ebe8e3`)
Use these shifts to create "nested" depth. An inner container should always be a tier higher or lower than its parent to define its importance.

### The "Glass & Gradient" Rule
While we avoid excessive glassmorphism, use it sparingly for floating navigation or overlays using `surface-variant` with a `backdrop-blur` of 12px-16px. Main CTAs should use a subtle gradient from `primary` (`#00322d`) to `primary-container` (`#004b44`) to add a "soul" and depth that flat color cannot replicate.

---

## 3. Typography: The Archive Mix
The typography is a dialogue between the past (Serif) and the future (Sans-Serif).

*   **Display & Headlines (Newsreader):** This refined serif provides the "Digital Parchment" feel. It is used for property titles, legal headers, and "The Modern Archive" storytelling. Large scales (3.5rem for `display-lg`) convey authority.
*   **Functional Interface (Inter):** This clean sans-serif handles the "Digital" side—blockchain addresses, land coordinates, and utility labels. It ensures maximum legibility in high-density data environments.

**Hierarchy Strategy:** 
Use `headline-lg` (Serif) for the name of a land parcel, paired immediately with a `label-md` (Sans) in all-caps for the blockchain hash. This juxtaposition reinforces the "Land Registry" identity.

---

## 4. Elevation & Depth: Tonal Layering
Traditional box-shadows are often too "heavy" for this system. We achieve lift through **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This 2% shift in color creates a soft, natural lift that mimics light hitting expensive paper.
*   **Ambient Shadows:** For floating elements (Modals, Popovers), use extra-diffused shadows. 
    *   *Value:* `0px 20px 40px rgba(28, 28, 25, 0.06)`
    *   The shadow color must be a tint of `on-surface` (`#1c1c19`), never pure black.
*   **The "Ghost Border" Fallback:** In high-density data tables where boundaries are essential for accessibility, use the `outline-variant` token at **15% opacity**. This creates a "suggestion" of a line rather than a hard structural barrier.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (`#00322d`) with `on-primary` text. Use `rounded-md` (0.375rem). No shadow; use a subtle inset glow on hover.
*   **Secondary:** `surface-container-highest` background with `primary` text. This feels integrated rather than floating.
*   **Tertiary:** Text-only in `primary` with an underline that only appears on hover.

### Inputs & Input Fields
Move away from "boxed" inputs. Use `surface-container-low` as the field background with a `ghost-border` on the bottom edge only. When focused, the bottom border transitions to `primary` at 2px.

### Cards & Lists
**Strict Rule:** No divider lines. Separate list items using `8px` of vertical white space and a 2% background shift on hover. 
*   **Land Registry Card:** A `surface-container-lowest` container. The property title is `title-lg` (Newsreader). The coordinates are `label-sm` (Inter). Use a high-quality thumbnail with a `0.25rem` corner radius.

### Additional Registry Components
*   **The Ledger Item:** A specialized list item for blockchain transactions. Use `surface-container-low` with a `tertiary` left-accent bar (2px) to denote "Recorded" status.
*   **The Provenance Timeline:** A vertical thread using `outline-variant` (at 20% opacity) to connect historical ownership records, using Newsreader for dates to emphasize the passage of time.

---

## 6. Do's and Don'ts

### Do
*   **Use Whitespace as Structure:** Allow elements to breathe. Large margins are a sign of luxury.
*   **Embrace Asymmetry:** Align a headline to the left but push the body text to a 66% width container to create an editorial flow.
*   **Use Subtle Textures:** A 1% grain overlay on the `surface` color can enhance the "Modern Archive" feel.

### Don't
*   **No High-Contrast Borders:** Never use 100% opaque `outline` for containers. It breaks the "Parchment" illusion.
*   **No "Vibecoded" Elements:** Avoid glowing greens, radical blurs, or pulsing animations. Interaction should be "stately"—fast, but smooth and deliberate.
*   **No Standard Grids:** Avoid the "3-column card row" default. Try overlapping a 2nd column image over a 1st column text block.

---
*Director's Note: Every pixel should feel like it was placed by a curator. If the layout feels like a generic dashboard, add more white space and check your typography scales.*