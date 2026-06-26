# Visualization Design Standards

## Color Palette (Pastel Theme)

| Role | Color | Hex |
|---|---|---|
| Page Background | Light cream | `#fdf6f0` |
| Card Background | White | `#ffffff` |
| Primary Accent | Pastel blue | `#a8d8ea` |
| Secondary Accent | Pastel purple | `#aa96da` |
| Success / Complete | Pastel green | `#b5ead7` |
| Active / Current | Pastel orange | `#ffd3b6` |
| Error / Removed | Pastel red | `#ff9aa2` |
| Highlight | Pastel yellow | `#ffffd8` |
| Text Primary | Dark charcoal | `#2d3436` |
| Text Secondary | Medium gray | `#636e72` |
| Border / Divider | Light gray | `#dfe6e9` |
| Code Background | Soft lavender | `#f0eef6` |

## Typography

- **Font stack**: `'Segoe UI', system-ui, -apple-system, sans-serif`
- **Monospace**: `'SF Mono', 'Fira Code', 'Consolas', monospace`
- **Headings**: Bold, `#2d3436`
- **Body text**: Regular, `#2d3436`, line-height `1.6`
- **Code snippets**: 13px, `#636e72`, background `#f0eef6`, padding `2px 6px`, border-radius `4px`

## Layout Structure

```
body
  container (max-width: 900px, margin: 0 auto, padding: 40px 20px)
    header        — Problem title + metadata + topic tags
    overview      — Problem summary card
    approach[]    — One section per approach with diagram + complexity
    comparison    — Approach comparison table
    resources     — External links
```

## Component Styles

### Cards
- `background: #ffffff`
- `border: 1px solid #dfe6e9`
- `border-radius: 12px`
- `padding: 24px`
- `margin-bottom: 20px`
- `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`

### Tags / Badges
- `background: #a8d8ea` (default), varies by category
- `color: #2d3436`
- `padding: 4px 12px`
- `border-radius: 16px`
- `font-size: 13px`
- `display: inline-block`, `margin: 2px 4px`

### Comparison Tables
- Header row: `background: #a8d8ea`, bold
- Alternate rows: `#ffffff` and `#fdf6f0`
- `border-collapse: collapse`
- Cell padding: `12px 16px`
- `border: 1px solid #dfe6e9`

### Diagram Boxes (Algorithm Steps)
- Rectangle: `background: #ffffff`, `border: 2px solid #a8d8ea`, `border-radius: 8px`
- Active/highlighted step: `background: #ffd3b6`, `border-color: #ff9aa2`
- Completed step: `background: #b5ead7`, `border-color: #b5ead7`
- Arrow between steps: `#aa96da`, 2px solid

### Code Blocks
- `background: #f0eef6`
- `border-left: 4px solid #aa96da`
- `padding: 16px 20px`
- `border-radius: 0 8px 8px 0`
- Monospace font, 14px

## Visualization Diagrams

Use **inline SVG** or **CSS-based diagrams** (no external dependencies). Diagrams should:

1. Use the pastel palette for all fills and strokes
2. Include labeled elements (array indices, pointer names, etc.)
3. Show step-by-step state with arrows or numbered stages
4. Use `font-family: 'Segoe UI', system-ui, sans-serif` inside SVGs

### Array Visualization
```css
.array-container { display: flex; gap: 4px; margin: 16px 0; }
.array-cell {
  width: 48px; height: 48px;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #a8d8ea; border-radius: 8px;
  font-family: 'SF Mono', monospace; font-size: 14px;
  background: #ffffff; color: #2d3436;
}
.array-cell.active { background: #ffd3b6; border-color: #ff9aa2; }
.array-cell.found { background: #b5ead7; border-color: #b5ead7; }
.array-cell.swapped { background: #aa96da; color: #fff; }
```

### Linked List Visualization
```css
.node {
  display: inline-flex; align-items: center;
  background: #ffffff; border: 2px solid #a8d8ea;
  border-radius: 8px; padding: 8px 16px;
  font-family: 'SF Mono', monospace;
}
.node.active { background: #ffd3b6; border-color: #ff9aa2; }
.node.visited { background: #b5ead7; border-color: #b5ead7; }
.arrow { color: #aa96da; font-size: 20px; margin: 0 4px; }
```

### Tree Visualization
```css
.tree-node {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px;
  border: 2px solid #a8d8ea; border-radius: 50%;
  background: #ffffff; font-family: 'SF Mono', monospace;
}
.tree-node.active { background: #ffd3b6; }
.tree-edge { stroke: #aa96da; stroke-width: 2px; }
```

## Responsiveness

- Container: `max-width: 900px` with `padding: 0 20px`
- Tables: `overflow-x: auto` wrapper for mobile
- Diagrams: Use `%` or `max-width` sizing, not fixed px
- Font sizes: `16px` body, `14px` code, scale down headings on mobile

## Links & Resources Section

Each visualization must include a resources section with:
- LeetCode problem link
- NeetCode video (if available)
- Wikipedia / GeeksforGeeks reference for the data structure or algorithm concept
- Related problems in this repository (using relative paths)

## File Naming

- Visualization file: `visualization.html` (one per problem directory)
- Self-contained: all CSS inline or in `<style>` tags, no external dependencies
- Valid HTML5, UTF-8 encoding
