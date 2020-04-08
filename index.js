// --- constants / globals---
const paper = document.querySelector('#paper');
paper.focus();
let paragraphs = [];
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
  'Delete',
  ' ',
  'Alt',
];

paper.addEventListener('keyup', (e) => {
  //console.log(`${e.key} <== e.key`);
  console.log(`${paper.innerHTML} <== paper.innerHTML`);
  if (specialKeys.indexOf(e.key) >= 0) {
    //generateParagraphs();
    //let newHTML = paragraphs.map((p) => p.htmlToSet).join('');
    //console.log(`${newHTML} <== newHTML`);
    //paper.innerHTML = newHTML;
  }
});

function getContentFromHTML(html) {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return html.textContent;
}

function getParagraphType(content, innerHTML) {
  content = content.trim();
  console.log(`${content} <== content`);
  // check for header
  if (content[0] === '#') {
    if (content[1] === '#') {
      if (content[2] === '#' && content[3] === ' ') {
        return 'h3';
      } else if (content[2] === ' ') {
        return 'h2';
      }
    } else if (content[1] === ' ') {
      return 'h1';
    }
  }

  if (content[0] === '-') {
    return 'list_item';
  }

  if (content === '' && innerHTML === '<br>') {
    return 'line_break';
  }
  return 'normal';
}

function getNewHTML(textContent, type) {
  if (type === 'h1') {
    return `<div><h1>${textContent}</h1></div>`;
  }

  if (type === 'h2') {
    return `<div><h2>${textContent}</h2></div>`;
  }

  if (type === 'h3') {
    return `<div><h3>${textContent}</h3></div>`;
  }

  if (type === 'line_break') {
    return `<div><br></div>`;
  }
  return `<div>${textContent}</div>`;
}
function generateParagraphs() {
  //let paragraphs = paper.innerHTML.split('<div><br></div>').map(p => {
  paragraphs = Array.from(paper.querySelectorAll('div')).map((p) => {
    let textContent = getContentFromHTML(p);
    let type = getParagraphType(textContent, p.innerHTML);
    return {
      html: p.innerHTML,
      textContent,
      type,
      htmlToSet: getNewHTML(textContent, type),
    };
  });

  console.dir(paragraphs);
  console.log('^paragraphs');
}
