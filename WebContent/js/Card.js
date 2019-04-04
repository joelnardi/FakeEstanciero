function Card(spriteSheet,id){
this.width = 150;
this.height = 225;
this.id = id;
this.listener;
this.played = false;
/*var spriteSheet = new createjs.SpriteSheet({
//absolute path /App/img/cardSprite.png
        images: ["img/cardSprite.png"],
        frames: {width:100, height:150},
        animations: {
            back:9
        }
})
*/
//this.card = new createjs.Container();
this.card = new createjs.Sprite(spriteSheet,"back");
this.card.stop();
if(this.id != undefined){
var hit = new createjs.Shape();
			hit.graphics.beginFill("#000").drawRect(0, 0, this.width,this.height);
			
this.card.hitArea = hit;
}

this.disable = function(){
	if(this.listener == undefined) return;
	this.card.alpha = 0.5;
	this.card.off("click",this.listener);
	this.listener = undefined;
	this.isDisabled = true;
}

this.disable_listener = function(){
	this.card.off("click",this.listener);
}

this.onclick = function(param){}

this.enableListener = function(){
this.card.alpha = 1;
this.isDisabled = false;
this.listener = this.card.on("click",()=>{
//callback(this);
this.onclick(this);
});
	
}



//if(rotation != undefined)
//this.card.rotation = rotation;
this.dx = this.width/2 + this.width * 0.1;

this.card.scaleX = 1.5;
this.card.scaleY = 1.5;

this.show = function(){
if(this.id == undefined) return;
createjs.Tween.get(this.card,{override:true}).to({scaleX:0.1},200).call(() => {
this.card.gotoAndStop(this.id);
createjs.Tween.get(this.card).wait(50).to({scaleX:1.5},200);
});
}

this.hide = function(){
	createjs.Tween.get(this.card,{override:true}).to({scaleX:0.1},200).call(() => {
this.card.gotoAndStop("back");
createjs.Tween.get(this.card).wait(50).to({scaleX:1.5},200);
});
}

this.hideNoAnim = function(){
this.card.gotoAndStop("back");
}

this.showNoAnim = function(){
	this.card.gotoAndStop(this.id);
}

this.moveTo = function(_x,_y,callback){
createjs.Tween.get(this.card,{override:true}).to({x:_x,y:_y},350).call(callback);
}

}