let app = new PIXI.Application({
  width: window.innerWidth / 2,
  height: window.innerHeight / 2,
  backgroundColor: 0xeceff1
});

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

const basicText = new PIXI.Text('Basic text in pixi');
basicText.x = 50;
basicText.y = 100;

app.stage.addChild(basicText);
