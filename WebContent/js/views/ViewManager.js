let SET_VIEW = "set_view";

class ViewManager{
	
	constructor(){
		this.currentView = null;
		window.addEventListener("resize",()=>{this.resize();});
		this.resize();
	}
	
	resize(){

		let w = window.innerWidth;
		let h = window.innerHeight;
		
//MODO LANDSCAPE
if(w >= h){

let aspectRatio = TARGET_WIDTH/TARGET_HEIGHT;
let windowRatio = w/h;
let scl = w/TARGET_WIDTH;
if(windowRatio > aspectRatio){
scl = h/TARGET_HEIGHT;
}

mainStage.scaleX = mainStage.scaleY = scl;
mainStage.canvas.width = TARGET_WIDTH * scl;
mainStage.canvas.height = TARGET_HEIGHT*scl;

container.style.width = TARGET_WIDTH * scl + "px";
container.style.height = TARGET_HEIGHT * scl + "px";
//MODO PORTRAIT
}else{
	let aspectRatio = TARGET_WIDTH/TARGET_HEIGHT;
	let windowRatio = h/w;
	let scl = h/TARGET_WIDTH;
	
	mainStage.scaleX = mainStage.scaleY = scl;
	mainStage.canvas.width = TARGET_HEIGHT * scl;
	mainStage.canvas.height = TARGET_WIDTH*scl;

	container.style.width = TARGET_HEIGHT * scl + "px";
	container.style.height = TARGET_WIDTH * scl + "px";
	
	}
if(this.currentView != null)
this.currentView.onresize();
}
	
	setView(v){
		if(this.currentView != null){
			mainStage.removeChild(this.currentView.getContainer());
		}
		this.currentView = v;
		this.resize();
	}
	
	static getInstance(){
		if(this.instance == undefined){
			this.instance = new ViewManager();
		}
		return this.instance;
	}
	
	handleMsg(msg){
		if(this.currentView == null) return;
		this.currentView.handle(msg);
	}
	
	handleUnknown(msg){
		console.log("UNKWNOWN MESSAGE \n");
		console.log(msg);
	}
	
	sendMessage(msg){
		if(this.currentView == null) return;
		this.currentView.handle(msg);
	}
	
	
}