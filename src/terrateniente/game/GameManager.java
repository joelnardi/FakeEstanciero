package terrateniente.game;
import java.io.IOException;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;

import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.servlet.http.HttpSession;
import javax.websocket.EncodeException;
import javax.websocket.Session;

import terrateniente.utils.MessageUtils;




public class GameManager implements Runnable{

	private static GameManager instance = null;
	private ArrayList<User> connectedUsers;
	//BY GAME ID
	private HashMap<Integer,Game> games;
	private Thread mainThread;
	private boolean running = false;
	private int nextGameID = 0;
	
	GameManager(){
		connectedUsers = new ArrayList<User>();
		games = new HashMap<Integer,Game>();
	}
	
	public static GameManager getInstance(){
		if(instance == null){
			instance = new GameManager();
		}
		return instance;
	}
	
	public int getUsersCount(){
		return this.connectedUsers.size();
	}

	//Inicio del Thread (Controlara los updates de las diferentes salas creadas)
		public void start(){
				if(mainThread == null){
				mainThread = new Thread(this);
				running = true;
				mainThread.start();
			}
		}
		
		//Termina el thread
		public void stop(){
			if(mainThread != null){
				System.out.print("thread stoped");
				try {
					running = false;
					mainThread.join();
					mainThread = null;
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		
		public boolean addUser(User u){
		for(User usu : connectedUsers){
			if(usu.getID() == u.getID()){
				return false;
			}
		}
		connectedUsers.add(u);
		return true;
		}
		
		public void onOpenSocket(Session s){
			User u = (User)(s.getUserProperties().get("user"));
			u.setSession(s);
			int roomID = u.getRoomID();
			if(roomID != -1){
				Game game = games.get(roomID);
				if(game.finished())
					return;
				
				game.userReconect(u);
			}
		}
		
		private void createGame(Session s){
			User u = (User) s.getUserProperties().get("user");
			if(u.getRoomID() != -1) return;
			nextGameID++;
			games.put(nextGameID, new Game(nextGameID,s));
			start();
		}
		
		public void joinGame(Session session){
			//User user = (User)session.getUserProperties().get("user");
			Game g = getEmptyGame();
			if(g != null){
				g.addPlayer(session);
			}
		}
				
		private Game getEmptyGame(){
			for(Game g : games.values()){
				if(!g.isFull()){
					return g;
				}
			}
			return null;
		}
	
		
	@Override
	public void run() {
	
		while(running){
			try{
			Thread.sleep(100);	
			for(Game g : games.values()) {
				g.update();
			}
			}catch(InterruptedException e){}

				if(connectedUsers.size() == 0){
					stop();
				}
			}
		}
		
	
	

		
		
		//WHEN THE USER GOES OFFLINE AFTER TIMEOUT
		public void UserDisconectEvent(User user) {
			// TODO Auto-generated method stub
			//System.out.println("User disconected: " + user.getUserName());
			if(user != null){
			connectedUsers.remove(user);
			}
		}
	
		private void list_rooms(Session s){
			JsonArrayBuilder arr = Json.createArrayBuilder();
			for(Game g : games.values()){
				JsonObject jo = Json.createObjectBuilder().add("id",g.getID())
								.add("players",g.getPlayerCount()).build();
				arr.add(jo);
			}
			JsonObject data = Json.createObjectBuilder().add("game_data", arr.build()).build();
			MessageUtils.sendCmdMessage(s, "roominfo", data);
		}
		
		public void handle(Session s, String message){
			try{
				JsonReader jr = Json.createReader(new StringReader(message));
				JsonObject object = jr.readObject();
				String cmd = object.getString("cmd");
				jr.close();
				switch(cmd){
				case "create_room":
					createGame(s);
					break;
				case "join_room":
					joinGame(s);
					break;
				case "join_room_byID":
					String room_id = object.getString("id");
					joinGameById(s,Integer.valueOf(room_id));
					break;
					
				case "list_room":
					list_rooms(s);
					break;	
				default: 
					User user = (User)s.getUserProperties().get("user");
					Game g = games.get(user.getRoomID());
					if(g != null){
						g.handle(s,message);
					}
					break;
				}
			}catch(Exception e){
				e.printStackTrace();
			}
	}

		private void joinGameById(Session s, int id) {
			
			for(Game g : games.values()){
				if(g.getID() == id){
					if(g.isFull()){
						System.out.print("Sala llena");
					}else{
						g.addPlayer(s);
					}
					break;
				}
			}
		}
	
}
