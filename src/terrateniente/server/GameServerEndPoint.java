package terrateniente.server;
import java.io.IOException;
import java.net.SocketException;

import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import terrateniente.game.GameManager;
import terrateniente.utils.JsonEncoder;



@ServerEndpoint(value="/game",encoders = {JsonEncoder.class},configurator=GameServerConfigurator.class)
public class GameServerEndPoint {
	

	
	@OnOpen
	public void handleOpen(EndpointConfig config,Session userSession){
		GameManager.getInstance().onOpenSocket(userSession);
	}
	
	
	@OnClose
	public void handleClose(Session userSession){
		try {
			userSession.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@OnMessage
	public void handleMsg(String message,Session userSession){
		GameManager.getInstance().handle(userSession, message);
	}
	
	@OnError
	public void onError(Session session, Throwable t){
		try {
			session.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
