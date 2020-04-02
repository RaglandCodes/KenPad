// --- constants / globals---
const paper = document.querySelector('#paper');

// --- functions ---

const specialKeys = [
  '*',
  '_',
  '#',
  '+',
  'Control',
  'Enter',
  'Shift',
  'Backspace',
  ' ',
  'Alt'
];
let i = 0;
paper.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    //e.preventDefault();
  }
  if (specialKeys.indexOf(e.key) >= 0) {
    console.log('special key');
  }

  i += 1;
  if (i % 11 === 0) {
    console.log(`${paper.innerHTML} <== paper.innerHTML`);
  }
});
