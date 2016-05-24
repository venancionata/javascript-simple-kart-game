Util = {};

Util.Document = document;
Util.Canvas = document.getElementById("canvas");
Util.DocumentContext = Util.Canvas.getContext("2d");


Util.tracks = [30, 170, 310, 450];

Util.first_track = Util.tracks[0];
Util.last_track = Util.tracks[3];

Util.track_distance = 140;

Util.sceneWidth = 600;
Util.sceneHeight = 600;

Util.CleanScenario = function (){
	Util.DocumentContext.clearRect(0, 0, 600, 600);
};

Util.GetRandomTrack = function() {
	return Util.tracks[GetRandomNumber(3)];
};

function GetRandomNumber(max){
	return Math.floor((Math.random() * max));
};

function GetRandomElement (list){
	return list[GetRandomNumber(list.length - 1)];
}

function GetValues (dict){
	values = []
	for (var key in dict){
    	list.push(dict[key]);
	}
	return values;
}