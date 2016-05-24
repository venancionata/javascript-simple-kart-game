document.write('<scr'+'ipt type="text/javascript" src="util.js" ></scr'+'ipt>');

var Mark = function(image_src, velocity, x, y){
     return {
         
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
         }

     };
};

Scenario = {};

Scenario.marks = [];

Scenario.markInitialX = -80;
Scenario.markDistance = 150;


Scenario.initialize = function() {
	Font ();
	Background ();
	DefineStrips();
};

Scenario.draw = function(score, high_score, game_stopped) {
	DrawStripsOnScenario();
	if (!game_stopped){
		Score (score);
	}else{
		ShowScoreboard(score, high_score);
	}
};

Scenario.update = function(game_stopped, weigth) {
	if (!game_stopped){
		MoveStrips (weigth);
	}
};

Scenario.clean = function() {
	Util.CleanScenario();
};

function Background (){
	Util.Canvas.style.backgroundColor = 'rgba(158, 167, 184, 0.5)';
}

function Font (){
	Util.DocumentContext.font = "28px Arial";
	Util.DocumentContext.fillStyle="#FF0000";
}

function Score (value){
	Util.DocumentContext.fillText("Km: " + parseInt(value), 440, 30);
}

function ShowScoreboard(score, high_score){
	Util.DocumentContext.fillText(GetScoreboardText(score, high_score), 30, 30);
}

function GetScoreboardText (score, high_score){
	text= "Last Score: " + parseInt(score);
	text+= " / "
	text+= "High Score: " + parseInt(high_score);	
	return text;
}

function MoveStrips (weigth){
	for (i = 0; i < Scenario.marks.length; i++){
		mark = Scenario.marks[i];
		if (mark.X() > Util.sceneHeight + 40){
			mark.SetX(Scenario.markInitialX);
		}
		mark.MoveX(weigth);
	}	
}

function DrawStripsOnScenario(){
	for (i = 0; i < Scenario.marks.length; i++){
		mark = Scenario.marks[i];
		Util.DocumentContext.drawImage(mark.Image(), mark.Y(), mark.X(), 5, 50);
	}
}

function DefineStrips(){
	for (i = 0; i < Util.tracks.length; i++) { 	
		y = (Util.tracks[i] - 10);
		InstanciateOneStrip (y);
	}
	InstanciateOneStrip (Util.tracks[3] + Util.track_distance - 10);
}

function InstanciateOneStrip (y){
	x = Scenario.markInitialX;
	for (j = 0; j < 6; j++){
		x += Scenario.markDistance;	
		mark = new Mark("images/rectangle.jpg", 30, x, y);
		Scenario.marks.push(mark);
	}
}