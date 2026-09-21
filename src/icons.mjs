// Inline SVG icons for design "Mono". Square line caps, 16 px grid, colour inherited from the text.
// Used by scripts/build.mjs ({{icoRight}} … in src/layout.html) and by src/pages/content.mjs.
// No icon font and no third-party request.

const line = (d) => `<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${d}" /></svg>`;

export const ICON = {
  right: line('M2 8h11M8.5 3.5 13 8l-4.5 4.5'),
  left: line('M14 8H3M7.5 3.5 3 8l4.5 4.5'),
  down: line('M8 2v11M3.5 8.5 8 13l4.5-4.5'),
  up: line('M8 14V3M3.5 7.5 8 3l4.5 4.5'),
  upRight: line('M4 12 12 4M5.5 4H12v6.5'),
  close: line('M3.5 3.5l9 9M12.5 3.5l-9 9'),
  // half-filled circle = light/dark switch
  theme: '<svg class="ico" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><circle cx="8" cy="8" r="5.75" /><path class="ico-fill" d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" /></svg>',
};
