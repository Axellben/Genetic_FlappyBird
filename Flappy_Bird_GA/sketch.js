const TOTAL = 500;
const pipeInterval = 50;
let birds = [];
let saveBirds = [];
let pipes = [];
let counter = 0;
let slider;
let bgX = 0;
let score = 0;
let parallax = 0.1,
  speed;
let birdImg, pipeImg, pipeImgR, groundImg, bgImg, flappyFont;
let checkbox;
let showBestBird = false;

function preload() {
  flappyFont = loadFont("assets/04B_19__.TTF");
  birdImg = loadImage("assets/yellowbird-midflap.png");
  pipeImg = loadImage("assets/flappy_pipe.png");
  pipeImgR = loadImage("assets/flappy_pipe_r.png");
  groundImg = loadImage("assets/flappy_ground.png");
  bgImg = loadImage("assets/flappy_bg.png");
}

function setup() {
  createCanvas(bgImg.width, bgImg.height + groundImg.height);
  createP("Fast forward");
  slider = createSlider(1, 100, 1);
  for (i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % pipeInterval == 0) {
      pipes.push(new Pipe());
      speed = pipes[0].speed;
    }
    counter++;

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].update();

      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          saveBirds.push(birds.splice(j, 1)[0]);
        }
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
      score = max(score, bird.score);
    }
    score = floor(score / pipeInterval);

    if (birds.length === 0) {
      counter = 0;
      nextGeneration();
      pipes = [];
      score = 0;
    }

    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offscreen()) {
        saveBirds.push(birds.splice(i, 1)[0]);
      }
    }
  }

  //All the drawing

  // Draw BackGround and create a paralex effect

  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= speed * parallax;

  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  for (let bird of birds) {
    bird.show();
  }

  for (let pipe of pipes) {
    pipe.show();
  }

  // For ground
  image(
    groundImg,
    0,
    height - groundImg.height,
    groundImg.width,
    groundImg.height
  );

  // For scores
  textFont(flappyFont);
  textSize(28);
  textAlign(CENTER);
  stroke(0);
  strokeWeight(2);
  fill(0);
  text(score, width / 2 + 1, height / 10 + 1);
  fill(255);
  text(score, width / 2, height / 10);
}

// function keyPressed() {
//   if (key == " ") {
//     bird.up();
//   }
// }
