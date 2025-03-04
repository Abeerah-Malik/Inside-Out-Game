//bg color
var bg;

// font for title and text
var insideout;

// text
var txtcolor;
var headertxt;
var descriptiontxt;

//circles
var szcircle = 100;
var circleclr = '#491763';
var space = 160; // space between circles
var startx = 125; // start xpos
var starty = 200; // start ypos

//images in array
var images = [];

//create array to shuffle images
var shuffledimages = [];

//track which circles are clicked
var revealed = []; 

//sounds
var happySounds = []; //happiness sounds
var angrySounds = []; //anger sounds
var disgustSounds = []; //disgust sounds
var fearSounds = []; //fear sounds
var sadSound; //sad sound

//different scenes
var sceneId = 0;

//startscene
var startbtn;
var buttonClicked = false;

//gamescreen
var happycount = 0; //track the no. of happy sounds revealed


//win screen
var wintxt;
var wingif;
var btnreplay;




function preload() {

	//load font
	insideout = loadFont('insideout.ttf')


	// Load images
  images.push(loadImage('happy button.png'));         // happy 1
  images.push(loadImage('happy button.png'));        // happy 2
  images.push(loadImage('happy button.png'));       // happy 3
  images.push(loadImage('sad button.png'));        // sad
  images.push(loadImage('fear button.png'));       // fear 1
  images.push(loadImage('fear button.png'));       // fear 2
  images.push(loadImage('angry button.png'));      // anger 1
  images.push(loadImage('angry button.png'));     // anger 2
  images.push(loadImage('disgust button.png'));   // disgust
	
	// load sounds
	//happy
	happySounds.push(loadSound('happy1.mp3'));
	happySounds.push(loadSound('happy2.mp3'));
	happySounds.push(loadSound('happy3.mp3'));
	happySounds.push(loadSound('happy4.mp3'));
	happySounds.push(loadSound('happy5.mp3'));
	happySounds.push(loadSound('happy6.mp3'));
	//angry
	angrySounds.push(loadSound('anger1.mp3'));
	angrySounds.push(loadSound('anger2.mp3'));
	//disgust
	disgustSounds.push(loadSound('disgust1.mp3'));
	disgustSounds.push(loadSound('disgust2.mp3'));
	//sad
	sadSound = loadSound('sad1.mp3');
	//fear
	fearSounds.push(loadSound('fear1.mp3'));
	fearSounds.push(loadSound('fear2.mp3'));

	
	//winning gif
	wingif = createImg('confetti.gif', '');
	//hide gif initially
  wingif.hide();

}



function setup() {
	createCanvas(600, 600);
	//define bg color
	bg = '#faedcd'
	background(bg);
	
	//shuffle the images that are in images array using shuffle();
	shuffledimages = shuffle(images); 
	
	//replay button
	btnreplay = createButton('Replay');
	btnreplay.position(width / 2 - 100, 350);
	btnreplay.size(250, 100);
	btnreplay.style("font-family", "insideout");
	btnreplay.style("font-size", "65px");
	btnreplay.style("border-radius","100px");
	btnreplay.style("background", "#2f0f40");
	btnreplay.style("color", "#fff");
	btnreplay.mousePressed(replayPressed);

	//start button
	startbtn = createButton('Start');
	startbtn.position(width / 2 - 100, 350);
	startbtn.size(250,100);
	startbtn.style("border-radius","100px");
	startbtn.style("font-family", "insideout");
	startbtn.style("font-size", "65px");
	startbtn.style("background", "#2f0f40");
	startbtn.style("color", "#fff");
	startbtn.style('transition', 'all 0.5s ease-in-out');
	startbtn.mousePressed(startBtnPressed);


}


function draw() {

	background(bg);

	if (sceneId == 0) {
		showstartscreen();
	} else if (sceneId == 1) {
		gamescreen();
	} else if (sceneId == 2) {
		winscreen();
	}
}



function showstartscreen() {
    // show start button
    startbtn.show();
	  btnreplay.hide();
	  wingif.hide();

    //text 
    headertxt = "Hunt for Happiness";
    descriptiontxt = "Find three sounds of joy to win the game!";
    txtcolor = '#2f0f40';

    // draw the text 
    textAlign(CENTER);
    textSize(75);
    textFont(insideout);
    fill(txtcolor);
    text(headertxt, width / 2, 150); // header txt
    textSize(28);
    text(descriptiontxt, width / 2, 240); // description txt
}

function startBtnPressed() {
    startbtn.hide();
    sceneId = 1;

    buttonClicked = true; 
    setTimeout(() => {
        buttonClicked = false; 
    }, 100); 
}



function gamescreen() {
	noStroke();
	btnreplay.hide();
	wingif.hide();

	// header 
	textAlign(CENTER);
	textSize(68);
	textFont(insideout);
	fill(txtcolor);
	text(headertxt, 300, 80);

	var index = 0;
	for (var row = 0; row < 3; row = row + 1) {
		for (var col = 0; col < 3; col = col + 1) {
			var x = startx + col * space;
			var y = starty + row * space;

			//check for reveal image
			if (revealed[index]) {
				//show a random image
				imageMode(CENTER);  //position from center
				image(shuffledimages[index], x, y, 220, 220);
			} else {
				//show the circle
				fill(circleclr);
				ellipse(x, y, szcircle);
			}
			index = index + 1;
		}
	}
}


function mousePressed() {
	
	
	//avoid double click issue
	if (buttonClicked) return; 
	
	if (sceneId == 1) {
		var index = 0;
		for (var row = 0; row < 3; row = row + 1) {
			for (var col = 0; col < 3; col = col + 1) {
				var x = startx + col * space;
				var y = starty + row * space;

				//track if mouse is within radius of circle
				var d = dist(mouseX, mouseY, x, y);
				if (d < szcircle / 2) {
					if (!revealed[index]) {
						revealed[index] = true; // reveal the image

						// stop all other sounds when another clicked
						stopAllsounds();
						// play sound based on image
						var img = shuffledimages[index];
					 if (img == images[0] || img == images[1] || img == images[2]) {
            // Happy images
            var randomSound = random(happySounds);
            randomSound.play();
						 
						//count the number of happy reveal
						happycount = happycount + 1;
						// check if 3 happy images have been revealed
            if (happycount == 3) {
						//give a little pause when game is won
						setTimeout(() => { 
							sceneId = 2; // go to the win screen
            }, 800);
            } 
						 
            } else {
							//non-happy images and sounds
						 if (img == images[3]) {
            // Sad image
            sadSound.play();
							
            } else if (img == images[4] || img == images[5]) {
            // Fear images
            var randomSound = random(fearSounds);
            randomSound.play();
							
            } else if (img == images[6] || img == images[7]) {
            // Anger images
            var randomSound = random(angrySounds);
            randomSound.play();
							
            } else if (img == images[8]) {
            // Disgust image
            var randomSound = random(disgustSounds);
            randomSound.play();
						}
						
						//timeout for non-happy images to close again after small pause
            var notHappyimages = index; 
            setTimeout(() => {
            revealed[notHappyimages] = false; //hide the non-happy image
						stopAllsounds();
            }, 1000); //delay in miliseconds
							
					}
				}
			}
				index = index + 1;
			}
		}
	}
}


function winscreen() {
	
	  // show replay button
    btnreplay.show();
	  //stop sounds
	  stopAllsounds();
	
    // Set the text color and content
    wintxt = "YOU WIN!";
    txtcolor = '#2f0f40';

    // Draw the text on the screen
    textAlign(CENTER);
    textSize(150);
    textFont(insideout);
    fill(txtcolor);
    text(wintxt, width / 2, height / 2 - 80); // Display "YOU WIN!" in the center
	
	  //show the gif
    wingif.position(0,0); 
    wingif.show();
}


function stopAllsounds() {
	//if items in shuffle image array are playing then stop playing
	// stop happy 
	for (sound of happySounds) {
		sound.stop();
	}
	// stop angry
	for (sound of angrySounds) {
		sound.stop();
	}
	// stop disgust
	for ( sound of disgustSounds) {
		sound.stop();
	}
	// stop fear
	for ( sound of fearSounds) {
		sound.stop();
	}
	// stop sad
	sadSound.stop();

}



function replayPressed() {
  //reset game initial values
  sceneId = 0;  //back to the start screen
  happycount = 0;  //reset happy count
  revealed = [];  //reset the revealed images
  for (var i = 0; i < 9; i = i + 1) {
    revealed[i] = false;
  }

  //shuffle the images again for a new game
  shuffledimages = shuffle(images);

  //ide the replay button and show the start button
  btnreplay.hide();
  startbtn.show();
}
