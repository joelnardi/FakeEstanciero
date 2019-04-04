package terrateniente.game;

import java.util.ArrayList;
import java.util.HashMap;

import javax.json.JsonValue;
import javax.websocket.Session;

public class Player {
	private User user;
	private boolean roundPassed;
	private int cards[];
	private int turnOrder;
	private boolean playedThisTurn;
	private boolean elite;
	private Player pleb;
	
	Player(User user){
	this.user = user;
	roundPassed = false;
	cards = new int[12];
	elite = false;
	}
	
	void setTurnOrder(int order) {
		this.turnOrder = order;
	}
	
	public int[] getTwoMinCard(){
		int min1 = 99;
		int min2 = 99;
		
		for(int i=0;i<cards.length;i++){
			if(cards[i] == -1) continue;
			if(cards[i] <= min1){
				min1 = cards[i];
			}else if(cards[i] <= min2){
				min2 = cards[i];
			}
		}
		int[] out = new int[2];
		out[0] = min1;
		out[1] = min2;
		return out;
	}
	
	public int[] getTwoMaxCard(){
		int max1 = -1;
		int max2 = -1;
		
		for(int i=0;i<cards.length;i++){
			if(cards[i] == -1) continue;
			if(cards[i] >= max1){
				max1 = cards[i];
			}else if(cards[i] >= max2){
				max2 = cards[i];
			}
		}
		int[] out = new int[2];
		out[0] = max1;
		out[1] = max2;
		return out;
	}
	
	public void exchange(int targetCard,int newCard){
		for(int i=0;i<cards.length;i++){
			if(cards[i] == targetCard){
				cards[i] = newCard;
				return;
			}
		}
	}
	
	public int getTurnOrder() {
		return this.turnOrder;
	}
	
	void addCards(int[] cards){
		System.out.println("player cards");
		for(int i=0;i<cards.length;i++){
			System.out.print(cards[i] + "-");
		}
		
		this.cards = cards;
	}
	
	User getUser() {return this.user;}
	
	public boolean playCard(int cardID,int count) {		
		return removeCard(cardID,count);
	}
	
	private boolean removeCard(int cardID,int count) {
		int removed = 0;
		int c = countCards(cardID);
		if(c < count) return false;
		for(int i=0;i<cards.length;i++) {
			if(cards[i] == cardID) {
				cards[i] = -1;
				removed++;
			}
			if(removed == count) 
				break;
		}
		playedThisTurn = true;
		return true;
	}
	
	public int countCards(int cardID) {
		int count = 0;
		for(int i=0;i<cards.length;i++) {
			if(cards[i] == cardID)
				count++;
		}
		return count;
	}
	
	public HashMap<Integer,Integer> countBiggerThan(int cardID) {
		HashMap<Integer,Integer> moves = new HashMap<Integer,Integer>();
		
		for(int i=0;i<cards.length;i++){
			if(cards[i] > cardID) {
				if(moves.containsKey(cards[i])) {
					int count = moves.get(cards[i]);
					count++;
					moves.put(cards[i], count);
				}else {
					int count = 1;
					moves.put(cards[i],count);
				}
			}
		}
		return moves;
	}
	
	
	public HashMap<Integer,Integer> getEqual(int cardID) {
		HashMap<Integer,Integer> moves = new HashMap<Integer,Integer>();
		
		for(int i=0;i<cards.length;i++){
			if(cards[i] == cardID) {
				if(moves.containsKey(cards[i])) {
					int count = moves.get(cards[i]);
					count++;
					moves.put(cards[i], count);
				}else {
					int count = 1;
					moves.put(cards[i],count);
				}
			}
		}
		return moves;
	}
	
	
	public int getCardCount() {
			int count = 0;
			for(int i=0;i<cards.length;i++)
				count += cards[i] == -1 ? 0 : 1;
			return count;
	}
	
	public void passTurn(){
		playedThisTurn = false;
	}
	
	public boolean hadPlayed(){
		return playedThisTurn;
	}
	
	public void passRound() {
		this.roundPassed = true;
	}
	
	public boolean hadPassedRound() {
		return this.roundPassed;
	}
	
	public void setElite(){
		this.elite = true;
	}
	
	public boolean isElite(){
		return this.elite;
	}
	
	public void resetRound() {
		this.roundPassed = false;
		this.playedThisTurn = false;
	}
	
	public Session getSession() {
		return user.getSocketSession();
	}
	
	public class Card{
		public int id;
		public int count;
	}

	public String getUserName() {
		// TODO Auto-generated method stub
		return user.getUserName();
	}

	public int getID() {
		
		return user.getID();
	}
	
	public int[] getCards() {
		System.out.println("Getting cards" + user.getUserName());
		return this.cards;
	}

	public void setPleb(Player pleb) {
		this.pleb = pleb;
	}
	
	public Player getPleb(){
		return this.pleb;
	}

	

}
