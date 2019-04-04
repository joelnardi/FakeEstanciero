package terrateniente.utils;

import java.io.IOException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.websocket.EncodeException;
import javax.websocket.Session;

public class MessageUtils {
	
	public static void sendCmdMessage(Session s,String cmd){
		
		JsonObject object = Json.createObjectBuilder()
				.add("cmd", cmd).build();
		try {
			s.getBasicRemote().sendObject(object);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (EncodeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public static void sendCmdMessage(Session s,String cmd,JsonObject data){
		JsonObject object = Json.createObjectBuilder()
				.add("cmd", cmd).add("data", data).build();
		try {
			s.getBasicRemote().sendObject(object);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (EncodeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
