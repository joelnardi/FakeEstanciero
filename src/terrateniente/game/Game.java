package terrateniente.game;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Random;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.websocket.Session;

import terrateniente.utils.ITimer;
import terrateniente.utils.MessageUtils;
import terrateniente.utils.Timer;


public class Game {
	
	
	public static final int NOT_INGAME = -1;
	public static final int MAX_PLAYERS = 4;
	
	private int gameID;
	private ArrayList<Player>players;
	private ArrayList<Player>elites;
	private boolean ended = false;
	private int currentTurn;
	private boolean firstRound;
	private boolean elitedraw;
	int usersPassed;
	int turnCounter;
	
	
	private Mesa mesa;
	
	private long startTime;
	private Timer timer;
	//TODO: add game logic
	
	Game(int gameID,Session s){
		this.gameID = gameID;
		players = new ArrayList<Player>();
		elites = new ArrayList<Player>();
		addPlayer(s);
	
		//MessageUtils.sendCmdMessage(u.getSocketSession(), "room_created");
		//System.out.println("Game created with id:"+this.gameID);
		startTime = System.currentTimeMillis();
		timer = new Timer(1000);
		firstRound = true;
		elitedraw = false;
		
		usersPassed = 0;
		
		mesa = new Mesa();
		
		//timer.set(5000);
	}
	
	
	
	public int getID(){
		return gameID;
	}
	
	//TODO IMPLEMENT
	private void sendGameState(Session s){
		Player player = (Player)s.getUserProperties().get("player");
		JsonObjectBuilder job = Json.createObjectBuilder()
				.add("player", Json.createObjectBuilder()
						.add("playerID", player.getID())
						.add("playOrder", player.getTurnOrder())
						.add("name", player.getUserName()));
				//job.add("state",GAMESTATE.WAITING.getValue());
		JsonArrayBuilder jab = Json.createArrayBuilder();
		for(Player p : players){
			if(p.getID() == player.getID()) continue;	
			 jab.add(
					Json.createObjectBuilder()
						.add("playerID", p.getID())
						.add("playOrder",p.getTurnOrder())
						.add("name", p.getUserName()).build());
		}
		job.add("enemy",jab.build());
				MessageUtils.sendCmdMessage(player.getSession(), "game_data", job.build());		
	}
	
	private void cardGenerate() {
		int nCards = 12;
		for(int i=0;i<players.size();i++) {
			int card[] = new int [nCards];
			Random r = new Random();
			for(int j=0;j<card.length;j++) {
				card[j] = r.nextInt(7)+1;
			}
			players.get(i).addCards(card);
		}
	}
	
	
	private void resetMatch(){
		//CLEAR HANDS
		for(Player p : players)
		MessageUtils.sendCmdMessage(p.getSession(), "new_match");
		firstRound = true;
		elitedraw = true;
		initRound();
		
	}
	
	private void initRound(){
		turnCounter = 0;
		usersPassed = 0;
		mesa.reset();
		for(Player p : players){
			p.resetRound();
		}
		
		if(firstRound) {
		currentTurn = (int) Math.floor(Math.random()*players.size());
		cardGenerate();
		}
		
		timer.timerlistener = new ITimer() {
			
			@Override
			public void onRestart() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInterval() {
				showMessageBroadcast(String.valueOf(timer.getTime()), 100, 1000, "#FF0000", 0, true);
				
			}
			
			@Override
			public void onInit() {
				// TODO Auto-generated method stub
				showMessageBroadcast("La ronda comienza en",80,1200,"#00FFFF",0,false);		

			}
			
			@Override
			public void onEnd() {
		
					if(firstRound) {	
				for(int i=0;i<players.size();i++) {
		JsonArrayBuilder arr = Json.createArrayBuilder();
		int[] c = players.get(i).getCards().clone();
		for(int j=0;j<c.length;j++) {
		arr.add(c[j]);
		}
		JsonObject jo2 = Json.createObjectBuilder()
				.add("turn", currentTurn)
				.add("draw",arr.build()).build();
		MessageUtils.sendCmdMessage(players.get(i).getSession(),"draw_start",jo2);
		}
		firstRound = false;		
			}else {
				startTurn();
			}
		}
	
		};	
		timer.set(5000);
	}
	

	
	private void sendUserJoin(Player player){
		JsonObject jo = Json.createObjectBuilder()
		.add("playerID", player.getID())
		.add("playOrder", player.getTurnOrder())
		.add("name", player.getUserName()).build();
		for(Player p:players){
		if(p.equals(player)) continue;
			MessageUtils.sendCmdMessage(p.getSession(),"user_join",jo);
			showMessage(p.getSession(),player.getUserName() + " entro a la sala",80,1200,"#00FFFF",0,false);
		}
		if(players.size() == MAX_PLAYERS){
			timer.timerlistener = new ITimer() {
				
				@Override
				public void onRestart() {
					// TODO Auto-generated method stub
					
				}
				
				@Override
				public void onInterval() {
					// TODO Auto-generated method stub
					
				}
				
				@Override
				public void onInit() {
					// TODO Auto-generated method stub
			//		showMessageBroadcast("La partida esta por comenzar",80,1500,"#00FFFF",1200,false);
				}
				
				@Override
				public void onEnd() {
					// TODO Auto-generated method stub
					initRound();
					
				}
			};
			timer.set(2500);
		}
		}
	
	public void addPlayer(Session s){
		User user = (User) s.getUserProperties().get("user");
		Player player = new Player(user);
		s.getUserProperties().put("player", player);
		players.add(player);
		player.setTurnOrder(players.indexOf(player));
		user.setRoomID(gameID);
		MessageUtils.sendCmdMessage(player.getSession(), "room_created");
	
		
		sendUserJoin(player);
	}
	
	public void userLeave(User u){
		//System.out.println("User: " + u.getUserName() + " disconected ");
		//TODO: send leave msg to all users
	}
	
	public void userReconect(User user){
		//TODO
		
	}
	

	
	public boolean isFull(){
		return players.size() == MAX_PLAYERS;
	}
	

	public int getPlayerCount() {
		return players.size();
	}
	
	public boolean finished(){
		return ended;
	}
	
	private void prepareExchange(){
		
		for(Player p : players){
		if(p.isElite()){
			Player sub = p.getPleb();
			sendExchange(p,sub);
			sendExchange(sub,p);
		}	
		}
		
	}
	
	private void sendExchange(Player p1,Player p2){
		
		int min[] = (p1.isElite()) ?  p1.getTwoMinCard() : p1.getTwoMaxCard();
		int max[] = (p2.isElite()) ?  p2.getTwoMinCard() : p2.getTwoMaxCard();
		JsonArrayBuilder arrmin = Json.createArrayBuilder();
		JsonArrayBuilder arrmax = Json.createArrayBuilder();
		
		for(int i=0;i<2;i++){
			arrmin.add(min[i]);
			arrmax.add(max[i]);
			p1.exchange(min[i], max[i]);
			p2.exchange(max[i], min[i]);
		}
		JsonArrayBuilder container = Json.createArrayBuilder();
		container.add(arrmin.build());
		container.add(arrmax.build());
		
	//	JsonObject exchange = Json.createObjectBuilder()
	//			.add("exchange", container.build()).build();
		JsonArrayBuilder group1 = Json.createArrayBuilder()
				.add(elites.get(0).getTurnOrder())
				.add(elites.get(0).getPleb().getTurnOrder());
		JsonArrayBuilder group2 = Json.createArrayBuilder()
				.add(elites.get(1).getTurnOrder())
				.add(elites.get(1).getPleb().getTurnOrder());
		JsonObject out = Json.createObjectBuilder()
				.add("group1", group1.build())
				.add("group2", group2.build())
				.add("exchange", container.build()).build();
		//System.out.println(out.toString());
		MessageUtils.sendCmdMessage(p1.getSession(), "make_exchange", out);
	}
	
	private void sendRoundData(Session s) {
	if(elitedraw){
		elitedraw = false;
		prepareExchange();
		return;
		}
		//Player player = (Player) s.getUserProperties().get("player");
		
		JsonObject obj = Json.createObjectBuilder().add("index",currentTurn).build();
		MessageUtils.sendCmdMessage(s, "turn_start", obj);
	}

	private void sendCardPlayed(Session s,int cardID) {
		Player player = (Player)s.getUserProperties().get("player");
		if(mesa.addCard(cardID)) {
		player.playCard(cardID,1);	
		
		int playerIndex = player.getTurnOrder();
		JsonObject jo = Json.createObjectBuilder()
				.add("cardID", cardID)
				.add("userIndex", playerIndex).build();
		for(Player p:players){
				MessageUtils.sendCmdMessage(p.getSession(),"play_card",jo);
			}
		checkMoves(player);
		}
		}
	
	
	private void sendMatchWinner(Player p) {
		elites.add(p);
		p.setElite();
		showMessageBroadcast(p.getUserName() +" pertenece ahora a la ELITE", 80, 1200, "#FF0000", 0, false);

		timer.timerlistener = new ITimer() {
			
			@Override
			public void onRestart() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInterval() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInit() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onEnd() {
				// TODO Auto-generated method stub
				if(elites.size() == 2){
					//FINALIZAR LA PARTIDA Y EMPEZAR OTRA DE CERO
					int count = 99;
					Player lastPleb = null;
					for(Player p : players){
						if(p.isElite()) continue;
						if(p.getCardCount() < count){
							lastPleb = p;
							count = p.getCardCount();
						}
					}
					elites.get(1).setPleb(lastPleb);
					for(int i=0;i<players.size();i++){
						if(players.get(i).isElite() || players.get(i).equals(lastPleb)) continue;
						elites.get(0).setPleb(players.get(i));
					}
					resetMatch();
				}else {
					nextTurn();
				}
			}
		};
		timer.set(2000);
	}
	
	
	private void sendPassTurn(Session s){
		if(turnCounter == 0) mesa.endFirstPlay();
		mesa.endPlay();
		turnCounter++;
		nextTurn();
	}
	
	private void sendPassRound(Session s){
		Player p = (Player)s.getUserProperties().get("player");
		p.passRound();
		sendPassTurn(s);
	}
	
	private void sendRoundWinner(Player p) {
		for(Player player : players) {
			player.resetRound();
		}
		showMessageBroadcast(p.getUserName() +" gano esta ronda", 80, 1200, "#FF0000", 0, false);
		timer.timerlistener = new ITimer() {
			
			@Override
			public void onRestart() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onInterval() {
				// TODO Auto-generated method stub
				for(Player p : players){
				MessageUtils.sendCmdMessage(p.getSession(), "new_round");
				}
			}
			
			@Override
			public void onInit() {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public void onEnd() {
				// TODO Auto-generated method stub
				initRound();
			}
		};
		timer.set(2000);
	}
	
	private Player checkWinner(){
		int pass = 0;
		Player winner = null;
		for(int i=0;i<players.size();i++){
			if(players.get(i).hadPassedRound()){
				pass++;
				continue;
			}
				winner = players.get(i);
			
		}
		if(pass == (players.size() -1)) {
			return winner;
		}
		return null;
	}
	
	private Player checkMatchWinner(){
		try {
		for(Player p : players){
			if(p.isElite()) continue;
			if(p.getCardCount() == 0){
				return p;
			}
		}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	
	private void nextTurn(){
	//	if(usersPassed == 3) {
	//		sendRoundWinner(players.get(currentTurn));
	//		return;
	//	}
		Player matchWinner = checkMatchWinner();
		if(matchWinner != null){
		//System.out.print("Sendin match winner");
			sendMatchWinner(matchWinner);
			//nextTurn();
			return;
		}
		
		
		currentTurn = (currentTurn + 1) % players.size();
		Player winner = checkWinner();
		if(winner != null){
		sendRoundWinner(winner);
			return;
		}
		
		
		if(!mesa.canPlay(players.get(currentTurn))){
			players.get(currentTurn).passRound();
		//	usersPassed++;
			nextTurn();
		}else{
			startTurn();
		}
	    
	   }
	
	
	private void startTurn() {
		for(Player p : players){
			sendRoundData(p.getSession());
		}
	}
	
	private void showMessage(Session s,String message,int fontSize,int time,String color,int wait,boolean expand){
		JsonObject jo = Json.createObjectBuilder()
				.add("msg", message)
				.add("time",time)
				.add("fontSize", fontSize)
				.add("wait", wait)
				.add("color",color).build();
		
		if(expand) {
			MessageUtils.sendCmdMessage(s, "show_message_expand",jo);
		}else{
			MessageUtils.sendCmdMessage(s, "show_message",jo);

		}
	}
	
	private void showMessageBroadcast(String message,int fontSize,int time,String color,int wait,boolean expand){
		JsonObject jo = Json.createObjectBuilder()
				.add("msg", message)
				.add("time",time)
				.add("fontSize", fontSize)
				.add("wait", wait)
				.add("color",color).build();
		
		if(expand) {
			for(Player s : players) {
			MessageUtils.sendCmdMessage(s.getSession(), "show_message_expand",jo);
			}
		}else{
			for(Player s : players) {
				MessageUtils.sendCmdMessage(s.getSession(), "show_message",jo);
				}
			

		}
		
		
	}
	
	
	
	public void checkMoves(Player player){
	
		if(!mesa.canPlay(player)){
		//	System.out.println("moves empty passing turn");
			sendPassTurn(player.getSession());
			return;
		}
	
	}
	
	private void sendLockedHand(Session s) {
		MessageUtils.sendCmdMessage(s, "hand_locked");
	}

	public void update() {
		float dt = System.currentTimeMillis() - startTime;
		startTime = System.currentTimeMillis();
		timer.update(dt);
	}
	
	
	public void handle(Session s, String msg){
		try{
			JsonReader jr = Json.createReader(new StringReader(msg));
			JsonObject object = jr.readObject();
			String cmd = object.getString("cmd");
			jr.close();
			switch(cmd){
			//SE LLAMA CUANDO EL CLIENTE SE CONECTA A LA SALA
			case "get_state":
				sendGameState(s);
				break;
			case "play_card":
				int cardID = object.getInt("cardID");
			sendCardPlayed(s, cardID);
				break;
			case "end_turn":
			
				break;
			//se llama cuando un cliente termino la animacion de repartir
			case "end_draw":
				sendRoundData(s);
			break;	
				default:
					break;
			}
		}catch(Exception e){
			
		}
	}
	
	

	
}
