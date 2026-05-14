# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Apply Pilot
**Updated:** 2026-05-14
**Reference:** https://ai.databyte.co.id (color palette inspiration)
**Category:** SaaS (Job Application Tracker)

---

## Global Rules

### Color Palette (DataByte AI Inspired)

| Role | Light | Dark | CSS Variable |
|------|-------|------|--------------|
| Primary | `#7C3AED` | `#7C3AED` | `--color-primary` |
| Secondary | `#6366F1` | `#6366F1` | `--color-secondary` |
| Accent | `#A855F7` | `#A855F7` | `--color-accent` |
| Background | `#FAFAFE` | `#0A0A0F` | `--color-background` |
| Foreground | `#18181B` | `#FAFAFA` | `--color-foreground` |
| Muted | `#F4F4F5` | `#1A1A2E` | `--color-muted` |
| Muted Text | `#71717A` | `#A1A1AA` | `--color-muted-foreground` |
| Border | `rgba(139,92,246,0.15)` | `rgba(139,92,246,0.2)` | `--color-border` |
| Success | `#22C55E` | `#22C55E` | — |
| Destructive | `#EF4444` | `#EF4444` | `--color-destructive` |

**Color Notes:** Deep purple/violet primary with gradient CTAs. Dark mode uses near-black (#0A0A0F) with purple glow accents — inspired by DataByte AI's dark-first aesthetic.

### Typography

- **Font:** Geist Sans (variable)
- **Mono:** Geist Mono (variable)
- **Mood:** modern, developer-focused, clean, professional

### Style: Glassmorphism + Dark Purple

**Light mode cards:**
- `background: rgba(255, 255, 255, 0.75)`
- `backdrop-filter: blur(16px)`
- `border: 1px solid rgba(139, 92, 246, 0.1)`

**Dark mode cards:**
- `background: rgba(17, 17, 27, 0.7)`
- `backdrop-filter: blur(16px)`
- `border: 1px solid rgba(139, 92, 246, 0.15)`

**CTA Buttons:**
- `background: linear-gradient(to right, #7C3AED, #A855F7)`
- `box-shadow: 0 0 20px rgba(124, 58, 237, 0.3)` (glow effect)

### Spacing & Corners

| Token | Value | Usage |
|-------|-------|-------|
| Card padding | `p-6` | Standard cards |
| Form padding | `p-8` | Form containers |
| Section gap | `gap-6` | Between cards |
| Border radius | `rounded-2xl` (16px) | Cards, modals |
| Input radius | `rounded-xl` (12px) | Inputs, buttons |

### Mesh Gradient Background

```css
background-image:
  radial-gradient(ellipse at 20% 50%, rgba(124, 58, 237, 0.08-0.12), transparent 50%),
  radial-gradient(ellipse at 80% 20%, rgba(168, 85, 247, 0.06-0.08), transparent 50%),
  radial-gradient(ellipse at 50% 80%, rgba(99, 102, 241, 0.06-0.08), transparent 50%);
```

---

## Component Specs

### Buttons

- **Primary:** Purple gradient (`from-primary to-accent`) + glow shadow
- **Secondary:** Glass background + border
- **Destructive:** Red solid
- **Ghost:** Transparent with hover highlight

### Navbar

- Sticky floating: `sticky top-4 mx-4`
- Glass-strong background
- Logo: gradient square icon (purple → violet)
- Theme toggle: sun/moon animated switch

### Status Colors

| Status | Color |
|--------|-------|
| Saved | `zinc-500/10` |
| Applied | `secondary/10` (indigo) |
| Interviewing | `primary/10` (purple) |
| Offer | `green-500/10` |
| Rejected | `destructive/10` |
| Archived | `zinc-500/10` |

---

## Dark Mode

- Toggled via `.dark` class on `<html>`
- Persisted to `localStorage`
- Inline script in `<head>` prevents flash
- System preference used as fallback

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — Use Lucide React SVGs
- ❌ Missing cursor:pointer on interactive elements
- ❌ Layout-shifting hover transforms
- ❌ Low contrast text (< 4.5:1)
- ❌ Instant state changes without transitions
- ❌ Invisible focus states

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (use Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum in both modes
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] Dark mode tested and functional
