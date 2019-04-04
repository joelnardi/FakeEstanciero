package terrateniente;


import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import terrateniente.datos.DBManager;
import terrateniente.game.GameManager;
import terrateniente.game.User;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
	private int nextId;
    public Login() {
        super();
        nextId = 1;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }
    

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		HttpSession session = request.getSession();
		
		//TODO: use prepared sql statements
		try {
			ResultSet rs = DBManager.execQuery("select ID,nombre from usuarios where email="+"\""+email+"\"" + " and pass=md5("+"\""+password+"\")");
			
			if(rs.next()){
				
			User user = new User(rs.getInt("ID"), rs.getString("nombre"));	
			if(GameManager.getInstance().addUser(user)){
			session.setAttribute("user", user);
			session.setMaxInactiveInterval(15*60);
			rs.close();
			response.getOutputStream().print("OK");
			}
			
			}else{
				response.getOutputStream().print("ERROR");
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		
	}

}
