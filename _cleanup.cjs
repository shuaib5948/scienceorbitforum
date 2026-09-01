const fs = require('fs');
const f = 'c:/Users/shuai/Desktop/scienceorbitforum/src/styles/components-ui.css';
let text = fs.readFileSync(f, 'utf8');
const lines = text.split('\n');

// Remove the pillars + quote blocks (lines 409..569, 1-based).
const blockStart = 409;
const blockEnd = 569;
lines.splice(blockStart - 1, blockEnd - blockStart + 1);

// Replace the responsive media block (now at different index) referencing
// statement-pillars & statement-related with one that only targets related.
const idx = lines.findIndex((l) => l.includes('.statement-pillars,'));
if (idx !== -1) {
  // The media block spans from the '@media' comment line above idx up to the '}' after.
  // Rebuild from the '/* Responsive' comment.
  let commentIdx = idx;
  for (let i = idx; i >= 0; i--) {
    if (lines[i].includes('Responsive')) { commentIdx = i; break; }
  }
  // find closing brace from idx
  let endIdx = idx;
  for (let i = idx; i < lines.length; i++) {
    if (lines[i] === '}') { endIdx = i; break; }
  }
  const mediaBlock = [
    '/* Responsive — related cards stack on mobile */',
    '@media (max-width: 768px) {',
    '  .statement-related {',
    '    grid-template-columns: 1fr;',
    '    gap: var(--space-5);',
    '  }',
    '}',
  ];
  lines.splice(commentIdx, endIdx - commentIdx + 1, ...mediaBlock);
}

fs.writeFileSync(f, lines.join('\n'));
console.log('done');