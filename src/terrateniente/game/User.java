package terrateniente.game;

import javax.websocket.Session;

public class User {


	String name;
	int userID;
	int roomID = -1;
	Session session;
	boolean passedTurn = false;
	
	public User(int userID,String name){
		this.name = name;
		this.userID = userID;
	}
	
	@Override
	public String toString(){
		return this.getUserName();
	}
	
	String getUserName(){
		return this.name;
	}
	
	void passTurn(){
		passedTurn = true;
	}
	
	boolean hadPassed(){
		return passedTurn;
	}
	
	void resetTurn(){
		passedTurn = false;
	}
	
	int getID(){
		return this.userID;
	}
	
	public void setRoomID(int id){
		this.roomID = id;
	}
	
	public int getRoomID(){
		return this.roomID;
	}

	public void setSession(Session userSession) {
		this.session = userSession;
	}
	
	public Session getSocketSession(){
		return this.session;
	}
}
