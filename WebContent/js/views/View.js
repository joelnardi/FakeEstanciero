 class View{
	
	constructor(lockPortrait){
		if(lockPortrait)
		try{
			screen.orientation.lock("portrait");	
		}catch(e){}
	}
	
	getContainer(){
		return this.viewContainer;
	}
	
	handleMessage(msg){
		console.log(msg);
	}
	
	initialize(){
		
	}
	
	onresize(){
	let w = window.innerWidth;
	let h = window.innerHeight;
	let nw;
	let nh;
	if(w >= h){
		this.landscape = true;
	}else{
		this.landscape = false;
	}
	
	//super.onresize();
	if(this.landscape){
	this.viewContainer.x = (TARGET_WIDTH - this.viewContainer.getBounds().width)/2;	
	this.viewContainer.y = (TARGET_HEIGHT - this.viewContainer.getBounds().height)/2;	
	}else{
	this.viewContainer.x = (TARGET_HEIGHT - this.viewContainer.getBounds().width)/2;
	this.viewContainer.y = (TARGET_WIDTH - this.viewContainer.getBounds().height)/2;		
	}
	}
	
	handle(msg){
		
	}
}