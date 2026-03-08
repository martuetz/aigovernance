# humAIne Design System — Vibecoding Reference

Use this document as a baseline when generating UI code (React, HTML/CSS, Tailwind, etc.) for humAIne products. Feed it into your AI coding tool or LLM prompt to ensure brand consistency.

---

## Brand Identity

humAIne is a cybersecurity and AI company. The brand conveys **clarity, trust, and technological sophistication**. The "AI" in humAIne is intentionally capitalized to emphasize the fusion of human intelligence and artificial intelligence. The brain icon in the logo represents this concept visually.

---

## Color System

### Primary Palette

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--default-primary` | `#1418FF` | 20, 24, 255 | CTAs, buttons, active states, key accents. Use sparingly for high-impact elements. |
| `--default-secondary` | `#B4B6B4` | 180, 182, 180 | Borders, dividers, meta text, subtle accents, supporting elements. |
| `--default-accent` | `#B0C3E1` | 176, 195, 225 | Card backgrounds, highlights, light accent areas, hover states. |
| `--default-foreground` | `#023596` | 2, 53, 150 | Dark text on light backgrounds, headings, navigation labels. |
| `--default-background` | `#EDEBE1` | 237, 235, 225 | Page backgrounds, section backgrounds, large surface areas. |

### Utility Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--near-black` | `#131313` | Primary body text, footer text, headings on light backgrounds. |
| `--white` | `#FFFFFF` | Backgrounds, text on dark surfaces, card surfaces. |
| `--light-grey` | `#F5F5F0` | Section backgrounds, card surfaces, subtle separation. |
| `--mid-grey` | `#7A7A7A` | Captions, meta text, placeholder content, secondary labels. |

### Color Weights (Approximate Distribution)

- Background cream `#EDEBE1`: **35%** — Dominates large surfaces
- White `#FFFFFF`: **20%** — Cards, content areas
- Primary blue `#1418FF`: **15%** — Accents, CTAs, interactive elements
- Accent blue `#B0C3E1`: **10%** — Highlights, hover states
- Foreground blue `#023596`: **8%** — Headings, navigation
- Secondary grey `#B4B6B4`: **7%** — Borders, dividers
- Near black `#131313`: **5%** — Text, icons

### Color Combination Rules

**Preferred combinations:**
- Blue backgrounds → white text, cream text
- Light/cream backgrounds → foreground blue text, primary blue accents, near-black text
- Dark backgrounds → white text, primary blue accents, accent blue elements

**Avoid:**
- Red and green combinations (use brand blues and greys instead)
- Colors with similar saturation/luminosity side by side
- Primary blue for large surface areas (reserve for accents)
- Accent blue text on white backgrounds (insufficient contrast)

### Accessibility Requirements

- WCAG AA Normal: 4.5:1 minimum contrast ratio
- WCAG AA Large: 3:1 minimum contrast ratio
- WCAG AAA Normal: 7:1 minimum contrast ratio (target for body text)

---

## Typography

### Font Stack

```css
--font-heading: "Montserrat", system-ui, -apple-system, sans-serif;
--font-body: "Roboto", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;
```

**Google Fonts import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Roboto:wght@400;500;600;700&display=swap');
```

### Font Scale — Minor Third (1.2)

| Token | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `--text-5xl` | 2.986rem (48px) | 1.1 | Hero headlines, major feature callouts |
| `--text-4xl` | 2.488rem (40px) | 1.1 | Page titles, primary headings |
| `--text-3xl` | 2.074rem (33px) | 1.1 | Section headings |
| `--text-2xl` | 1.728rem (28px) | 1.1 | Sub-section headings |
| `--text-xl` | 1.44rem (23px) | 1.3 | Card titles, large labels |
| `--text-lg` | 1.2rem (19px) | 1.5 | Intro copy, emphasized body text |
| `--text-base` | 1rem (16px) | 1.5 | Default body copy |
| `--text-sm` | 0.833rem (13px) | 1.4 | Captions, meta text, small labels |
| `--text-xs` | 0.694rem (11px) | 1.3 | Fine print, footnotes, disclaimers |

### Typography Rules

- **Headings (H1–H3):** Montserrat Bold or SemiBold, 1.1x line spacing
- **Body copy:** Roboto Regular, 1.4–1.5x line spacing
- **Intro/lead text:** Roboto Medium, slightly larger than body
- **Menu items:** Montserrat Medium, uppercase for primary navigation
- **Buttons/CTAs:** Montserrat SemiBold, uppercase, with arrow icon (→)
- **Links:** Primary blue `#1418FF`, underlined
- **Headings on light backgrounds:** Use foreground blue `#023596` or near-black `#131313`
- **Headings on dark backgrounds:** Use white `#FFFFFF`

### Fallback Fonts

If Montserrat/Roboto are unavailable (email, Google Workspace): use Arial/Helvetica for headings, and system default for body. Times New Roman as serif alternative.

---

## Layout & Spacing

### Grid System

- Base unit: **8px**
- Content max-width: **1200px** (centered)
- Column gutters: **24px** (3 × 8px)
- Section padding: **64px** vertical, **32px** horizontal
- Card padding: **24px**

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight gaps, inline elements |
| `--space-2` | 8px | Between related elements |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Default component gap |
| `--space-5` | 24px | Card padding, section gaps |
| `--space-6` | 32px | Between sections |
| `--space-8` | 48px | Major section breaks |
| `--space-10` | 64px | Page section padding |

### Layout Principles

1. **Linear & Clean:** Use straight lines and clear structure. Clean edges and consistent spacing create a professional feel.
2. **Rounded Details:** Buttons, cards, and interactive elements use rounded corners for approachability, contrasting with the overall linear structure.
3. **Consistent Spacing:** Always use the 8px grid system. Larger sections have clear separation.
4. **Color Blocking:** Large surfaces use background cream or white. Primary blue is reserved for accents, CTAs, and key visual elements.

---

## Components

### Buttons

```css
/* Primary CTA */
.btn-primary {
  background: #1418FF;
  color: #FFFFFF;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 0.833rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px 28px;
  border-radius: 999px;  /* Fully rounded / pill shape */
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* Always include arrow icon */
.btn-primary::after {
  content: "→";
}

/* Hover: transition to near-black */
.btn-primary:hover {
  background: #131313;
}

/* Secondary / Outline CTA */
.btn-secondary {
  background: transparent;
  color: #1418FF;
  border: 2px solid #1418FF;
  border-radius: 999px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  font-size: 0.833rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 26px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary::after {
  content: "→";
}

/* Dark CTA */
.btn-dark {
  background: #131313;
  color: #FFFFFF;
  /* Same structure as primary */
}
```

### Cards

```css
.card {
  background: #F8F9FE;
  border: 1px solid #E8ECF5;
  border-radius: 8px;
  padding: 24px;
  position: relative;
}

/* Optional: left accent bar */
.card--accent {
  border-left: 3px solid #1418FF;
}

/* Card on cream background */
.card--on-cream {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
}
```

### Navigation

```css
.nav-item {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 0.833rem;
  text-transform: uppercase;
  color: #131313;
  text-decoration: none;
  padding: 8px 0;
}

.nav-item--active {
  color: #131313;
  border-bottom: 2px solid #131313;
}
```

### Icons

- Use **line-style** icons (outlined, not filled) as the default
- Icons sit inside **circular containers** (filled or outlined)
- Filled icon circles: primary blue `#1418FF` or near-black `#131313` background, white icon
- Outlined icon circles: primary blue stroke, primary blue icon
- Arrow icons (→, ←) always accompany buttons and CTAs
- Recommended icon libraries: Lucide, Heroicons, Phosphor (line variants)

### Form Inputs

```css
.input {
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  color: #131313;
  background: #FFFFFF;
  border: 1px solid #B4B6B4;
  border-radius: 6px;
  padding: 10px 14px;
}

.input:focus {
  border-color: #1418FF;
  outline: none;
  box-shadow: 0 0 0 3px rgba(20, 24, 255, 0.1);
}

.input::placeholder {
  color: #7A7A7A;
}

.label {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 0.833rem;
  color: #023596;
  margin-bottom: 6px;
}
```

### Tables

```css
.table th {
  background: #1418FF;
  color: #FFFFFF;
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  font-size: 0.833rem;
  padding: 8px 12px;
  text-align: left;
}

.table td {
  font-family: "Roboto", sans-serif;
  font-size: 0.833rem;
  color: #131313;
  padding: 8px 12px;
  border-bottom: 1px solid #E8ECF5;
}

.table tr:nth-child(even) {
  background: #F5F5FF;
}
```

---

## CSS Variables (Complete Reference)

```css
:root {
  /* Fonts */
  --font-montserrat: "Montserrat", system-ui, sans-serif;
  --font-roboto: "Roboto", system-ui, sans-serif;

  /* Font Scale: Minor Third (1.2) */
  --text-xs:   0.694rem;    /* 11px */
  --text-sm:   0.833rem;    /* 13px */
  --text-base: 1rem;        /* 16px */
  --text-lg:   1.2rem;      /* 19px */
  --text-xl:   1.44rem;     /* 23px */
  --text-2xl:  1.728rem;    /* 28px */
  --text-3xl:  2.074rem;    /* 33px */
  --text-4xl:  2.488rem;    /* 40px */
  --text-5xl:  2.986rem;    /* 48px */

  /* Colors */
  --color-primary:    #1418FF;
  --color-secondary:  #B4B6B4;
  --color-accent:     #B0C3E1;
  --color-foreground: #023596;
  --color-background: #EDEBE1;
  --color-near-black: #131313;
  --color-white:      #FFFFFF;
  --color-light-grey: #F5F5F0;
  --color-mid-grey:   #7A7A7A;

  /* Spacing (8px base) */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.5rem;   /* 24px */
  --space-6:  2rem;     /* 32px */
  --space-8:  3rem;     /* 48px */
  --space-10: 4rem;     /* 64px */

  /* Border Radius */
  --radius-sm:   4px;
  --radius-md:   6px;
  --radius-lg:   8px;
  --radius-xl:   12px;
  --radius-full: 999px;

  /* Shadows */
  --shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md:  0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg:  0 10px 15px rgba(0, 0, 0, 0.1);
}
```

---

## Tailwind CSS Configuration

If using Tailwind, extend your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary:    '#1418FF',
        secondary:  '#B4B6B4',
        accent:     '#B0C3E1',
        foreground: '#023596',
        background: '#EDEBE1',
        'near-black': '#131313',
        'light-grey': '#F5F5F0',
        'mid-grey':   '#7A7A7A',
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body:    ['Roboto', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs':   ['0.694rem', { lineHeight: '1.3' }],
        'sm':   ['0.833rem', { lineHeight: '1.4' }],
        'base': ['1rem',     { lineHeight: '1.5' }],
        'lg':   ['1.2rem',   { lineHeight: '1.5' }],
        'xl':   ['1.44rem',  { lineHeight: '1.3' }],
        '2xl':  ['1.728rem', { lineHeight: '1.1' }],
        '3xl':  ['2.074rem', { lineHeight: '1.1' }],
        '4xl':  ['2.488rem', { lineHeight: '1.1' }],
        '5xl':  ['2.986rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        DEFAULT: '6px',
        'lg': '8px',
        'xl': '12px',
        'pill': '999px',
      },
    },
  },
}
```

---

## Do's and Don'ts

### Do
- Use the 8px grid for all spacing decisions
- Apply primary blue sparingly — only for CTAs, active states, and key accents
- Let background cream dominate large surfaces
- Include arrow icons (→) on all buttons and CTAs
- Use Montserrat for headings, Roboto for body text
- Maintain consistent border-radius (rounded for interactive elements, subtle for containers)
- Ensure WCAG AA contrast minimums on all text

### Don't
- Don't use primary blue as a background for large areas
- Don't mix more than 3 colors in a single component
- Don't use red/green color combinations
- Don't use serif fonts for UI elements
- Don't skip the arrow icon on buttons
- Don't use square corners on buttons (always pill-shaped)
- Don't place light grey text on cream backgrounds (insufficient contrast)
- Don't alter the logo in any way — no rotation, shadows, color changes, or distortion

---

## Logo Usage Quick Reference

- **Primary logo:** Horizontal brain icon + "humAIne" text
- **On white/light backgrounds:** Use dark version
- **On blue/dark backgrounds:** Use light/white version
- **Minimum clear space:** Height of the lowercase "h" on all sides
- **Never:** Rotate, add effects, distort, change colors, crop, or rearrange elements

---

*humAIne GmbH, 2026. Version 1.0.*
