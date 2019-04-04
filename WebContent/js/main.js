let mainStage;
let vm;
mainStage = new createjs.Stage("mycanvas");
createjs.Ticker.setFPS(30);
createjs.Ticker.addEventListener("tick", mainStage);
vm = ViewManager.getInstance();
//vm.setView(new gameView());
//ViewManager.getInstance().setView(new gameView());

function init(){
	vm.setView(new menuView());
	
	 ws = new WebSocket("ws://" + location.host + "/App/game");


	ws.onmessage = function(data){
		handle(data);
	}

}

//vm.setView(new menuView());
//$(mycanvas).toggleClass("menu");
//vm.setView(new gameView());
//mycanvas.webkitRequestFullScreen();
