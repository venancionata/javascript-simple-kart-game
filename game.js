document.write('<scr'+'ipt type="text/javascript" src="dependencies.js" ></scr'+'ipt>');

var Game = {};

Game.fps = 30;

Game.finish = false;

Game.initialize = function() {

  Scenario.initialize();	
  PlayerUtil.initialize();	
  ObstacleUtil.initialize();
    
};

Game.draw = function() {
	
  Scenario.clean();	
  Scenario.draw(PlayerUtil.instance.Kms(), PlayerUtil.HighScore(), PlayerUtil.instance.Stopped());	
  PlayerUtil.draw();
  ObstacleUtil.draw ();
	
};


Game.update = function() {
	
	PlayerUtil.update();
	ObstacleUtil.update(PlayerUtil.instance.Stopped(), PlayerUtil.velocityFactor);
	Scenario.update(PlayerUtil.instance.Stopped(), PlayerUtil.velocityFactor);
  
};


