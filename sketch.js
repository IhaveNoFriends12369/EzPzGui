var PLAY = 1;
var END = 0;
var gameState = PLAY;


var EnergyBar;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg, restartImg,NrgImage;
var jumpSound, checkPointSound, dieSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");
NrgImage = loadImage("Malid.jpg");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
  console.log(message)

  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);


  trex.scale = 0.5;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

   EnergyBar = createSprite(560,120,20,130);
  EnergyBar.shapeColor = 'orange';
  EnergyBar.depth = 200;
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
NrgGroup = createGroup();

  trex.setCollider("rectangle", 0, 0, trex.width, trex.height);
  trex.debug = true

  score = 0;

}

function draw() {

  background(180);
  
  //camera.position.y = trex.y - 40;
  
  var fr = Math.round(random(42,53));
  frameRate(fr);
  text("Fps " + fr, 100, 50);

  var firebaseConfig = {
    apiKey: "AIzaBMTLuMBdTeapp.com",
    projectId: "terminalfeeding",
    storageBucket: "terminading.appspot.com",
    messagingSenderId: "563989102450",
    appId: "1:5639891
  //displaying score
  text("Score: " + score, 500, 50);
camera.position.x = trex.x;

  if (gameState === PLAY) {

    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + 3 * score / 100)
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 140 || keyDown(UP_ARROW) && trex.y >= 140) {
      trex.velocityY = -12;
      EnergyBar.height = EnergyBar.height - 4.5;
    }
    if(EnergyBar.height < 0){
      gameState = END;
      dieSound.play();
    }
    if (keyWentDown("space") && trex.y >= 140 || keyWentDown(UP_ARROW) && trex.y >= 140) {
      jumpSound.play();
    }
    if(keyDown(DOWN_ARROW)){
      trex.velocityY = 12;
       
       }
    if(trex.isTouching(NrgGroup)){
      EnergyBar.height = 130;
      NrgGroup.destroyEach();
      checkPointSound.play();
    }
    if(keyWentDown("x")){
      EnergyBar.height = 130;
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();
    
    spawnBar();

    if (obstaclesGroup.isTouching(trex)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play()

    }
    
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    //change the trex animation
    trex.changeAnimation("collided", trex_collided);



    ground.velocityX = 0;
    trex.velocityY = 0


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    NrgGroup.setLifetimeEach(-1);
    
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    NrgGroup.setVelocityXEach(0);
    
console.time();
    if (mousePressedOver(restart)) {
     
      reset();
    }
    if(keyDown("enter")){
       reset();
       }
    //for (var l = 0;l<50;l=l + 2) {
      //console.log("Akshaj");
    //}

  }


  //stop trex from falling down
  trex.collide(invisibleGround);

  console.log(gameState);


  drawSprites();
  
}

function reset() {
  score = 0;
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  NrgGroup.destroyEach();
  EnergyBar.height = 130;
  trex.changeAnimation("running",trex_running);

}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(6 + score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 120, 40, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
function spawnBar(){
  if (frameCount % 500 === 0) {
    var NrgTof = createSprite(600, 120, 40, 10);
    NrgTof.y = Math.round(random(60, 100));
    NrgTof.addImage(NrgImage);
    NrgTof.scale = 0.1;
    NrgTof.velocityX = -4;

    //assign lifetime to the variable
    NrgTof.lifetime = 200;

    //adjust the depth
    NrgTof.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    NrgGroup.add(NrgTof);
  
  
  
}
}