let GAME_CREATION_SUCCESS = "room_created";
let GAME_CREATION_FAILED = "room_creation_failed";
let ROOM_LIST        = "room_list";
let JOIN_ROOM_SUCCESS = "joined_room";
let JOIN_ROOM_FAILED = "join_room_fail";




class menuView extends View{
	
	constructor()
	{
		super(true);
		this.viewContainer = new createjs.Container();
		this.initialize();
		
	}
	
	initialize(){
		let viewWidth = 525;
		let viewHeight = 530;
		
		
		let spriteSheet = new createjs.SpriteSheet({
	        images: ["img/btn.png"],
	        frames: {width:668, height:223},
	        animations: {
	            btn:0
		}
		});
			
	//CREACION DE BOTONES DEL MENU		
	let sp = new createjs.Sprite(spriteSheet);
	sp.gotoAndStop("btn");

	let bs = new createjs.Shape();
	bs.graphics.beginFill("blue").rect(0,0,viewWidth,170);
	sp.hitArea = bs;
	sp.scaleX = viewWidth/668;
	sp.scaleY = 170/223;

	let butt = new createjs.Container();
	
	butt.addChild(sp);
	let text1 = new createjs.Text("Crear Sala","65px Arial","#FFFF00");
	let b = text1.getBounds();
	text1.x =   (viewWidth/2 - b.width/2);   
	text1.y =  (170/2 - b.height/2);
	butt.addChild(text1);
	
	
	this.viewContainer.addChild(butt);
	
	
		
		let butt2 = butt.clone(true);
		 let txt = butt2.getChildAt(1);
		 butt2.y = 175;
		 
		 txt.text = "Unirse a Partida";
			 b = txt.getBounds();
			txt.x =   (525/2 - b.width/2); 
			txt.y =  (170/2 - b.height/2) ;
			
		 this.viewContainer.addChild(butt2);
			
		 let butt3 = butt2.clone(true);
		  txt = butt3.getChildAt(1);
		 butt3.y = 175*2;
		 
		 txt.text = "Salas";
			 b = txt.getBounds();
			txt.x =   (525/2 - b.width/2); 
			txt.y =  (170/2 - b.height/2) ;
			
		 this.viewContainer.addChild(butt3);
		
		//LISTENERS BOTONES	
			//LISTAR SALAS
		butt3.on("click",function(){
			//ws.send("{'cmd':'list_rooms'}");
			ViewManager.getInstance().setView(new listarSalasView());
			
		});
			//UNIRSE A SALA
		butt2.on("click",function(){
			var obj = {"cmd":"join_room"}
			ws.send(JSON.stringify(obj));
			//console.log("click bitch");
		});
			//CREAR SALA
		butt.on("click",function(){
		//mycanvas.webkitRequestFullscreen();
		//screen.orientation.lock('landscape');
		var obj = {"cmd":"create_room"}
		ws.send(JSON.stringify(obj));
	});
		
	text1 = new createjs.Text("Usuarios online: ","45px Arial","#FFFF00");
	b = text1.getBounds();
	text1.x =   (-1000/2 + b.width/2);   
	text1.y =  (170/2 - b.height/2);
	
	
	//this.viewContainer.addChild(text1)
	
	mainStage.addChild(this.viewContainer);
	
	
	}
	
	
	handle(msg){
		let data = JSON.parse(msg.data);
		let cmd = data.cmd;
		switch (cmd){
		case GAME_CREATION_SUCCESS:
			ViewManager.getInstance().setView(new gameView());
			break;
		case GAME_CREATION_FAILED:
		case ROOM_LIST:
		case JOIN_ROOM_SUCCESS:
			ViewManager.getInstance().setView(new gameView());
			break;
		case JOIN_ROOM_FAILED:
		default:
		ViewManager.getInstance().handleUnknown(msg);
		}
	}
}
