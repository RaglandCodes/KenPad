// --- constants / globals---
const paper = document.querySelector('#paper');

let plainText = '';
let styles = [];

// --- DOM functions ---

paper.addEventListener('keydown', e => {
  e.preventDefault();
  handleKeyClick(e.key, window.getSelection().getRangeAt(0).startOffset);

  return;
});

function handleKeyClick(key, caretPosition) {
  // Change text base on new key
  switch (key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'Control':
    case 'Alt':
    case 'Backspace':
    case 'Shift':
    case 'Delete':
    case 'CapsLock':
    case 'Enter':
    case 'Tab':
    case 'Home':
    case 'End':
      console.log('Not writing');

      break;
    default:
      plainText =
        plainText.slice(0, caretPosition) + key + plainText.slice(caretPosition);
      writeToPaper(caretPosition);
  }

  return;
}

function writeToPaper(caretPosition) {
  paper.innerText = plainText;
  //Set new caret postion
  let selection = window.getSelection();

  let newCaret = document.createRange();
  newCaret.selectNode(paper);
  newCaret.setStart(paper.childNodes[0], caretPosition + 1);
  newCaret.setEnd(paper.childNodes[0], caretPosition + 1);

  selection.removeAllRanges();
  selection.addRange(newCaret);

  return;
}

function generateStyledHTML() {
  let sortedStyles = getSortedStyles();

  console.log(`${sortedStyles.length} <== sortedStyles.length`);
  let styledHTML = '';
  for (let i = 0; i < plainText.length; i++) {
    console.log(`${JSON.stringify(sortedStyles[0], null, 2)} <== sortedStyles`);
    while (sortedStyles[0][0] === i) {
      console.log('AA' + i);

      styledHTML += sortedStyles.shift()[1];

      console.log(`${styles.length} <== styles.length`);
    }
    styledHTML += plainText[i];
  }

  return styledHTML;
}

// --- Style functions ---

function getSortedStyles() {
  return styles.sort((a, b) => {
    return a[0] - b[0];
  });
}

function handleBoldClick() {
  let selection = window.getSelection().getRangeAt(0);

  //   console.log(`${selection.startOffset} <= selection.startOffset`);
  //   console.log(`${selection.endOffset} <= selection.endOffset`);
  styles.push([selection.startOffset, '<b>'], [selection.endOffset, '</b>']);
  console.log(`${styles.length} <== styles.length`);
  console.log(`${JSON.stringify(styles, null, 2)} <== styles`);

  console.log(
    `${JSON.stringify(generateStyledHTML(), null, 2)} <== generateStyledHTML()`
  );

  return;
}
