/*jshint esversion: 6 */
let img;
let img2;
let button;
let button2;
let snapper = 10000;
let frameNum;
rendered = 0;
let fileName;
let i;

function setup() {
	let canvas = createCanvas(window.innerWidth, 300);
	noSmooth();
	textAlign(CENTER);
	canvas.drop(gotFile);
	createP(" Click at split point ");
	button2 = createButton("Render");
	button2.mouseClicked(reStack);
	createP(" then ");
	button = createButton("Save New Image");
	button.mouseClicked(saveNewImage);
}

function mouseClicked() {
	if (img && mouseY < height) {
		snapper = findFactor(mouseX, img.width);
	}
}

function gotFile(file) {
	createP(file.name);
	fileName = file.name;
	img = loadImage(file.data, showImageStats);
	// snapper = 100;
}

function showImageStats() {
	createP("Height:" + img.height);
	createP("Width:" + img.width);
}

function reStack() {
	img.loadPixels();
	img2 = createImage(snapper, frameNum * img.height);
	img2.loadPixels();
	let counter = 0;
	for (let i = 0; i < frameNum; i++) {
		// console.log("frame:" + i);
		for (let y = 0; y < img.height; y++) {
			for (let x = 0; x < snapper; x++) {
				var index = ((i * snapper) + (y * img.width) + x) * 4;
				img2.pixels[counter + 0] = img.pixels[index + 0];
				img2.pixels[counter + 1] = img.pixels[index + 1];
				img2.pixels[counter + 2] = img.pixels[index + 2];
				img2.pixels[counter + 3] = img.pixels[index + 3];
				counter += 4;
			}
		}
	}
	img2.updatePixels();
	rendered = 1;
	button2.hide();
}

function draw() {
	background(51);
	fill(255);
	if (!img) {
		noStroke();
		text("drop image here", width / 2, height / 2);
	}
	if (img) {
		image(img, 0, 0, img.width, img.height);
		noStroke()
		textAlign(LEFT);
		text(" " + frameNum + " frames with a width of " + snapper, snapper, height - 200);
		colorMode(HSB, 100);
		stroke(mouseY, 255, 128, 60);
		// text(mouseX, mouseX + 20, mouseY);
		line(snapper, 0, snapper, height);
		stroke(mouseY, 0, 128, 30);
		line(mouseX, 0, mouseX, height);
		copy(Math.floor(mouseX - 40), 0, 80, 40, 0, height - 80, width, 160);
		if (rendered) {
			i = frameCount % 255;
			fill(i, 255, 128)
			text("RENDERED!", width / 2, height / 2);
		};
	}
}

function saveNewImage() {
	save(img2, fileName);
}

function preview() {
	reStack();
	image(img2, 0, 0, 200, 200);
}

function findFactor(x, num) {
	let factor = Math.floor(x);
	while (num % factor !== 0) {
		factor++;
	}
	frameNum = img.width / factor;
	// console.log("frameNum:" + frameNum);
	// console.log("Snapper:" + factor);
	return factor;
}