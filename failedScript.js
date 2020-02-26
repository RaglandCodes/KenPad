// constants
const paper = document.querySelector('#paper');

//styling functions

function checkIfStyled(str, start, end, type) {}

function addStyleSyntax(str, indexes, type) {
  const typeStringMap = {
    bold: '**',
    italic: '*'
  };
  console.log(`${typeStringMap[type]} <= typeStringMap[type]`);
  return (
    str.slice(0, indexes.start) +
    typeStringMap[type] +
    str.slice(indexes.start, indexes.end) +
    typeStringMap[type] +
    str.slice(indexes.end)
  );
}

// DOM functions
function editorText() {
  return paper.innerText;
}

function setEditorText(text) {
  paper.innerText = text;
}
function handleTextChange() {
  console.log('Handling');
}

// Return info about selection if text is selected. Else returns false
function getSelectedText() {
  if (window.getSelection().focusNode === null) {
    return false;
  }
  let range = window.getSelection().getRangeAt(0);
  return { start: range.startOffset, end: range.endOffset };
}

function handleBoldClick() {
  let selectedText = getSelectedText();
  if (selectedText === false) {
    return;
  }

  let boldedText = addStyleSyntax(editorText(), selectedText, 'bold');

  setEditorText(boldedText);
}

//function handleItalicClick() {}

// console.log(`${paper} <= paper`);

// paper.addEventListener('input', handleTextChange());

// const clicks = Rx.Observable.fromEvent(document, 'keyup').debounceTime(1000);

// clicks

//   //.map(event => event)
//   .subscribe(value => handleTextChange());
