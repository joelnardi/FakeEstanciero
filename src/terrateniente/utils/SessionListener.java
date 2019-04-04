package terrateniente.utils;

import javax.servlet.http.HttpSessionEvent;

import terrateniente.game.GameManager;
import terrateniente.game.User;

public class SessionListener implements javax.servlet.http.HttpSessionListener {

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		System.out.println("new session created");
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		GameManager.getInstance().UserDisconectEvent((User)arg0.getSession().getAttribute("user"));
	}

}
