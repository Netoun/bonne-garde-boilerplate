# Design System — Bonne Garde

## 1. Visual Theme & Atmosphere

Bonne Garde's visual language is **cozy cartographic** — the feeling of unfolding a hand-drawn treasure map in a warm room. The interface is inviting without being childish, editorial without being cold. It borrows the roundness and breathing room of Welcome to the Jungle and pairs it with a palette of periwinkle, terracotta, and sage: colours that feel adventurous but never aggressive.

The typographic system creates a deliberate contrast between body and headings. Urbanist — a geometric sans-serif — handles all body text with clean legibility and a slightly playful weight. Faustina — a variable serif — anchors all headings with editorial character, reinforcing the "map legend" and "field journal" metaphors that run through the product. The combination reads as modern-adventurous: you are an explorer, but a well-equipped one.

Corners are generous everywhere. The design does not tolerate sharp edges. This is not softness for softness's sake: rounded surfaces on a map-like interface feel like geographic forms — like hills and islands, not clinical rectangles.

Motion is springy and physical. Buttons scale on press, cards lift on hover, overlays scale into existence. The spring physics feel like picking up a physical object — there is a slight overshoot, a sense of weight. This physicality reinforces the treasure hunt metaphor: every interaction feels like touching something real.

**Key characteristics:**

- Periwinkle primary, terracotta secondary, sage tertiary — adventurous but grounded
- Generous rounded corners throughout — nothing sharp
- Faustina serif headings + Urbanist sans body — editorial cartographic voice
- Spring-physics micro-interactions on all interactive surfaces
- Soft diffused shadows — elevation through blur, not hard lines
- Full dark mode — all tokens invert automatically, no exceptions

---

## 2. Color Palette & Roles

### Backgrounds & Surfaces

- **Background**: Main page surface. Near-white with a faint violet undertone in light mode; deep desaturated indigo in dark mode. Never pure white or pure black.
- **Card**: Slightly elevated surface — used for cards, panels, form sections. Marginally lighter than background in light mode.
- **Popover**: Floating surface for dropdowns, tooltips, menus. The lightest surface in the stack.

### Brand Colours

- **Primary — Periwinkle**: A calm, slightly cool blue-violet. Used for primary CTAs, active states, selected items, progress. The dominant interactive colour.
- **Secondary — Terracotta**: Warm reddish-orange. Used for secondary CTAs, badges indicating energy or action (e.g. "live game"). Conveys warmth without urgency.
- **Tertiary — Sage**: Muted green. Used for success states, "found" badges, resolved statuses. Calming and conclusive.

### Neutral & Utility

- **Muted**: Warm mid-gray background for de-emphasised areas — empty states, disabled zones, helper sections. Paired with a subdued muted text colour.
- **Accent**: Pale gold. Used as hover background on ghost and navigation elements, never as a standalone decorative colour.
- **Foreground**: Primary body text — near-black in light mode, near-white in dark mode. Slightly warmer than pure black to reduce harshness.

### Semantic

- **Destructive**: Brick red. Delete confirmations, error states, irreversible actions. Never used decoratively.
- **Border**: Default outline for cards and dividers. Subtle — exists to structure, not to decorate.

### Sidebar

The sidebar has its own parallel colour set with slightly adjusted values suited to its narrower, navigational context. Conceptually it mirrors the main palette but reads slightly cooler and more recessed.

---

## 3. Typography

### Typefaces

- **Urbanist** (geometric sans-serif): Body text, labels, buttons, inputs, all UI copy. Rendered at a slightly heavier weight than typical body text, giving the interface a quiet confidence.
- **Faustina** (transitional serif): Headings only — h1 through h6. The serif voice carries the editorial, cartographic register. It feels like a title on a map or chapter opener in a field guide.

The contrast between these two typefaces does most of the hierarchy work. A Faustina heading above Urbanist body text creates a clear shift in register without needing dramatic size differences.

### Principles

- **Headings track tight**: Faustina headings always use negative letter-spacing. This creates a compressed, engraved quality — like text stamped into a map. Never widen heading tracking.
- **Weight restraint**: Body text lives at medium. Headings at semibold. Bold is used sparingly for critical emphasis. Avoid light weights — they undermine the cozy, grounded feel.
- **No wide tracking anywhere**: Loose letter-spacing is not part of this aesthetic at any size.

---

## 4. Shape & Radius

Rounded corners are a core part of the identity. The scale moves from small (chips and inline tags) to large (hero panels), with a comfortable middle value as the default for most interactive surfaces. Pills — fully rounded — are used for badges, avatars, and status indicators.

Nothing in this interface uses sharp corners except as a deliberate semantic signal (e.g. a data table cell). When in doubt, round more, not less.

---

## 5. Shadows & Elevation

Shadows are soft and diffused — they suggest lift, not drama. The effect is closer to placing an object on a desk under ambient light than to spotlighting it.

| Level       | Character               | Use                              |
| ----------- | ----------------------- | -------------------------------- |
| Hairline    | 1px, barely perceptible | Chips, inline tags               |
| Resting     | 1–3px, gentle           | Cards at rest, default elevation |
| Comfortable | 4–6px                   | Interactive cards, dropdowns     |
| Raised      | 6–12px                  | Modals, command palettes, toasts |
| Hovering    | 10–25px, wide           | Hover state, active modals       |
| Floating    | 20–40px, airy           | Sheets, overlays                 |

The typical card animation moves from its resting shadow to the hovering shadow, combined with a 2px upward lift — the impression of physically picking the card up off the surface.

---

## 6. Components

### Buttons

Six visual variants express the full range of action weight:

- **Default** (periwinkle fill): Primary action. One per view.
- **Outline**: Secondary action. Same weight as default but less dominant.
- **Secondary** (terracotta fill): Alternative primary — used when the primary action has a warm/energetic quality.
- **Ghost**: Tertiary action, navigation, or dense UI contexts. No background until hover.
- **Destructive** (brick red fill): Irreversible or dangerous actions only.
- **Link**: Inline actions, "learn more" style interactions.

Buttons come in four sizes (extra-small to large) plus dedicated icon-only sizes. All interactive buttons have a physical press feel — a slight scale-down on tap, scale-up on hover.

### Badges

Six variants mirror the colour palette: default (periwinkle), secondary (terracotta), tertiary (sage), outline, ghost, and destructive. Always pill-shaped. Used for statuses, counts, and labels — not for navigation. Subtle hover and press scale animation built in.

### Cards

The primary content container. Cards rest with a gentle shadow, lift on hover with a spring animation. Corners are large — featured cards rounder than standard ones. Card surfaces are slightly lighter than the page background to create natural layering.

### Empty States

Dedicated component for zero-data views. Always present an illustration, a clear heading in Faustina, and a primary action. Never leave a blank surface without guidance.

### Entity Cards

Specialised card for domain objects (scenario, game, team, puzzle). Consistent structure: status badge top-right, Faustina title, Urbanist metadata, action row at bottom.

---

## 7. Motion & Animation

### Philosophy

Motion reinforces the physical metaphor. Every interaction should feel like touching an object that has weight and spring. Nothing snaps instantly; nothing lingers. The default rhythm is a soft spring — a slight overshoot that settles naturally.

### Interaction States

- **Hover**: Cards lift slightly upward with shadow expansion. Buttons grow very slightly.
- **Press / tap**: Elements shrink slightly to simulate physical depression.
- **Focus**: A periwinkle ring (matching primary) appears with a small offset. Never hidden.
- **Disabled**: No animation. Static, reduced opacity.

### Entrance Animations

Elements appearing on screen should fade and slide up from just below their resting position, or scale in from slightly smaller with a soft spring. Lists and grids stagger their children with a small delay — fast enough to feel sequential, not slow enough to feel theatrical.

### Exit Animations

Departing elements fade and scale down slightly. Exits are fast — they should not make the user wait.

### Decorative Animations

Certain illustrative or ambient elements use looping CSS animations: a gentle vertical float (6s, continuous) for map pins and hero illustrations, a subtle opacity pulse (2s) for live/active indicators.

---

## 8. Do's and Don'ts

### Do

- Use the periwinkle/terracotta/sage palette to communicate hierarchy of actions — primary, secondary, status
- Let Faustina headings do the editorial heavy lifting — trust the serif to create register shifts
- Round everything — default to more radius, not less
- Use the spring-physics press feel on every interactive surface — it is the kinetic signature of the product
- Use terracotta for live/active game states and sage for completed/found states — these are semantic associations
- Lift cards on hover — the slight rise with expanding shadow is the standard interaction pattern for all card surfaces
- Keep shadows soft and wide — elevation through blur, not hard offsets

### Don't

- Don't use sharp corners on interactive elements — it breaks the aesthetic contract
- Don't use the destructive colour for anything other than irreversible/dangerous actions
- Don't widen letter-spacing on Faustina headings — tight tracking is essential to its voice
- Don't mix button variants to express visual hierarchy — use size differences instead
- Don't use light weights in body text — the cozy feel depends on medium-weight Urbanist
- Don't use large shadows at rest — reserve `floating` shadows for overlays and sheets only
- Don't animate disabled states — they are inert by definition
- Don't leave empty states as blank surfaces — always provide an illustration, a heading, and a clear next action

---

## 9. Agent Prompt Guide

When generating UI for Bonne Garde, apply these rules without exception:

**Colours**: Lead with periwinkle for the primary action on any screen. Use terracotta for secondary or energetic actions. Use sage for success and completion states. Use muted surfaces and subdued text for everything secondary. Destructive (brick red) only for delete or irreversible actions.

**Typography**: Every heading in Faustina, semibold, tight tracking. All body copy, labels, and UI text in Urbanist, medium weight. The serif/sans split is the primary voice contrast — don't blur it.

**Shape**: Large rounded corners on cards and interactive surfaces. Pills for badges and avatars. Never sharp corners.

**Motion**: Every interactive card lifts on hover with shadow expansion. Every button shrinks on press and grows on hover. Entering elements fade and slide in or scale in with a soft spring. Exits are quick fades.

**Shadows**: Cards at rest use a gentle shadow. On hover they use a larger, more diffused shadow. Modals and overlays use the largest shadow level. Nothing uses a hard, tight shadow.

**Hierarchy**: One primary action per view (periwinkle). Secondary actions in outline or ghost. Status badges use the colour semantics: sage = done, terracotta = active, muted = neutral.

**Example — Game card**: Large rounded corners, gentle resting shadow that expands on hover with a slight lift. Faustina title, Urbanist metadata in subdued text, a terracotta "live" badge if the game is active or sage "completed" badge if finished. Primary action button at the bottom.

**Example — Page heading**: Faustina, large, semibold, tight tracking. One line of Urbanist body text below as a subtitle in muted colour. Both left-aligned. Entrance: slide up from below with a soft spring.

**Example — Empty state**: Centered illustration, Faustina heading ("No games yet"), short Urbanist explanation in muted colour, a single primary periwinkle button to create the first item.
