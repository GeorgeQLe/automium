# Excalidraw Convention

This file is the **single authoring source** for the Excalidraw styling convention used across all diagrams in this project. Any script that generates `.excalidraw` files or inline SVG diagrams must follow these rules.

## Excalidraw Files (`.excalidraw`)

- **`roughness: 1`** on all shape elements: rectangles, arrows, lines. This gives the hand-drawn Excalidraw feel.
- **`fontFamily: 2`** (sans-serif) for labels, titles, and headers.
- **`fontFamily: 3`** (monospace) for code tokens, skill names, and technical identifiers.
- **Never use `fontFamily: 1`** (Virgil/handwritten) for any text element.

## HTML SVG Rendering

When rendering Excalidraw-style diagrams as inline SVG in HTML pages:

- Apply an SVG sketch filter to shape elements only, not to text:

```xml
<filter id="sketchy" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" seed="2" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

- Target shapes via CSS selector: `rect, line, polygon { filter: url(#sketchy); }`
- Keep text in standard system fonts: `-apple-system, BlinkMacSystemFont, sans-serif` for labels; `ui-monospace, SFMono-Regular, monospace` for code.
- Do not import handwritten web fonts (Caveat, Virgil, etc.) for SVG or page text.

## Rationale

Handwritten text is hard to read at small sizes and clashes with information-dense layouts like the skill map. Sketchy borders preserve the Excalidraw hand-drawn aesthetic without sacrificing text legibility.

## Reference Implementation

`scripts/generate-skillmap-excalidraw.mjs` is the canonical implementation of this convention. See its `makeRect`, `makeText`, and HTML SVG generation for working examples.
