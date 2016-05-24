document.write('<scr'+'ipt type="text/javascript" src="util.js" ></scr'+'ipt>');
document.write('<scr'+'ipt type="text/javascript" src="obstacle.js" ></scr'+'ipt>');

var Player = function(image_src, x, y, velocity, rigth_last_direction, speedometer){
     return {
			         
         image_src : image_src,
         x : x,
         y : y,
         velocity : velocity,
         rigth_last_direction : rigth_last_direction,
         speedometer : speedometer,
         
         Details: function(){
             alert(image + "-" + velocity + "-" + x + "-" + y);
         },
         
         Image: function (){
            var image = new Image();
    		image.src = image_src;	
			return image;
         },
         
         X : function(){
         	return x;
         },
         
         Y : function(){
         	return y;
         },
         
         SetX : function (value){	
         	x = value;
         },
         
         SetY : function (value){
         	y = value;
         },
         
         MoveY : function(value){
         	y+=value; 
         },
         
         MoveX : function(value){
         	x+=value; 
         },
         
         SetVelocity : function (value){
         	velocity = value;
         },
         
         Stop : function(){
         	velocity = 0; 
         },
                  
         Stopped : function(){
         	return velocity == 0; 
         },
         
         Velocity : function(){
         	return velocity
         },
         
		 CollidedOfFront : function(){
         	x += 20 * velocity; 
         },
         
         CollidedOnLeft : function(){
         	y += 20 * velocity; 
         },
         
         CollidedOnRigth : function(){
         	y -= 20 * velocity; 
         },
         
         LastDirection : function(rigth){
         	rigth_last_direction = rigth; 
         },
         
         RightLastDirection : function(){
			return rigth_last_direction; 
		 },
		 
		 Running : function(){
		 	speedometer+= 0.1;
		 },
	
		 Kms : function(){
		 	return speedometer;
		 }

     };
}

PlayerUtil = {};

PlayerUtil.instance = null;

PlayerUtil.initialX = 480;

PlayerUtil.velocityFactor = 1.25;

PlayerUtil.HighScore = function (){
	return sessionStorage.highScore;
}

PlayerUtil.SetHighScore = function (score){
	sessionStorage.highScore = score;
}

PlayerUtil.initialize = function() {
	PlayerUtil.instance = new Player("images/police.png", PlayerUtil.initialX, Util.GetRandomTrack(), 1, false, 0);
	InitHighScoreIfNotExists();
	Inputs();
}

PlayerUtil.draw = function() {
	Util.DocumentContext.drawImage(PlayerUtil.instance.Image(), PlayerUtil.instance.Y(), PlayerUtil.instance.X(), 120, 120);
}

PlayerUtil.update = function (){
  if (!PlayerUtil.instance.Stopped()){
  	  PlayerUtil.instance.Running();
  	  
  	  VerifyIfCollied (ObstacleUtil.cars);
  	  VerifyIfCollied (ObstacleUtil.oils);
  	  VerifyIfCollied (ObstacleUtil.holes);
  	  
  	  if (PlayerUtil.instance.Stopped()){
  	  	if (PlayerUtil.HighScore() < PlayerUtil.instance.Kms()){
  	  		PlayerUtil.SetHighScore(PlayerUtil.instance.Kms());
  	  	}
  	  }
  }  
}

function VerifyIfCollied (dict){
	for (var i in dict){
		obstacle = dict[i];
		if (PlayerUtil.CollidedOfFront(obstacle)){
			PlayerUtil.instance.CollidedOfFront();
	  		obstacle.CollidedBehind(PlayerUtil.instance.Velocity());
	  		PlayerUtil.instance.Stop();
		} else if (PlayerUtil.CollidedOnLeft(obstacle)){
			PlayerUtil.instance.CollidedOnLeft();
	  		obstacle.CollidedOnRigth(PlayerUtil.instance.Velocity());
			PlayerUtil.instance.Stop();
		} else if (PlayerUtil.CollidedOnRight(obstacle)){
			PlayerUtil.instance.CollidedOnRigth();
	  		obstacle.CollidedOnLeft(PlayerUtil.instance.Velocity());
			PlayerUtil.instance.Stop();
		}
	}
}

PlayerUtil.CollidedOfFront = function (obstacle){
	return (obstacle.Y() == PlayerUtil.instance.Y()) && obstacle.X() < 400 && obstacle.X() >= 380;
}

PlayerUtil.CollidedOnLeft = function (obstacle){
	return !PlayerUtil.instance.RightLastDirection() && (obstacle.Y() == PlayerUtil.instance.Y()) && obstacle.X() < 580 && obstacle.X() >= 440;
}

PlayerUtil.CollidedOnRight = function (obstacle){
	return PlayerUtil.instance.RightLastDirection() && (obstacle.Y() == PlayerUtil.instance.Y()) && obstacle.X() < 580 && obstacle.X() >= 440;
}

function Inputs(){
	Util.Document.addEventListener('keydown', function(event) {
		if ((Right (event.keyCode) || Left (event.keyCode)) && !PlayerUtil.instance.Stopped()){
			Move (Right (event.keyCode));
		}
    });
}

function Right (keyCode){
	return keyCode == 39;
}

function Left (keyCode){
	return keyCode == 37;
}

function Move (toRight){
	if (toRight && PlayerUtil.instance.Y() < Util.last_track){
		PlayerUtil.instance.MoveY (Util.track_distance);
		PlayerUtil.instance.LastDirection(true);
		PlayerUtil.draw();
	} else if (!toRight && PlayerUtil.instance.Y() > Util.first_track){
		PlayerUtil.instance.MoveY ((-1) * Util.track_distance);
		PlayerUtil.instance.LastDirection(false);
		PlayerUtil.draw();
	}
}


function InitHighScoreIfNotExists(){
	if (!sessionStorage.highScore){
		sessionStorage.highScore = 0;
	}
}