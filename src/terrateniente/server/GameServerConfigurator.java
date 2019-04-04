package terrateniente.server;



import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.*;

import terrateniente.game.User;


public class GameServerConfigurator extends ServerEndpointConfig.Configurator{

	public void modifyHandshake(ServerEndpointConfig sec,HandshakeRequest request,
			HandshakeResponse response){
		HttpSession s = (HttpSession) request.getHttpSession();
		User u = (User) s.getAttribute("user");
		sec.getUserProperties().put("user", u);
		
	}
}
