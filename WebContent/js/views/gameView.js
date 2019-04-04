
let USER_JOIN = "user_join";
let ROUND_DRAW_START = "draw_start";
let CARD_PLAY = "play_card";
let MAKE_EXCHANGE = "make_exchange";
let LOCK_HAND = "hand_locked";
let VALID_MOVES = "your_moves";
let INVALID_MOVE = "invalid_card_move";

let GAME_DATA = "game_data";
let TURN_START = "turn_start";
let MESSAGE_POPUP = "show_message";
let MESSAGE_POPUP_EXPAND = "show_message_expand";


class gameView extends View {
	//gameID
	constructor() {
		super(false);
		this.viewContainer = new createjs.Container();
		this.initialize();
		$("#mycanvas").removeClass("menu");
		var obj = {
			"cmd": "get_state"
		}
			ws.send(JSON.stringify(obj));
		this.playersCount = 1;
		this.currentCard = -1;
		this.ready = true;
	}

	initialize() {
		this.fullscreen = false;

		let spriteSheet = new createjs.SpriteSheet({

				images: ["img/but_fullscreen.png"],
				frames: {
					width: 70,
					height: 70
				},
				animations: {
					widescreen: 0,
					fullscreen: 1
				}
			});

		let bg = new createjs.Shape();
		bg.graphics.beginFill("#003300").rect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
		this.viewContainer.addChild(bg);

		let sp = new createjs.Sprite(spriteSheet);
		this.expandSprite = sp;
		sp.gotoAndStop("fullscreen");

		let bs = new createjs.Shape();
		bs.graphics.beginFill("blue").rect(0, 0, 200, 200);
		sp.hitArea = bs;
		sp.scaleX = sp.scaleY = 2;

		let butt = new createjs.Container();
		butt.x = TARGET_WIDTH - 70 * 2;
		butt.y = 0;
		butt.addChild(sp);

		butt.on("click", () => {
			if (this.fullscreen) {
				mycanvas.webkitRequestFullscreen()
				sp.gotoAndStop("widescreen");
				screen.orientation.lock('landscape');
			} else {
				document.webkitExitFullscreen()
				sp.gotoAndStop("fullscreen");
			}

			this.fullscreen = !this.fullscreen;
		});

		this.viewContainer.addChild(butt);
		this.hands = [];
		this.player = new HandDisplayer(this, "SOMENAME", 262.5, 1000 - 225, 937.5, 225, 0);
		this.player.isMainPlayer = true;
		this.hands.push(this.player);
		this.hands.push(new HandDisplayer(this, "OPONENT", TARGET_WIDTH - 150, 225, 150, 550, 1));
		this.hands.push(new HandDisplayer(this, "OPONENT", 262.5, 0, 937.5, 225, 2));
		this.hands.push(new HandDisplayer(this, "OPONENT", 0, 225, 150, 550, 3));
		this.deck = new DeckDisplayer(this, TARGET_WIDTH / 2 - 1.3 * 50, TARGET_HEIGHT / 2 - 1.3 * 75)
			mainStage.addChild(this.viewContainer);

	}

	draw(playerCards) {
		this.deck.drawStart(playerCards);
		this.repartir(this.drawTurn);
	}

	doDraw(data) {
		this.drawTurn = this.getAbsIndex(data.turn);
		this.draw(data.draw);
	}

	next() {
		return this.hands[(this.drawTurn + 1) % 4];
	}
	
	currentHand(){
		return this.hands[(this.drawTurn)%4];
	}

	repartir(ind) {
		var index = ind % this.hands.length
			this.hands[index].onEndDraw = () => {

			index++;
			this.drawTurn = index;
			this.repartir(index);
		}
		this.deck.repartir(this.hands[index]);
		this.deck.onEnd = () => {
			//END DRAW ANIMATION
//			aviso al servidor que termine de repartir
			var obj = {
				"cmd": "end_draw"
			};
				ws.send(JSON.stringify(obj));

		}
	}

	clearHands() {
		for (var i = 0; i < this.hands.length; i++) {
			this.hands[i].clear();
		}
	}

	pushCardsToHand(index, cardID) {
		var card = CardManager.getInstance().createCard(cardID);
		if (cardID != undefined) {
			card.showNoAnim();
			//card.enableListener();
		}
		this.hands[index].addCardToEnd(card);

	}

	reconectSetGameState(data) {
		var myHand = data.draw;
		var enemyHand = data.enemy;
		console.log(data);
		for (var i = 0; i < enemyHand.length; i++) {
			for (var j = 0; j < enemyHand[i].count; j++) {
				this.pushCardsToHand(i + 1, 0);
			}
		}
		for (var l = 0; l < myHand.length; l++) {
			this.pushCardsToHand(0, myHand[l]);
		}
	}

	handle(msg) {
		let data = JSON.parse(msg.data);
		let cmd = data.cmd;
		console.log(msg);
		switch (cmd) {
			//A PLAYER JOIN THE ROOM
		case USER_JOIN:
			this.enemy.push(data.data);
			this.addEnemy(data.data.name);
			break;

		case LOCK_HAND:
			this.player.disable();
			break;
/*
		case VALID_MOVES:
			//this.player.setMovePending(data.data)
			
			
		break;*/
		//IF U PLAY A CARD THAT IS NOT ALLOWED
		case INVALID_MOVE:
		console.log("invalid card play");
		this.playedCard = undefined;
		break;
		
		//SOMEONE PLAYED A CARD
	case CARD_PLAY:
		//	console.log(data);
		//	this.playCard(this.player,data.card);
		this.playCardNet(data.data);
		break;
	
	case GAME_DATA:
		this.gameData(data.data);
		break;
	
	case MAKE_EXCHANGE:
	this.makeExchange(data.data);
	break;
//	case "new_round":
//		this.deck.mesaReset();
//		break;

	case ROUND_DRAW_START:
		this.doDraw(data.data);
		break;
	case TURN_START:
		this.turnStart(data.data);
		break;
	case "show_message":
		this.popUpMessage(data.data);
		break;
	case "show_message_expand":
		this.popUpMessageExpand(data.data);
		break;
	
	case "new_round":
		this.deck.newRound();
		break;
	case "new_match":
		this.deck.newRound();
		this.clearHands();
		break;
	default:
		ViewManager.getInstance().handleUnknown(msg);
	}
}

gameData(data) {
	this.playerData = data.player;
	//console.log("my play order is: " + this.playerData.playOrder);
	this.enemy = data.enemy;
	this.player.setName(this.playerData.name);
	for (var i = 0; i < this.enemy.length; i++) {
		//	this.hands[this.getAbsIndex(this.enemy[i].playOrder)].setName(this.enemy[i].name);
		this.getHandByAbsIndex(this.enemy[i].playOrder).setName(this.enemy[i].name);
	}
}

//INDEX IS ABSOLUTE INDEX OF SERVER ORDER
getHandByAbsIndex(index) {
	return this.hands[this.getAbsIndex(index)];
}

addEnemy(name) {
	this.hands[this.playersCount].setName(name);
	this.playersCount++;
}

playCardNet(data) {
	var target = this.getHandByAbsIndex(data.userIndex);
	if (target == this.player) {
		if (this.playedCard != undefined) {
			this.playCard(this.player, this.playedCard);
			this.player.playedThisTurn = true;
		}
	} else {
		var c = target.getRandomCard();
		c.id = data.cardID;
		this.playCard(target, c);
	}
}

sendPlayCard(c) {
	var obj = {
		"cmd": "play_card",
		"cardID": c.id
	};
	ws.send(JSON.stringify(obj));
	//c.played = true;
	//this.playCard(this.player, c);
}

testEnable() {
	var arr = {
		moves: [{
				cardID: 1,
				count: 1
			}
		]
	};
	this.player.enableMoves(arr, (card) => {
		console.log("callback called");
		if (this.playedCard == undefined) {
			this.playedCard = card;
		}
	});
}

playCard(target, c) {
	this.currentCard = c.id;
	this.ready = false;
	this.deck.playCard(target, c, () => {
		target.orderCards();
		this.playedCard = undefined;
	this.ready = true;
	});
}

getAbsIndex(ind) {
	var temp = [0, 1, 2, 3];
	temp.unshift.apply(temp, temp.splice(this.playerData.playOrder));
	return temp.indexOf(ind);
}


turnStart(data) {
	if(!this.ready)
	setTimeout(() => {
	//console.log("reset mesa");
	this.deck.mesaReset();	
	}, 1000);
	var index = this.getAbsIndex(data.index);
	var target = this.hands[index];
	if (target != this.player) {
		this.popUpMessage({
			msg: "Turno de: " + target.text.text,
			fontSize: 80,
			time: 1000,
			color: "#FF00FF"
		});
	} else {
		this.popUpMessage({
			msg: "Es tu turno",
			fontSize: 80,
			time: 1000,
			color: "#FF00FF"
		});
		this.player.playedThisTurn = false;
		this.player.enableMoves();
		//this.player.enableMoves((card) => {
		//		if (this.playedCard == undefined) {
		//			this.playedCard = card;
		//			this.sendPlayCard(this.playedCard);
		//		}
		//	});
		
	
	}
}



passTurn() {
	var obj = {
		"cmd": "end_turn"
	};
	ws.send(JSON.stringify(obj));
}

passRound() {
	var obj = {
		"cmd": "pass_round"
	};
	ws.send(JSON.stringify(obj));
}

popUpMessage(obj) {
	let popUp = new createjs.Text(obj.msg, obj.fontSize + "px Arial", obj.color);
	let bounds = popUp.getBounds();
	popUp.x = (TARGET_WIDTH - bounds.width) / 2;
	popUp.y = (TARGET_HEIGHT - bounds.height) / 2;

	this.viewContainer.addChild(popUp);
	createjs.Tween.get(popUp, {
		override: true
	}).to({
		"alpha": 0
	}, obj.time).call(() => {
		this.viewContainer.removeChild(popUp)

	});
}

popUpMessageExpand(obj) {
	let popUp = new createjs.Text(obj.msg, obj.fontSize + "px Arial", obj.color);
	let bounds = popUp.getBounds();
	popUp.x = (TARGET_WIDTH - bounds.width) / 2;
	popUp.y = (TARGET_HEIGHT - bounds.height) / 2;
	let dx = (TARGET_WIDTH - (bounds.width * 5)) / 2;
	let dy = (TARGET_HEIGHT - (bounds.height * 8)) / 2;

	this.viewContainer.addChild(popUp);
	createjs.Tween.get(popUp, {
		override: true
	}).to({
		"scaleX": 5,
		"scaleY": 5,
		"x": dx,
		"y": dy,
		"alpha": 0
	}, obj.time).call(() => {
		this.viewContainer.removeChild(popUp)
	});
}


onresize() {}


//var data = {group1:[rey1,plebeyo1],group2:[rey2,plebeyo2],exchange:[[minCarta1,minCarta2],[maxCarta1,maxCarta2]]} ejemplo de mensaje de servidor para realizar intercambio
makeExchange(data){
	var group1 = data.group1; //[index1,index2]
	var group2 = data.group2; //[index3,index4]
	var exchange = data.exchange;
	
	this.popUpMessage({
			msg: "Realizando intercambio",
			fontSize: 80,
			time: 2200,
			color: "#00FFFF"
		});
		
	setTimeout(()=>{
	console.log(this);
	this.exchangeAnim(this.getHandByAbsIndex(group1[0]),this.getHandByAbsIndex(group1[1]),exchange[0],exchange[1]);
	this.exchangeAnim(this.getHandByAbsIndex(group2[0]),this.getHandByAbsIndex(group2[1]),exchange[0],exchange[1]);
	},2400);
}


exchangeAnim(target1,target2,arr1,arr2){
	if(target1 == this.player){
		target2.addCardAnim(target1.popCardByID(arr1[0]),true);
		target2.addCardAnim(target1.popCardByID(arr1[1]),true);
		target1.addCardAnim(target2.popRandomCard(arr2[0]));
		target1.addCardAnim(target2.popRandomCard(arr2[1]));
	}else{
		if(target2 == this.player){
			this.exchangeAnim(target2,target1,arr1,arr2);
		}else{
			target1.addCardAnim(target2.popRandomCard(-1));
			target1.addCardAnim(target2.popRandomCard(-1));
			target2.addCardAnim(target1.popRandomCard(-1));
			target2.addCardAnim(target1.popRandomCard(-1));
		}
	}
}

}
