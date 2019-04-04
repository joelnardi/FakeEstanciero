function HandDisplayer(game,playerName,ix,iy,iw,ih,turn){
this.container = new createjs.Container();
this.text = new createjs.Text(playerName,"40px Arial","#FFFF00");
this.container.x = ix;
this.container.y = iy;
this.cards = [];
this.turn = turn;
this.playedThisTurn = false;
this.game = game;
this.gameView = game.viewContainer;
this.movesPending = [];
this.isMainPlayer = false;


var s = new createjs.Shape();
s.graphics.beginFill("blue").rect(0,0,iw,ih);
//this.container.addChild(s);
//stage.addChild(s);
this.container.addChild(this.text)
this.gameView.addChild(this.container);

if(this.container.x == 0){
this.text.x = 225 - 25;
this.text.rotation = 90;
}
if(this.container.y > TARGET_HEIGHT/2){
this.text.y = -45;
}

if(this.container.y == 0){
this.text.y = ih + 45;
this.text.x = iw;
this.text.rotation = 180;
}

if(this.container.x == TARGET_WIDTH - 150){
this.text.x = -75 + 25;
this.text.y = ih;
this.text.rotation = -90;
}

this.getUserName = function(){
	return this.text.text;
}

this.addCardToEnd = function(c){
if(ih > iw) {
c.card.y = this.cards.length*33;
c.card.x = 0;
}else{
c.card.y = 0;
c.card.x = this.cards.length*75;
}
this.cards.push(c);
this.container.addChild(c.card);
}

this.addCard = function(c){

}

this.remove = function(c){
this.cards.splice(this.cards.indexOf(c),1);
this.container.removeChild(c.card);
}

this.orderCards = function(){
	if(this.cards.length == 0) return;
var cpy = this.cards.slice(0);
if(cpy[0].id != undefined)
cpy.sort(
function(a,b){
return a.id - b.id; 
}
);
else
return;
var inc = 0;
for(var i=0;i<cpy.length;i++){
if(ih < iw){
createjs.Tween.get(cpy[i].card).to({x:inc},200).call(()=>{
 var sortFunction = function(obj1, obj2, options) {
     if (obj1.x > obj2.x) { return 1; }
     if (obj1.x < obj2.x) { return -1; }
     return 0;
 }
 this.container.sortChildren(sortFunction);

});
//this.container.swapChildren(cpy[i].card,this.cards[i].card);
inc+=75;
}else{

createjs.Tween.get(cpy[i].card).to({y:inc},200).call(()=>{
 var sortFunction = function(obj1, obj2, options) {
     if (obj1.y > obj2.y) { return 1; }
     if (obj1.y < obj2.y) { return -1; }
     return 0;
 }
 this.container.sortChildren(sortFunction);

});
//this.container.swapChildren(cpy[i].card,this.cards[i].card);
inc+=33;

}
}
this.cards = cpy;
//this.enable();
}

this.onEndDraw = function(){};

this.removeCardById = function(){

}

this.clear = function(){
	this.container.removeAllChildren();
	this.cards = [];
	this.container.addChild(this.text);
}



this.getNextX = function(){
if(ih > iw) {
return this.container.x;
}else{
return this.cards.length*75;
}
}

this.getNextY = function(){
if(ih > iw) {
return this.cards.length*33;
}else{
return this.container.y;
}
}

this.getNextX_ = function(){
if(ih > iw) {
return this.container.x;
}else{
return (this.cards.length+1)*75;
}
}

this.getNextY_ = function(){
if(ih > iw) {
return (this.cards.length+1)*33;
}else{
return this.container.y;
}
}


this.setName = function(name){
	this.text.text = name;
}

/*
if(rotation != undefined)
this.container.rotation = rotation;
this.scale = 1.5;
stage.addChild(this.container);
this.pushCard = function(c){
this.cards.push(c);
this.container.addChild(c.card);
}
*/

this.pushAnother = function(c){
c.card.x = this.getNextX();
this.pushCard(c);
}

this.getX = function(){
return this.container.x;
}

this.getY = function(){
return this.container.y;
}

this.enable = function(callback){
console.log("enabling bitch");
for(var i=0;i<this.cards.length;i++){
this.cards[i].enableListener(callback);
}
}

this.disable = function(){
for(var i=0;i<this.cards.length;i++){
this.cards[i].disable();
}
}

/*
this.getNextX = function(){
if(rotation == undefined){
return this.cards.length*75;
}else{
if(rotation == 90) 
	return 0;
else
	return TARGET_WIDTH - 150;
}
}

this.getNextY = function(){
if(rotation == 90){
return this.cards.length*33;
}else{
if(rotation == undefined) 
	return TARGET_HEIGHT - 225;
else
	return 0;
}

}
*/

this.canPlay = function(cardID){
	for(var i=0;i<this.cards.length;i++){
		if(this.cards[i].id > cardID) return true;
	}
	return false;
}

this.haveMoves = function(){
		for(var i=0;i<this.cards.length;i++){
			if(!this.cards[i].isDisabled) return true;
		}
		return false;
	
}

this.enableMoves = function(cb){
	this.disable();
	for(var i=0;i<this.cards.length;i++){
	this.cards[i].enableListener();
	this.cards[i].onclick = (c)=>{
		this.game.sendPlayCard(c);
		this.game.playedCard = c;
	}
	}
	/*if(arr == undefined) return false;
	for(var i=0;i<arr.moves.length;i++){
		var card_id = arr.moves[i].cardID;
		var card_count = arr.moves[i].count;
		this.enableCard(card_id,card_count,cb);
	}
	return true;
*/
}

this.enableCard = function(cardID,count,cb){
	var c = 0;
	for(var i=0;i<this.cards.length;i++){
		if(this.cards[i].id == cardID){
			this.cards[i].enableListener(cb);
			c++;
		}
		if(c == count) break;
	}
	
}

this.canPlayMultiple = function(cardID){
	var maxCount = 3;
	for(var i=0;i<this.cards.length;i++){
		if(this.cards[i].id == cardID && maxCount > 0){
			this.cards[i].enableListener();
			maxCount--;
		}
		else
			this.cards[i].disable();
	}
}


this.setOnTop = function(child){
	this.container.setChildIndex(child,this.cards.length);
}

this.getRandomCard = function(){
	return this.cards[Math.floor(Math.random()*this.cards.length)];
}

this.onPlay = function(cardID){
	this.enableMoves(this.movesPending);
	this.movesPending = [];
	this.canPlayMultiple(cardID);
}

this.getCardByID = function(cardID){
	console.log(this.cards);
	for(var i=0;i<this.cards.length;i++){
		if(this.cards[i].id == cardID) 
			return this.cards[i];
	}
	return -1;
}

this.popCardByID = function(cardID){
	for(var i=0;i<this.cards.length;i++){
		if(this.cards[i].id == cardID) 
		return this.cards.splice(this.cards.indexOf(this.cards[i]),1)[0];
	}
	return -1;
}

this.popRandomCard = function(id){
	var c = this.cards.splice(Math.floor(Math.random()*this.cards.length),1)[0];
	//this.container.removeChild(c.card);
	c.id = id;
	return c;
}

this.setMovePending = function(arr){
	this.movesPending = arr;
}

this.addCardAnim = function(carta){
	var prevParent = carta.card.parent;
	var xo = prevParent.x + carta.card.x;
	var yo = prevParent.y + carta.card.y;
	prevParent.removeChild(carta.card);
	mainStage.addChild(carta.card);
	carta.card.x = xo;
	carta.card.y = yo;
	carta.moveTo(this.getNextX() + this.container.x,this.getNextY_(),()=> {
	mainStage.removeChild(carta.card);
	this.addCardToEnd(carta);
	if(this.isMainPlayer){
	carta.showNoAnim();
	}else{
	carta.hideNoAnim();
	carta.id = -1;
	}
	setTimeout(()=>{this.orderCards();},50);
	
	});

}

}