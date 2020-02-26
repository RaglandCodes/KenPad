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

function resetPaper(innerHTMLString) {
  paper.innerHTML = innerHTMLString;
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

// --- Style functions ---

//uses plain text and styles tom make HTML
function HTMLForStyle(style) {
  switch (style) {
    case 'bold':
      return {
        open: '<b>',
        close: '</b>',
        offSet: 7
      };
      break;
  }
}
function generateStyledHTML() {
  let indexOffSet = 0; //used to handle increse in string length due to HTML tags

  let HTMLString = plainText;
  for (let i = 0; i < styles.length; i++) {
    let beforeStyle = HTMLString.slice(0, styles[i].start + indexOffSet);
    let styled = HTMLString.slice(
      styles[i].start + indexOffSet,
      styles[i].end + indexOffSet
    );
    console.log(`${styled} <= styled`);
    let afterStyle = HTMLString.slice(styles[i].end + indexOffSet);
    let HTMLStyleInfo = HTMLForStyle(styles[i].style);

    indexOffSet += HTMLStyleInfo.offSet;
    console.log(`${indexOffSet} <= indexOffSet`);
    HTMLString =
      beforeStyle + HTMLStyleInfo.open + styled + HTMLStyleInfo.close + afterStyle;
  }

  console.dir(styles);
  console.log(`${HTMLString} <= HTMLString`);
  return HTMLString;
}
function handleBoldClick() {
  let selection = window.getSelection().getRangeAt(0);

  console.log(`${selection.startOffset} <= selection.startOffset`);
  console.log(`${selection.endOffset} <= selection.endOffset`);
  styles.push({
    style: 'bold',
    start: selection.startOffset,
    end: selection.endOffset
  });

  resetPaper(generateStyledHTML());
  return;
}
