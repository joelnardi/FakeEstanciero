package terrateniente.game;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

public class Mesa {
	private int currentCard;
	private int currentCardCount;
	private int lockedCount;
	private ArrayList<Integer>cartas;
	private ArrayList<Integer>jugada;
	
	Mesa(){
		currentCard = -1;
		currentCardCount = 0;
		lockedCount = 0;
		cartas = new ArrayList<Integer>();
		jugada = new ArrayList<Integer>();
	}
	
	private boolean validMove(int cardID){
		//not is empty
	if(!cartas.isEmpty()){
	if(cardID <= cartas.get(0)) return false;
	//not is empty
	if(!jugada.isEmpty()){
		if(jugada.size() < lockedCount){
			return jugada.get(0) == cardID;
		}else{
			return false;
		}
	}else{
		return true;
	}
	}else{
		if(jugada.isEmpty()){
			return true;
		}else{
			return jugada.get(0) == cardID;
		}
	}
}
	
	boolean canPlay(Player p){
		if(jugada.isEmpty()){
			return true;
		}else{
		if(!cartas.isEmpty()){
			return p.countBiggerThan(cartas.get(0)).size() > 0;
		}else{
			if(jugada.size() < lockedCount){
				return true;
			}
		}
		return false;
	}
	}
	
	boolean addCard(int card){
		if(cartas.isEmpty()){
			if(jugada.size() == 3) return false;
		}else{
			if(jugada.size() == cartas.size()) return false;
		}
		if(validMove(card)){
			jugada.add(card);
			return true;
		}
		return false;
	}
	

	void checkFinishMoves(){
/*
		if(cartas.isEmpty()){
			if(jugada.size() == 3){
				cartas.addAll(jugada);
				jugada.clear();
			}
		}else{
			if(jugada.size() == cartas.size()){
				cartas.clear();
				cartas.addAll(jugada);
				jugada.clear();
			}
		}
		*/
	}
	
	void endPlay(){
		cartas = new ArrayList<Integer>(jugada);
		jugada.clear();
	}
	
	void endFirstPlay(){
		lockedCount = cartas.size();
	}
	
	void reset() {
		cartas.clear();
		jugada.clear();
	}
	
	/*
	HashMap<Integer,Integer> avaibleMoves(Player p) {
		if(jugada.size() == 3){
			endPlay();
			return new HashMap<Integer,Integer>();
		}
	System.out.print("JUGADA SIZE: " + jugada.size());
	System.out.print("Cartas SIZE: " + cartas.size());
	System.out.print("jugada : " + jugada);
	System.out.print("cartas : " + cartas);


		HashMap<Integer,Integer> moves;
		int len = 1;
		if(cartas.isEmpty()){
			if(jugada.isEmpty()){
				return p.countBiggerThan(-1);
			}else{
				moves = p.getEqual(jugada.get(0));
			}	 
		}else{
		if(jugada.isEmpty()){
		moves = p.countBiggerThan(cartas.get(0));
		System.out.println("moves: ");
		System.out.println(moves);
		len = cartas.size();
		}else{
		moves = p.getEqual(jugada.get(0));
		len = cartas.size() - jugada.size();
		}
		}
		
		HashMap<Integer,Integer> realMoves = new HashMap<Integer,Integer>();
		for(Integer s : moves.keySet()) {
			if(moves.get(s) >= len && len > 0 && len <= 3) {
				realMoves.put(s, len);
			}
		}
		return realMoves;
	}
 */
	
	
	
/*	
	boolean addCard(int card){
		if(card < currentCard || currentCardCount > 4) return false;
		if(card == currentCard || currentCard == -1) {
			currentCardCount++;
		}else {
			currentCardCount = 1;
		}
		currentCard = card;
		return true;
	}
	
	int getCardCount(){
		return currentCardCount;
	}
	
	void endFirstPlay() {
		lockedCount = currentCardCount;
		currentCardCount = 0;
	}
	
	
	
	
	*/ 

}
