let img;
let saveImgButton;
let transposeButton;
let saveKnbButton;
let ctlType;
let snapper = 10000;
let frameNum;
let fileName;
let frameHeight;
let guideLine;

function setup() {
	let canvas = createCanvas(500, 500);
	canvas.drop(gotFile);
	noSmooth();
	orientation = createRadio();
	orientation.option('Vertical', 'vertical');
	orientation.option('Horizontal', 'horizontal');
	orientation.value('vertical');
	orientation.changed(oriChanged);
	transposeButton = createButton("Transpose Hor ->Ver");
	transposeButton.mouseClicked(transpose);
	transposeButton.attribute('disabled', true);
	saveImgButton = createButton("Save New Image");
	saveImgButton.mouseClicked(saveNewImage);
	saveImgButton.attribute('disabled', true);
	createP(" ");
	ctlType = createRadio();
	ctlType.option('Knob', '0');
	ctlType.option('Slider', '1');
	ctlType.option('Button', '2');
	ctlType.option('Meter', '3');
	ctlType.option('Misc', '4');
	ctlType._getInputChildrenArray()[0].checked = true;
	saveKnbButton = createButton("Save .KNB file");
	saveKnbButton.mouseClicked(knb);
	saveKnbButton.attribute('disabled', true);
	fileStats = createP("");
	// textSize(12);
}

function oriChanged() {
	if (orientation.value() == 'vertical') {
		transposeButton.attribute('disabled', true);
		// saveImgButton.attribute('disabled', true);
	}
	if (orientation.value() == 'horizontal') {
	}
	snapper = 10000;
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
		frameNum = img.width / snapper;
		frameHeight = img.height;
		saveKnbButton.removeAttribute('disabled');
		ctlType.removeAttribute('disabled');
		transposeButton.removeAttribute('disabled');

	}
	if (orientation.value() == 'vertical' && mouseX > 0 && mouseX < width) {
		snapper = findFactor(mouseY, img.height);
		frameNum = img.height / snapper;
		frameHeight = snapper;
		saveKnbButton.removeAttribute('disabled');
		ctlType.removeAttribute('disabled');
	}
}

function gotFile(file) {
	fileName = file.name;
	img = loadImage(file.data, initImage);
	saveImgButton.attribute('disabled', true);
}

function initImage() {
	fileStats.html(fileName + " | Height:" + img.height + " | Width:" + img.width);
}

function transpose() {
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
	transposeButton.attribute('disabled', true);
	saveImgButton.removeAttribute('disabled');
	orientation.value('vertical');
	snapper = img.height;
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
		colorMode(HSB, 100);
		stroke(mouseY, 0, 128, 20);
		if (orientation.value() == "horizontal") {
			strokeWeight(1);
			//Draw mouse guides
			if (mouseX < width) {
				guideLine = mouseX;
				for (let i = 0; i < 16; i++) {
					line(guideLine, 0, guideLine, height);
					guideLine += mouseX;
				}
			}
			//Draw Snap lines
			stroke(mouseY, 255, 128, 60);
			strokeWeight(2)
			snapLine = snapper;
			for (let i = 0; i < 16; i++) {
				line(snapLine, 0, snapLine, height);
				snapLine += snapper;
			}
			noStroke();
			text(" " + frameNum + " frames with a width of " + snapper, snapper, img.height + 20);
			copy(Math.floor(mouseX - 40), 0, 80, 40, 0, height - 80, width, 160);
		}
		if (orientation.value() == "vertical") {
			strokeWeight(1);
			if (mouseX < width) {
				stroke(mouseY, 0, 128, 30);
				guideLine = mouseY;
				for (let i = 0; i < 16; i++) {
					line(0, guideLine, width, guideLine);
					guideLine += mouseY;
				}
			}
			stroke(mouseY, 255, 128, 60);
			strokeWeight(2);
			snapLine = snapper;
			for (let i = 0; i < 16; i++) {
				line(0, snapLine, width, snapLine);
				snapLine += snapper;
			}
			noStroke();
			text(" " + frameNum + " frames with a height of " + snapper, img.width, snapper);
			copy(0, Math.floor(mouseY - 40), 40, 80, width - 80, 0, 160, height);
		}
	}
}

function saveNewImage() {
	save(img, fileName);
}

function findFactor(x, num) {
	let factor = new Array(2).fill(Math.floor(x));
	while (num % factor[0] !== 0) {
		factor[0]++;
		if (num % factor[1] == 0) {
			return factor[1];
		}
		factor[1]--;
	}
	return factor[0];
}