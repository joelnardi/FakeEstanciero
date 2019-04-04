function Game(data){
this.expandSprite;
	this.reqFullScreen = function(){
		mycanvas.webkitRequestFullscreen()
		screen.orientation.lock('landscape');
		
this.fullscreen = !this.fullscreen;
		
if(!this.fullscreen){
this.expandSprite.gotoAndStop("fullscreen");
}
else{
this.expandSprite.gotoAndStop("widescreen");
}
}
	
this.next = function(){
return this.hands[(this.currentTurn+1)%this.nPlayers];
}


this.draw = function(playerCards){
this.deck.drawStart(playerCards);
this.repartir(this.currentTurn);
}

this.repartir = function(index){
var index = index%this.hands.length
this.hands[index].onEndDraw =()=> {
index++;
this.currentTurn = index;
this.repartir(index);
}
this.deck.repartir(this.hands[index]);
}

this.finishPlay = function(){
this.player.orderCards();
}

this.getNextPlayer = function(){
++this.currentTurn;
return this.hands[(this.currentTurn)%this.nPlayers];
}

this.playCard = function(target,c,id)
{
if(target != this.player)
c.id = id;
this.currentPlayer = this.getNextPlayer();
this.deck.playCard(target,c,()=>{target.orderCards();});
}

this.loop = function(){

//this.stage.update();		
}




this.initialize = function(){
//create stage
this.stage = new createjs.Container();
//background
var bg = new createjs.Shape();
bg.graphics.beginFill("black").rect(0,0,TARGET_WIDTH,TARGET_HEIGHT);
this.stage.addChild(bg);

//fullscreen button
var spriteSheet = new createjs.SpriteSheet({

        images: ["img/but_fullscreen.png"],
        frames: {width:70, height:70},
        animations: {
            widescreen:0,
			fullscreen:1
        }
})

var sp = new createjs.Sprite(spriteSheet);
this.expandSprite = sp;
sp.gotoAndStop("fullscreen");

var bs = new createjs.Shape();
bs.graphics.beginFill("blue").rect(0,0,200,200);
sp.hitArea = bs;
sp.scaleX = sp.scaleY = 2;

var butt = new createjs.Container();
butt.x = TARGET_WIDTH - 70*2;
butt.y = 0;
//butt.addChild(sp);

butt.addChild(sp);
//this.stage.addChild(butt);

butt.on("click",function(){
if(this.fullscreen){
mycanvas.webkitRequestFullscreen()
sp.gotoAndStop("widescreen");
screen.orientation.lock('landscape');
}
else{
document.webkitExitFullscreen()
sp.gotoAndStop("fullscreen");
}

this.fullscreen = !this.fullscreen;
}
);

 createjs.Ticker.setFPS(30);
 createjs.Ticker.addEventListener("tick", this.loop.bind(this));
  
 /*
this.handleResize();
window.addEventListener("resize",() => {
  // Announce the new orientation number
  
 this.handleResize();

}, false);
*/
 
this.fullscreen = false;

this.deck = new DeckDisplayer(this,TARGET_WIDTH/2 - 1.3*50,TARGET_HEIGHT/2 - 1.3*75)
this.hands = [];
this.nPlayers = data.nPlayers;
this.currentTurn = 3;
this.player = new HandDisplayer(this,data.PlayerName,262.5,1000-225,937.5,225,0);
this.hands.push(this.player);
this.hands.push(new HandDisplayer(this,"OPONENT",TARGET_WIDTH-150,225,150,550,1));
this.hands.push(new HandDisplayer(this,"OPONENT",262.5,0,937.5,225,2));
this.hands.push(new HandDisplayer(this,"OPONENT",0,225,150,550,3));
this.currentPlayer = this.hands[this.currentTurn];

this.deck.onEnd = () => {
this.player.orderCards();
}

}
this.initialize();
	 

}
/*
NOTAS

PAQUETES

ESPERANDO JUGADORES
JUGADOR CONECTADO


GameState:{
Estado_JUEGO:(INICIADO/FINALIZADO/ESPERANDOJUGADORES),
Estado_RONDA:(INICIADA/FINALIZADA/ESPERANDO),
Jugadores:[],
NRORonda:x,
CurrentTurn:x,
TurnTimeLeft:x,
}

MSG:{
PLAYER_CONNECT
PLAYER_DISCONECT/GAME_FINISHED/GAME_STARTED/ROUND_STARTED/ROUND_END/PLAYER_TURN_START
PLAYER_PLAY/PLAYER_PASS
PLAYER_WIN_ROUND
PLAYER_BECOME_KING
PLAYER_BECOME_PLEB
GAME_STATE
PLAYER_RECONNECT
GAME_ROUND_COUNTDOWN: (30/20/10/5)
}

player on conect:
GAME_STATE-> Update local game state
player on reconnect:
GAME_STATE-> Update local game state

game on player connect:
PLAYER_CONNECT msg -> Update local game

game on player discconect:
PLAYER_DISCONECT msg 

game on game start:
GAME_STARTED msg -> gameState:STARTED
Round starts in-> xx sec

game on round start:
ROUND_STARTED msg -> roundState:STARTED -> {playerTurn:x}
GAMEROUND_COUNTDOWN-> update countDown
PLAYER_TURN_START
PLAYER_PLAY/PLAYER_PASS->{card:[id1,id2,id3]}
PLAYER_WIN_ROUND:
PLAYER_BECOME_KING:{player:[xx,yy]}
PLAYER_BECOME_PLEB:{player:[xx,yy]}
ROUND_END
Next Round starts in-> xx sec

player on win game:
PLAYER_WIN_GAME
GAME_FINISHED
ROUND:ESPERANDO
*/

