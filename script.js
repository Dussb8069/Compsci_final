let video;
let vScale = 16;
let particles = [];
let isEffectOn = false; // Flag to control the effect
let isPaused = false; // Flag to control particle movement pause

// canvas setup
function setup() {
  createCanvas(1400,800); 
  pixelDensity(1);

// activation button
  let toggleButton = createButton('PRESS BUTTON TO ACTIVATE CAMERA AND WATCH YOURSELF DECAY');
  toggleButton.class('p5-button'); 
  toggleButton.position(20, 20);
  toggleButton.mousePressed(toggleEffect);

  // pause button 
  let pauseButton = createButton('PAUSE DECAY');
  pauseButton.class('p5-button');
  pauseButton.position(20, 50);
  pauseButton.mousePressed(togglePause);
}


// forcing the pixel array
function draw() {
  if (isEffectOn && video && !isPaused) {
    background(0);
    video.loadPixels();
    for (let i = 0; i < particles.length; i++) {
      particles[i].follow();
      particles[i].update();
      particles[i].show();
    }
  }
}
// the canvas
function windowResized() {
  resizeCanvas(windowWidth, windowHeight); 
}
// attatching the button
function toggleEffect() {
  isEffectOn = !isEffectOn; 

  if (isEffectOn) {
    video = createCapture(VIDEO);
    video.size(width / vScale, height / vScale);
    for (let i = 0; i < 20000; i++) {
      particles[i] = new Particle(random(width), random(height));
    }
  } else {
    video.stop();
    video.remove();
    video = null;
  }
}
// attatching the pause button
function togglePause() {
  isPaused = !isPaused;
}

// the particles are the pixels being slected. This controls their speed and what RGB colours the attatch too
class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 4;
    this.color = [255, 255, 255]; // picking an agressivly light shade so the pixels sense it and attatch better.
    this.radius = random(10, 40); //a random radius between 4 and 10
  }

  follow() {
    let videoX = floor(this.pos.x / vScale);
    let videoY = floor(this.pos.y / vScale);
    let index = (videoX + videoY * video.width) * 4;
    let brightness = (video.pixels[index + 0] + video.pixels[index + 1] + video.pixels[index + 2]) / 3;

    let angle = map(brightness, 0, 255, 0, TWO_PI);
    let newVel = p5.Vector.fromAngle(angle);
    newVel.setMag(this.maxSpeed);
    this.acc = newVel;
  }
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    
    // Wrap around when particle reaches edge
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.y < 0) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = 0;
    
    // Decreases the radius (size) of the pixels gradually
    this.radius -= 0.02;
    this.radius = constrain(this.radius, 0, 10); 
  }
  show() {
    noStroke();
    let videoX = floor(this.pos.x / vScale);
    let videoY = floor(this.pos.y / vScale);
    let index = (videoX + videoY * video.width) * 4;
    let r = video.pixels[index + 0];
    let g = video.pixels[index + 1];
    let b = video.pixels[index + 2];
    fill(r, g, b, 200); 
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
