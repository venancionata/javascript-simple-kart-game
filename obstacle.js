document.write('<scr'+'ipt type="text/javascript" src="util.js" ></scr'+'ipt>');

var Obstacle = function(id, image_src, velocity, x, y){
     return {
         id: id,
         image_src : image_src,
         velocity : velocity,
         x : x,
         y : y,
         
         Details: function(){
             return image_src + "-" + velocity + "-" + x + "-" + y;
         },
         
         X : function(){
         	return x;
         },
         
         Y : function(){
         	return y;
         },
         
         ID : function(){
         	return id;
         },
                  
         SetX : function (value){	
         	x = value;
         },
         
         SetY : function (value){
         	y = value;
         },
                  
         Image: function (){
            var image = new Image();
    		image.src = image_src;	
			return image;
         },
         
         MoveX : function(weight){
         	x+=(velocity * weight);
         },
         
         CollidedBehind : function(weight){
    	 	x += 20 * weight
    	 },
    	 
    	 CollidedOnLeft : function(weight){
         	y += 20  * weight; 
         },
         
         CollidedOnRigth : function(weight){
         	y -= 20  * weight;  
         }


     };
};

var Car = function(id, image, velocity, x, y){
    var car = Obstacle("car_" + id, image, velocity, x, y);    
    return car;
}

var Oil = function(id, image, velocity, x, y){
    var oil = Obstacle("oil_" + id, image, velocity, x, y);
    return oil;
}

var Hole = function(id, image, velocity, x, y){
    var hole = Obstacle("hole_" + id, image, velocity, x, y);
    return hole;
}


ObstacleUtil = {}

ObstacleUtil.initial_x = -120;
ObstacleUtil.minXToRespawnObstacle = 200;
ObstacleUtil.counterOfUpdates = 25;

ObstacleUtil.cars = {};
ObstacleUtil.oils = {};
ObstacleUtil.holes = {};

ObstacleUtil.obstaclesInMovement = {}

ObstacleUtil.initialize = function() {
	DefineCars();
	DefineOils();
	DefineHoles();
	
	ConfigureObstacles (ObstacleUtil.cars);
	ConfigureObstacles (ObstacleUtil.oils);
	ConfigureObstacles (ObstacleUtil.holes);
};

ObstacleUtil.draw = function() {
	DrawObstacles (ObstacleUtil.cars, 120, 120);
	DrawObstacles (ObstacleUtil.oils, 100, 100);
	DrawObstacles (ObstacleUtil.holes, 100, 100);
};

ObstacleUtil.update = function (player_sttoped, weight){
	if (!player_sttoped){
		ObstacleUtil.counterOfUpdates--;
		
	    if (ObstacleUtil.counterOfUpdates == 0){	
			
			for (track in [0, 1, 2, 3]){
				RespawnObstacleInTrack (track);
			}
			ObstacleUtil.counterOfUpdates = 25; 
	  	}
		
		MoveObstacles(ObstacleUtil.cars, weight);
		MoveObstacles(ObstacleUtil.oils, weight);
		MoveObstacles(ObstacleUtil.holes, weight);
		
  		VerifyAndStopObstacles (ObstacleUtil.cars);
  		VerifyAndStopObstacles (ObstacleUtil.oils);
  		VerifyAndStopObstacles (ObstacleUtil.holes);
  	}
};

function RespawnObstacleInTrack (track){
	if (CanRespawnnObstacleInTrack (track)){
		obstacle = GetStoppedObstacle ();
								
		if (obstacle != null){
			obstacle.SetX(ObstacleUtil.initial_x);
			obstacle.SetY(Util.tracks[track]);
			ObstacleUtil.obstaclesInMovement[obstacle.ID()] = true;
		}
	};
}

function IsOutOfScenario (obstacle){
	return obstacle.X() >= Util.sceneWidth;
}

function DefineCars (){
	for (i = 1; i < 8; i++){
		car = new Car(i, GetCarImagePath(i), GetRandomNumber(6) + 16, ObstacleUtil.initial_x, 0);
		ObstacleUtil.cars[car.ID()] = car;
	}	
}

function DefineOils (){
	for (i = 0; i < 2; i++){
		oil = new Oil(i, "images/oil.png", GetRandomNumber(6) + 20, ObstacleUtil.initial_x, 0);
		ObstacleUtil.oils[oil.ID()] = oil;
	}	
}

function DefineHoles (){
	for (i = 0; i < 2; i++){
		hole = new Hole(i, "images/hole.png", GetRandomNumber(6) + 20, ObstacleUtil.initial_x, 0);
		ObstacleUtil.holes[hole.ID()] = hole;
	}	
}

function VerifyAndStopObstacles (dict){
	for (var id in dict){
		isInMoving = ObstacleUtil.obstaclesInMovement[id];
		if (isInMoving && IsOutOfScenario(dict[id])) {
    		ObstacleUtil.obstaclesInMovement[id] = false;    		
  		}
	}
}

function MoveObstacles (dict, weight){
	for (var id in dict){
		canMove = ObstacleUtil.obstaclesInMovement[id];
		if (canMove) {
			dict[id].MoveX(weight);
		}
	}
}

function DrawObstacles (dict, width, height){
	for (var id in dict){
		obstacle = dict[id];
		Util.DocumentContext.drawImage(obstacle.Image(), obstacle.Y(), obstacle.X(), width, height);
    	
	}
}

function GetCarImagePath(number){
	return "images/car" + number + ".png";
}


function GetObstacleIDsByStatus (isMoving){
	list = []
	for (var id in ObstacleUtil.obstaclesInMovement){
		if (ObstacleUtil.obstaclesInMovement[id] == isMoving){
			list.push(id);
		}
	}
	return list;
}

function GetLastObstacleInTrack (track_number){
	lastObstacle = null
	if (track_number < Util.tracks.length){	
		y = Util.tracks[track_number];
		obstaclesInMovement = GetObstaclesInMovement ();
		for (var i in obstaclesInMovement){
			obstacle = obstaclesInMovement[i];
			if (obstacle != null && obstacle.Y() == y){
				if (lastObstacle != null && lastObstacle.X() > obstacle.X()){
					lastObstacle = obstacle;
				}else{
					lastObstacle = obstaclesInMovement[i];
				}
			}
		}
	}
	return lastObstacle;
}

function CanRespawnnObstacleInTrack (track_number){
	leftObstacle = GetLastObstacleInTrack (track_number - 1);
	centerObstacle = GetLastObstacleInTrack (track_number);
	rightObstacle = GetLastObstacleInTrack (track_number + 1);
	
	return HasSecurityDistanceToRespawn (leftObstacle) && 
		   HasSecurityDistanceToRespawn (centerObstacle) &&
		   HasSecurityDistanceToRespawn (rightObstacle);	
}

function HasSecurityDistanceToRespawn (obstacle){
	return (obstacle == null) || (obstacle != null && obstacle.X() >= ObstacleUtil.minXToRespawnObstacle);
}

function GetStoppedObstacle (){
	obstacleIDsStopped = GetObstacleIDsByStatus (false);
	obstacleId = GetRandomElement (obstacleIDsStopped);
	return SearchObstacleInDictsByID (obstacleId);
}

function GetObstaclesInMovement (){
	obstacleIDsInMovement = GetObstacleIDsByStatus (true);
	list = [];
	for (var id in obstacleIDsInMovement){
		obstacle = SearchObstacleInDictsByID (obstacleIDsInMovement[id]);
		if (obstacle != null){
			list.push(obstacle);
		}
	}
	return list;
}

function SearchObstacleInDictsByID (id){
	obstacle = SearchObstacleByID(ObstacleUtil.cars, id)
	if (obstacle == null){
		obstacle = SearchObstacleByID(ObstacleUtil.oils, id)
	}
	if (obstacle == null){
		obstacle = SearchObstacleByID(ObstacleUtil.holes, id)
	}
	return obstacle;
}

function SearchObstacleByID(dict, id){
	for (var i in dict){
		if (i == id){
			return dict[i];
		}
	}
	return null;
}

function ConfigureObstacles (dict){
	for (var i in dict){
		ObstacleUtil.obstaclesInMovement[dict[i].ID()] = false;
	}
}