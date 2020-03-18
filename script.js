// --- constants / globals---
const paper = document.querySelector('#paper');
const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const paperPadding = 15;

let selectionStart = 0;
let selectionEnd = 0;
console.log(`${alphabets.length} <== alphabets.length`);
let mouseClicked = false;

let styles = [];
// --- sizer ---
// const sizer = document.querySelector('#sizer');
// let sizes = {};

// alphabets.split('').forEach(alphabet => {
//   sizer.innerText = alphabet;
//   sizes[alphabet] = sizer.offsetWidth;
// });

// let size = sizer.offsetWidth;
// //console.log(`${size} <== size`);
// paper.addEventListener('keydown', e => {
//   return;
// });

// --- DOM ---
paper.addEventListener('mousedown', e => {
  mouseClicked = true;
  //console.dir(e);
  console.log(`${e.clientX} <== e.clientX`);
  console.log(`${e.clientY} <== e.clientY`);
});

// paper.addEventListener('mousemove', () => {
//   if (mouseClicked) {
//   }
// });

paper.addEventListener('mouseup', e => {
  mouseClicked = false;

  let selection = window.getSelection().getRangeAt(0);
  let selectionLength = selection.endOffset - selection.startOffset;

  let preCaretRange = selection.cloneRange();
  preCaretRange.selectNodeContents(paper);
  preCaretRange.setEnd(selection.endContainer, selection.endOffset);

  selectionEnd = preCaretRange.toString().length;
  selectionStart = selectionEnd - selectionLength;

  //   console.log(`${selectionLength} <== selectionLength`);
  //   console.log(`${selectionStart} <== selectionStart`);
  //   console.log(`${selectionEnd} <== selectionEnd`);

  //   console.log(`${paper.innerHTML} <== paper.innerHTML`);
});

function handleStyleClick(style) {
  console.log(`${style} <== style`);

  if (selectionStart === selectionEnd) {
    console.log('Not doing anything');
    return;
  }

  if (style === 'bold') {
    styles.push([selectionStart, '<b>'], [selectionEnd, '</b>']);
  } else if (style === 'italics') {
    styles.push([selectionStart, '<i>'], [selectionEnd, '</i>']);
  } else if (style === 'underline') {
    styles.push([selectionStart, '<u>'], [selectionEnd, '</u>']);
  }

  // reset the selection values
  selectionStart = 0;
  selectionEnd = 0;
  console.log(`${JSON.stringify(styles, null, 2)} <== styles`);

  let styledText = '';
  let oldText = paper.innerText;
  for (let i = 0; i < oldText.length; i++) {
    for (let j = 0; j < styles.length; j++) {
      if (styles[j][0] === i) {
        styledText += styles[j][1];
      }
    }
    styledText += oldText[i];
  }

  paper.innerHTML = styledText;
}

function toggleTheme() {
  const body = document.querySelector('#body');
  body.classList.toggle('dark-theme');
}
