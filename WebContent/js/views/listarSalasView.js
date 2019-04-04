class listarSalasView extends View{

constructor(){
super(false);
//var embed = '<li>		<div class="item">		<div class="room-name"><span>Sala 000</span></div>		<div class="room-players"><span>Jugadores:0/0</span></div>		</div>		</li>				</ul>	</nav></div>'
var nv = document.createElement("nav");
this.contenedor = document.createElement("ul");
nv.append(this.contenedor);
this.contenedor.innerHTML = "";
//el.innerHTML = embed;
container.append(nv);

var obj = {
		"cmd": "list_room"
	}
		ws.send(JSON.stringify(obj));

}

addElement(numerosala,jugadores){
	var embed = '<li>		<div class="item">		<div class="room-name"><span>Sala </span><span class="nro-sala">'+numerosala  +'</span></div>		<div class="room-players"><span>Jugadores:'+jugadores+'/4</span></div>		</div>'
	this.contenedor.innerHTML += embed;
}



handle(msg) {
	let data = JSON.parse(msg.data);
	let cmd = data.cmd;
	console.log(msg);
	switch (cmd) {
	
	case "roominfo":
	 var gamedata = data.data.game_data;
	 for(var i=0;i<gamedata.length;i++){
		 this.addElement(gamedata[i].id,gamedata[i].players);
	 }
	 $("li").on("click",(d)=>{
	 var sala =  d.currentTarget.getElementsByClassName("nro-sala")[0].innerText;
	 var obj = {
				"cmd": "join_room_byID",
				"id" : sala
			}
	 		console.log(obj);
				ws.send(JSON.stringify(obj));
	 })
	 break;
	
	case "room_created":
		$("nav").remove();
		ViewManager.getInstance().setView(new gameView());
		break;
	 
	default:
		ViewManager.getInstance().handleUnknown(msg);
	
	}
	
}
	



onresize(){}

}