let img;
let button;
let button2;
let button3;
let ctlType;
let snapper = 10000;
let frameNum;
let fileName;
let frameHeight;

function setup() {
	let canvas = createCanvas(500, 500);
	canvas.drop(gotFile);
	noSmooth();
	orientation = createSelect();
	orientation.option('Vertical', 'vertical');
	orientation.option('Horizontal', 'horizontal');
	orientation.changed(oriChanged);
	button2 = createButton("Transpose Hor ->Ver");
	button2.mouseClicked(reStack);
	button2.hide();
	button = createButton("Save New Image");
	button.mouseClicked(saveNewImage);
	button.hide();
	createP(" ");
	ctlType = createSelect();
	ctlType.option('Knob', 0);
	ctlType.option('Slider', 1);
	ctlType.option('Button', 2);
	ctlType.option('Meter', 3);
	ctlType.option('Misc', 4);
	ctlType.hide();
	button3 = createButton("Save .KNB file");
	button3.mouseClicked(knb);
	button3.hide();
	fileStats = createP("");
}

function oriChanged() {
	if (orientation.value() == 'vertical') {
		button2.hide();
		button.hide();
		snapper = 10000;
	}
	if (orientation.value() == 'horizontal') {
		button2.show();
		snapper = 10000;
	}

}

function knb() {
	let knbString = ["{{",
		"[\"fn\"]=\"" + fileName + "\",",
		"[\"ctltype\"]=" + ctlType.value() + ",",
		"[\"frames\"]=" + frameNum + ",",
		"[\"cellh\"]=" + frameHeight + ",",
		"},",
		"}"];
	save(knbString, fileName.substr(0, fileName.length - 4), "knb");
}

function mouseClicked() {
	if (orientation.value() == 'horizontal' && mouseX > 0 && mouseX < width) {
		snapper = findFactor(mouseX, img.width);
		button3.show();
		ctlType.show();
		console.log("clicked");

	}
	if (orientation.value() == 'vertical' && mouseX > 0 && mouseX < width) {
		snapper = findFactor(mouseY, img.height);
		button3.show();
		ctlType.show();
		console.log("clicked");
	}
}

function gotFile(file) {
	fileName = file.name;
	img = loadImage(file.data, initImage);
}

function initImage() {
	fileStats.html(fileName + " | Height:" + img.height + " | Width:" + img.width);
}

function reStack() {
	img.loadPixels();
	let img2 = createImage(snapper, frameNum * img.height);
	img2.loadPixels();
	let counter = 0;
	for (let i = 0; i < frameNum; i++) {
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
	button2.hide();
	button.show();
	img = img2;
}

function draw() {
	background(51);
	fill(255);
	if (!img) {
		noStroke();
		text("drop image here", 200, height / 2);
	}
	if (img) {
		image(img, 0, 0, img.width, img.height);
		noStroke();
		colorMode(HSB, 100);
		if (orientation.value() == "horizontal") {
			stroke(mouseY, 255, 128, 60);
			line(snapper, 0, snapper, height);
			stroke(mouseY, 0, 128, 30);
			line(mouseX, 0, mouseX, height);
			text(" " + frameNum + " frames with a width of " + snapper, snapper, img.height + 20);
			copy(Math.floor(mouseX - 40), 0, 80, 40, 0, height - 80, width, 160);
		}
		if (orientation.value() == "vertical") {
			stroke(mouseY, 255, 128, 60);
			line(0, snapper, width, snapper);
			stroke(mouseY, 0, 128, 30);
			line(0, mouseY, width, mouseY);

			text(" " + frameNum + " frames with a height of " + snapper, img.width, snapper);
			copy(0, Math.floor(mouseY - 40), 40, 80, width - 80, 0, 160, height);
		}
	}
}

function saveNewImage() {
	save(img, fileName);
}

function findFactor(x, num) {
	let factor = Math.floor(x);
	while (num % factor !== 0) {
		factor++;
	}
	if (orientation.value() == 'horizontal') {
		frameNum = img.width / factor;
		frameHeight = img.height;
	}
	if (orientation.value() == 'vertical') {
		frameNum = img.height / factor;
		frameHeight = factor;
	}
	return factor;
}