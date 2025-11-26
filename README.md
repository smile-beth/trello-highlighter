# Trello Highlighter

Trello Highlighter is a Chrome extension that automatically highlights numbers in Trello card titles and helps you quickly understand the total points within each list (column).

- Numbers in parentheses ( ) are treated as Estimate points and shown in light blue
- Numbers in brackets [ ] are treated as Actual points and shown in blue
- The running totals of Estimate/Actual points are calculated per list and stored in the tooltip (title) of each highlighted element
- Watches Trello’s dynamic UI changes and keeps up with new cards and reordering

Target domain: trello.com


## How it works (overview)
The content script at `src/content.js` scans Trello board pages, extracts numbers from card titles, and decorates them.

- Estimate: numbers wrapped in parentheses, e.g. `(12)`
- Actual: numbers wrapped in brackets, e.g. `[8.5]`
- Regex: Estimate `/\(([0-9.?]+)\)/g`, Actual `/\[([0-9.?]+)\]/g`
  - Notation with decimals or `?` is also captured (e.g. `(3?)`).
- Totals are calculated per list, and the running total at that point is stored in the `title` attribute of the highlight span element on each card.
- Uses a MutationObserver with a 300ms debounce to follow DOM changes.

Styles are defined in `src/style.scss` and bundled by Parcel as `dist/content.css`.


## Installation (load unpacked in developer mode)
1. Install Node.js and npm.
2. Clone this repository.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
   - This generates/places `content.js`, `content.css`, and `manifest.json` under `dist/`.
5. Open Chrome and go to `chrome://extensions/`.
6. Turn on Developer mode in the top-right corner.
7. Click “Load unpacked” and select the `dist` directory of this project.
8. Open Trello and confirm that highlighting is active on the board view.


## Usage
- Include numbers in card titles in the following formats to highlight them automatically:
  - Estimate: `(5)` / `(2.5)` / `(3?)`, etc.
  - Actual: `[3]` / `[1.5]` / `[0.5?]`, etc.
- Cards in a list are processed from top to bottom to compute the totals. Hover over the highlighted part to see the running total up to that point in a tooltip.
- Automatically follows board operations such as adding, moving, or reordering cards.


## Build / Scripts
Key scripts in `package.json`:
- `npm run build:js` — Build `src/*.js` with Parcel and output to `dist` (no source maps, no content hash)
- `npm run cp:manifest` — Copy `src/manifest.json` to `dist/`
- `npm run build` — Run the two tasks above in sequence

Tooling:
- Parcel 2
- Sass transform (`@parcel/transformer-sass`)


## Known limitations and notes
- The target is Trello’s official web UI on the trello.com domain.
- Totals are calculated as a running sum from the top of the list; they depend on card order.
- The totals are stored in the `title` attribute of each card’s highlight element (there is no UI shown in the column header in this version).
- Behavior may change if Trello updates its UI.


## Development
- Source code lives in `src/`, build artifacts go to `dist/`.
- Run `npm run dev` and reload the extension manually.


## License
- License: ISC


## Links / Support
- Repository: https://github.com/smile-beth/trello-highlighter
- Issues: https://github.com/smile-beth/trello-highlighter/issues

Please open an issue for bug reports and feature requests.