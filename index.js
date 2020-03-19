// --- dependencies ---

//const jsdom = require('jsdom');
// --- constants / globals---
const paper = document.querySelector('#paper');

let selectionStart = 0;
let selectionEnd = 0;
let mouseClicked = false;

plainText = '';
let styles = [];

// --- DOM ---

function generateStyledHTML() {
  let html = '';
  let plainText = paper.innerText;
  for (let i = 0; i < plainText.length; i++) {
    for (let j = 0; j < styles.length; j++) {
      if (styles[j][0] === i) {
        html += styles[j][1];
      }
    }
    html += plainText[i];
  }

  console.log(`${JSON.stringify(html, null, 2)} <== final html in gsh`);
  return html;
}

function addNewStyle(style, startIndex, endIndex) {
  if (style === 'bold') {
    console.log('BB');

    styles.push([selectionStart, '<b>'], [selectionEnd, '</b>']);
  } else if (style === 'italics') {
    styles.push([selectionStart, '<i>'], [selectionEnd, '</i>']);
  } else if (style === 'underline') {
    styles.push([selectionStart, '<u>'], [selectionEnd, '</u>']);
  }
}

paper.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    console.log('EE');
  }
  console.log(`${e.key} <== e.key`);
  console.log(`${e.key === ' '} <== e.key === " "`);
  console.log(`${e.key === 'Enter'} <== e.key === "Enter"`);
  console.log(`${paper.innerHTML} <== paper.innerHTML`);
});

function setStyleAndTextFromHTML() {
  html = paper.innerHTML;
  html = html.trim();
  console.log(`${html} <== html`);
  let p = '';
  //let s = [];
  styles = [];
  let extraCounter = 0;

  let htmlLength = html.length;
  let currentIndex = -1;
  // console.log(`${htmlLength} <== htmlLength`);
  while (currentIndex < htmlLength) {
    currentIndex += 1;
    // console.log(`${currentIndex} <== currentIndex ==> ${html[currentIndex]}`);
    if (html[currentIndex] === '<') {
      if (html[currentIndex + 1] === 'b') {
        styles.push([currentIndex - extraCounter, '<b>']);
        currentIndex += 2;
        extraCounter += 3;
      } else if (html[currentIndex + 1] === 'i') {
        styles.push([currentIndex - extraCounter, '<i>']);
        currentIndex += 2;
        extraCounter += 3;
      } else if (html[currentIndex + 1] === 'u') {
        styles.push([currentIndex - extraCounter, '<u>']);
        currentIndex += 2;
        extraCounter += 3;
      } else if (html[currentIndex + 1] === '/') {
        if (html[currentIndex + 2] === 'b') {
          styles.push([currentIndex - extraCounter, '</b>']);
        } else if (html[currentIndex + 2] === 'i') {
          styles.push([currentIndex - extraCounter, '</i>']);
        } else if (html[currentIndex + 2] === 'u') {
          styles.push([currentIndex - extraCounter, '</u>']);
        }
        currentIndex += 3;
        extraCounter += 4;
      }
      continue;
    }
  }

  // styles = s;
}

function handleStyleClick(style) {
  console.log(`${style} <== style`);

  let selection = window.getSelection().getRangeAt(0);
  let selectionLength = selection.endOffset - selection.startOffset;

  let preCaretRange = selection.cloneRange();
  preCaretRange.selectNodeContents(paper);
  preCaretRange.setEnd(selection.endContainer, selection.endOffset);

  selectionEnd = preCaretRange.toString().length;
  selectionStart = selectionEnd - selectionLength;

  if (selectionStart === selectionEnd) {
    console.log('Not doing anything');
    return;
  }

  setStyleAndTextFromHTML();
  // console.log(`${JSON.stringify(styles, null, 2)} <== styles btw`);
  addNewStyle(style, selectionStart, selectionEnd);

  // reset the selection values
  selectionStart = 0;
  selectionEnd = 0;

  // console.log(`${JSON.stringify(styles, null, 2)} <== styles before geeratinh new HTML`);
  paper.innerHTML = generateStyledHTML();
}

function toggleTheme() {
  const body = document.querySelector('#body');
  body.classList.toggle('dark-theme');
}
