// --- dependencies ---

// --- constants / globals---
const paper = document.querySelector('#paper');

let selectionStart = 0;
let selectionEnd = 0;

let plainText = '';

// TODO have seperate arrays for each style
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
  let action = styleAction(style, startIndex, endIndex);

  // Change startIndex and endIndex based on action to do
  if (style === 'bold') {
    styles.push([selectionStart, '<b>'], [selectionEnd, '</b>']);
  } else if (style === 'italics') {
    styles.push([selectionStart, '<i>'], [selectionEnd, '</i>']);
  } else if (style === 'underline') {
    styles.push([selectionStart, '<u>'], [selectionEnd, '</u>']);
  }
}

function pushNewStyle(style, startIndex, endIndex) {
  if (style === 'bold') {
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
  }
  // console.log(`${e.key} <== e.key`);
  // console.log(`${paper.innerHTML} <== paper.innerHTML`);
});

function styleAction(style, startIndex, endIndex) {
  const styleTagMap = {
    italics: { open: '<i>', close: '</i>' },
    bold: { open: '<b>', close: '</b>' },
    underline: { open: '<u>', close: '</u>' }
  };

  let action = '';
  let styleStartRegion = [];
  let styleEndRegion = [];

  let styleRegionsToDelete = [];
  let styleRegionsToAdd = [];

  let styleStartsInStyledRegion = false;
  let styleEndsInStyledRegion = false;

  const openTag = styleTagMap[style]['open'];
  const closeTag = styleTagMap[style]['close'];

  let otherStyles = [];
  let neededStyles = [];
  let neededStylesLength = 0;

  styles.forEach(s => {
    if (s[1] === openTag || s[1] === closeTag) {
      neededStyles.push(s);
      neededStylesLength += 1;
    } else {
      otherStyles.push(s);
    }
  });

  if (neededStylesLength == 0) {
    // if neededStylesLength == 0, do a simple push
    action = 'simple_push';
  }
  console.dir(neededStyles);
  console.log('^neededStyles');
  let i = 0;
  while (i < neededStylesLength) {
    let regionStart = neededStyles[i][0];
    let regionEnd = neededStyles[i + 1][0];

    console.log(regionStart + ' ' + regionEnd + ' ++' + startIndex + ' ' + endIndex);

    // if (regionEnd < startIndex) {
    //   // ignore this region
    // }

    if (regionStart > startIndex && regionStart < endIndex && regionEnd > endIndex) {
      console.log('111111111111');

      styleEndsInStyledRegion = true;
      styleEndRegion = [regionStart, regionEnd];
      break;
    }

    if (regionStart < startIndex && endIndex > regionEnd) {
      styleStartsInStyledRegion = true;
      console.log('22222222');

      styleStartRegion = [regionStart, regionEnd];
    }

    if (regionStart > endIndex) {
      if (styleStartsInStyledRegion) {
        console.log('33333333aaa');

        styleEndsInStyledRegion = false;
        break;
        //replace
      } else {
        console.log('3333bb');

        action = 'simple_push';
        break;
      }
    }

    if (regionStart > startIndex && regionEnd < endIndex) {
      console.log('444444444444');

      styleRegionsToDelete.push([regionStart, regionEnd]);
    }
    i += 2;
  } // end of while loop

  console.log(`${action} <== action`);
  console.log(`${styleRegionsToDelete} <== styleRegionsToDelete`);
  console.log(`${styleStartsInStyledRegion} <== styleStartsInStyledRegion`);
  console.log(`${styleEndsInStyledRegion} <== styleEndsInStyledRegion`);

  console.log(`${styleStartRegion} <== styleStartRegion`);
  console.log(`${styleEndRegion} <== styleEndRegion`);

  if (styleRegionsToDelete.length) {
  }
  if (action === 'simple_push') {
  }
}

function setStyleAndTextFromHTML() {
  html = paper.innerHTML;
  html = html.trim();
  console.log(`${html} <== html`);
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
}

function handleStyleClick(style) {
  console.log(`${style} <== style`);

  let selectionLength = window.getSelection().toString().length;

  if (!selectionLength) {
    console.log('Not doing anything');
    return;
  }

  let selection = window.getSelection().getRangeAt(0);

  //let selectionLength = selection.endOffset - selection.startOffset;
  //let selectionLength = window.getSelection().toString().length;

  let preCaretRange = selection.cloneRange();
  preCaretRange.selectNodeContents(paper);
  preCaretRange.setEnd(selection.endContainer, selection.endOffset);

  selectionEnd = preCaretRange.toString().length;
  selectionStart = selectionEnd - selectionLength;

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
