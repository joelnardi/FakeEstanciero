class CardManager{
	
	static getInstance(){
		if(this.instance == undefined){
			this.instance = new CardManager();
		}
		return this.instance;
	}
	
	constructor(){
		this.spriteSheet = new createjs.SpriteSheet({
        images: ["img/cardSprite.png"],
        frames: {width:100, height:150},
        animations: {
            back:9
        }
		});
	}
	
	createCard(id){
		return new Card(this.spriteSheet,id);
	}
	
}