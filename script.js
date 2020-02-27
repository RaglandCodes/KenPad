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

function resetPaper(innerHTMLString) {
  paper.innerHTML = innerHTMLString;
}
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
  let styledHTML = '';
  let stylesLength = styles.length;
  let stylesCounter = -1;
  if (stylesLength) {
    stylesCounter = 0;
  }
  for (let i = 0; i < plainText.length; i++) {
    if (stylesCounter >= 0) {
      while (styles[stylesCounter][0] === i) {
        styledHTML += styles[stylesCounter][1];
        stylesCounter += 1;
        if (stylesLength === stylesCounter) {
          stylesCounter = -1;
          break;
        }
      }
    }

    styledHTML += plainText[i];
  }
  return styledHTML;
}

// --- Style functions ---

function sortStyles() {
  styles.sort((a, b) => {
    return a[0] - b[0];
  });
}

function handleStyleClick(style) {
  // TODO, check if something is actually selected
  // TODO if nothing is selected, toggle bold

  let selection = window.getSelection().getRangeAt(0);
  let selectionLength = selection.endOffset - selection.startOffset;

  let preCaretRange = selection.cloneRange();
  preCaretRange.selectNodeContents(paper);
  preCaretRange.setEnd(selection.endContainer, selection.endOffset);

  selectionEnd = preCaretRange.toString().length;
  selectionStart = selectionEnd - selectionLength;

  if (style === 'bold') {
    styles.push([selectionStart, '<b>'], [selectionEnd, '</b>']);
  } else if (style === 'italics') {
    styles.push([selectionStart, '<i>'], [selectionEnd, '</i>']);
  } else if (style === 'underline') {
    styles.push([selectionStart, '<u>'], [selectionEnd, '</u>']);
  }

  //TODO insert properly and don't sort each time.

  sortStyles();

  resetPaper(generateStyledHTML());

  return;
}
