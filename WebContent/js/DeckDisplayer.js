function DeckDisplayer(game,ix,iy){
this.container = new createjs.Container();
this.game = game;
this.container.x = ix;
this.container.y = iy; 
this.cards = [];
this.playerCards = [];
this.currentCard;
this.cardInMesa;
this.mesa = [];
this.cardCounts = 0;
this.lockedCount = 0;

this.cardCount = 12*4;
this.game.viewContainer.addChild(this.container);

//AGREGA UNA CARTA A LA MESA
this.playCard = function(target,c,callback){
	//eliminar las ultimas cartas existentes
if(this.container.numChildren > 3){
	this.container.removeChildAt(0);
}
	var prevParent = c.card.parent;
	var xo = prevParent.x + c.card.x;
	var yo = prevParent.y + c.card.y;
	prevParent.removeChild(c.card);
	target.remove(c);
	mainStage.addChild(c.card);
	c.card.x = xo;
	c.card.y = yo;
	this.container.x = ix;
	this.container.y = iy;
//	target.setOnTop(c.card);
	c.disable_listener();
var nextX = this.getNextX(); 
//animacion
c.moveTo(this.container.x + nextX,this.container.y,()=>{
if(target != this.game.player)
c.show();
c.card.x = nextX;//this.getNextX();
c.card.y = 0;
mainStage.removeChild(c.card);
this.container.addChild(c.card);
this.mesa.push(c);
//animacion finalizada
callback();
})
}

//determina la ubicacion de la carta en la mesa
this.getNextX = function(){
	var mult = (this.mesa.length%2 == 0) ? ((this.mesa.length != 0) ? 112.5 : 0) : -225;
	return this.mesa.length *  mult;
}


this.mesaReset = function(){
	this.mesa = [];
}

this.newRound = function(){
	this.mesa = [];
	this.container.removeAllChildren();
}

//Asigna las cartas correspondientes a los jugadores
this.drawStart = function(pCards){
this.playerCards = [];
this.cards = [];
var len = pCards.length;
for(var i=0;i<len*3;i++){
this.cards.push(CardManager.getInstance().createCard(0));
}
for(var i=0;i<len;i++){
this.playerCards.push(CardManager.getInstance().createCard(pCards[i]));
}

if(this.game.currentHand() == this.game.player){
this.currentCard = this.playerCards.pop();
}else{
this.currentCard = this.cards.pop();
}
this.container.addChild(this.currentCard.card);
}


this.isEmpty = function(){
return this.cardCount == 0;
}


this.onEnd = function(){}

//realiza la animacion para repartir las cartas y llama a la funcion onEnd cuando finalizo de repartir
this.repartir = function(target){
if(target == this.game.player){
this.currentCard.show();
}
createjs.Tween.get(this.container).to({x:target.getNextX(),y:target.getNextY()},150).call(()=>{
target.addCardToEnd(this.currentCard);
if(this.game.next() == this.game.player){
this.currentCard = this.playerCards.pop();
}else{
this.currentCard = this.cards.pop();
}

if(this.currentCard == undefined) {
this.onEnd();
return;
}
this.container.removeChildAt(0);
this.container.addChild(this.currentCard.card);
this.container.x = ix;
this.container.y = iy;
target.onEndDraw();
})
}


}
