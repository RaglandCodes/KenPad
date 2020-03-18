// --- constants / globals---
const paper = document.querySelector('#paper');
const ppaper = document.querySelector('#ppaper');

let plainText = '';
let styles = [];

// --- DOM functions ---

paper.addEventListener('keydown', e => {
  e.preventDefault();
  handleKeyClick(e.key, getCaretPosition());

  return;
});

function checkIfStyled() {}

function getCaretPosition() {
  var range = window.getSelection().getRangeAt(0);
  var selected = range.toString().length;
  var preCaretRange = range.cloneRange();
  // console.dir(preCaretRange);
  console.dir(paper.childNodes);
  preCaretRange.selectNodeContents(paper);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  // console.dir(preCaretRange);
  console.log('PC');

  if (selected) {
    console.log('Selected');

    caretOffset = preCaretRange.toString().length - selected;
  } else {
    caretOffset = preCaretRange.toString().length;
  }
  console.log(`${caretOffset} <== caretOffset`);

  return caretOffset;
}
function addNewStyle(selectionStart, selectionEnd, style) {
  const styleMap = {
    bold: {
      openTag: '<b>',
      closeTag: '</b>',
      markdown: '**'
    },
    italics: {
      openTag: '<i>',
      closeTag: '</i>',
      markdown: '*'
    },
    underline: {
      openTag: '<u>',
      closeTag: '</u>',
      markdown: '++'
    }
  };

  styles.push(
    [selectionStart, styleMap[style]['openTag'], style],
    [selectionEnd, styleMap[style]['closeTag'], style]
  );
  //TODO insert properly and don't sort each time.

  sortStyles();
}
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
  paper.innerHTML = generateStyledHTML();
  //Set new caret postion
  let selection = window.getSelection();
  let focus = selection.focusNode;

  // console.dir(focus);

  // console.log(`${selection.focusOffset} <== selection.focusOffset`);
  // console.log(`${caretPosition} <== caretPosition`);
  // console.dir(paper.childNodes);
  let newCaret = document.createRange();
  newCaret.selectNode(paper);
  newCaret.setStart(paper.childNodes[0], caretPosition + 1);
  newCaret.setEnd(paper.childNodes[0], caretPosition + 1);
  //newCaret.collapse(true);
  // console.dir(newCaret);
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

function toggleTheme() {
  const body = document.querySelector('#body');
  body.classList.toggle('dark-theme');
}
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

  addNewStyle(selectionStart, selectionEnd, style);

  resetPaper(generateStyledHTML());

  return;
}
