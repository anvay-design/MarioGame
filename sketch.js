var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario , mario_running;
var coin ,coinImage,  turtle, turtleImage, obstacle2, obstacle2Image,  obstacle3, obstacle3Image;
var coinGroup, obstaclesGroup;
var score;
var background, backgroundImage;
var gameOver, gameOverImage, restart, restartImage;
var heart1, heart1Image, heart2, heart2Image,heart3,heart3Image;
var count;
var invisibleGround;


function preload(){
  
  backgroundImage = loadImage("backg.jpg");
  mario_running = loadAnimation("Capture1.png","Capture3.png","Capture4.png")
  mario_collided = loadAnimation("mariodead.png");
  mario_ducked = loadAnimation("marioducking.png")
  
  coinImage = loadImage("coin.png");
  turtleImage = loadImage("obstacle1.png")
  obstacle2Image = loadImage("obstacle2.png")
  obstacle3Image = loadImage("obstacle3.png")
  gameOverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
  heart1Image = loadImage("heart.png");
  heart2Image = loadImage("heart.png");
  heart3Image = loadImage("heart.png");
 
}



function setup() {
 createCanvas(800,600);
  
  //create mario

  
  //creating background
  background = createSprite(0,0,400,600);
  background.addImage(backgroundImage);
  background.scale = 1
  background.depth=background.depth-1

  mario=createSprite(80,10,20,200);
 mario.addAnimation("moving", mario_running);
 mario.addAnimation("collided", mario_collided);
 mario.addAnimation("ducking", mario_ducked);

 mario.scale=0.5;

 gameOver = createSprite(300,100);
 gameOver.addImage(gameOverImage);
  
  restart = createSprite(300,140);
  restart.addImage(restartImage);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  
  
  //creating ground
  ground=createSprite(400,250,900,10);
  ground.velocityX=4;
  ground.x=ground.width/2;
  console.log(ground.x);
  ground.visible=false

  heart1 = createSprite(600,20);
  heart1.addImage(heart1Image);
  heart1.scale=0.1;

  heart2 = createSprite(630,20);
  heart2.addImage(heart2Image);
  heart2.scale=0.1;

  heart3 = createSprite(660,20);
  heart3.addImage(heart3Image);
  heart3.scale=0.1;

  //creating invisible ground
  invisibleGround=createSprite(400,220,900,10);
  invisibleGround.visible=false;

  
  
 coinGroup = createGroup();
 obstaclesGroup = createGroup();

  score=0;
  count=0;
  
}


function draw() {
    

  if (background.x < 0){
      background.x = background.width/2;
    }
  

  textSize(20);
  fill("black");
  text("Score: "+ score, 300,50);
  

  if(gameState === PLAY){
    //move the background   
  background.velocityX = -3 
    ground.velocityX = -(4 + 2*score/300);
    //scoring
    gameOver.visible = false;
  restart.visible = false;
  

  mario.changeAnimation("moving", mario_running)
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
 
  if (keyDown("space")&& mario.y >= 100) {
        mario.velocityY = -9;
        mario.changeAnimation("moving", mario_running)
  }
  if (keyDown("down")) {
    mario.changeAnimation("ducking", mario_ducked)
    mario.scale =0.35;
}
  
  
  if (obstaclesGroup.isTouching(mario)&& (count==0)){
    count=count+1;
    heart1.visible=false;
    gameState=END;
    
  }
  
  if (obstaclesGroup.isTouching(mario)&& (count==1)){
    count=count+1;
    heart2.visible=false;
    gameState=END;
    
  }
  
  if (obstaclesGroup.isTouching(mario)&& (count==2)){
    count=count+1;
    heart3.visible=false;
    gameState=END;
    
  }
  if (count==3){
    heart3.visible=false
    gameState=END;
    gameOver.visible=true;
    restart.visible=true;

    
  }
  
  if (coinGroup.isTouching(mario)){
    score = score+1;
    mario.scale=mario.scale+0.0000007;
    
  
    }
    //add gravity
    mario.velocityY = mario.velocityY + 0.8
  
    //spawn obstacles and coins
    spawnObstacles();
    spawnTurtle();
    spawnCoins();
  }
  
   if (gameState===END){
  ground.velocityX = 0;
  background.velocityX = 0;
  mario.velocityY = 0;
  mario.changeAnimation("collided", mario_collided);
  mario.scale =0.35;
     obstaclesGroup.setLifetimeEach(-1);
obstaclesGroup.setVelocityXEach(0);
obstaclesGroup.destroyEach();
coinGroup.destroyEach();
console.log(count);
gameOver.visible=true;
restart.visible=true;


   }
   
  
  mario.collide(invisibleGround);

  if(mousePressedOver(restart)) {
    reset();
  }
  
  drawSprites();


   
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,190,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2Image);
              break;
    
      case 2: obstacle.addImage(obstacle3Image);
              break;
    }

    
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    
  }
}
  
function spawnTurtle(){
if(frameCount % 200 === 0){
var turtle= createSprite(600,130, 10, 40);
turtle.addImage(turtleImage);
turtle.velocityX = -(6 + 3*score/100);
turtle.scale=0.2;
obstaclesGroup.add(turtle);
}
}
function spawnCoins() {
  //write code here to spawn the Bananas
  if (frameCount % 100 ===0 ) {
  var coin = createSprite(600,100,40,10);
    coin.y = Math.round(random(120,200));
    coin.addImage(coinImage);
    coin.scale = 0.05;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //adding cloud to the group
   coinGroup.add(coin);

  }
  
}

 

 function reset(){
  gameState=PLAY; 
  restart.visible=false; 
}




