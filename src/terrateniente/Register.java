package terrateniente;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

import javax.json.Json;
import javax.json.JsonObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.mysql.jdbc.exceptions.jdbc4.CommunicationsException;

import terrateniente.datos.DBManager;

/**
 * Servlet implementation class Register
 */
@WebServlet("/Register")
public class Register extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Register() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String pass = request.getParameter("password");
		/*
		 AGREGAR DATOS A TABLA Y GUARDAR RESULTADO
		 */
		String query = "insert into usuarios(email,nombre,pass) values(" + "\"" + email+ "\""+","+"\"" +username+"\"" +", md5(" +"\""+pass+"\""+"));";
		System.out.println(query);
		try{
		int rows = DBManager.updateQuery(query); // Retorna filas cambiadas o		
		response.setContentType("application/json");
		// Get the printwriter object from response to write the required json object to the output stream      
		PrintWriter out = response.getWriter();
		// Assuming your json object is **jsonObject**, perform the following, it will return your json object  
		JsonObject jo = Json.createObjectBuilder().add("ok",0).build();
		out.print(jo);
		out.flush();
		
		}catch(SQLException e){
			
			response.setContentType("application/json");
			// Get the printwriter object from response to write the required json object to the output stream      
			PrintWriter out = response.getWriter();
			// Assuming your json object is **jsonObject**, perform the following, it will return your json object  
			JsonObject jo = Json.createObjectBuilder().add("error",e.getErrorCode()).build();
			out.print(jo);
			out.flush();
			
		
			
		}
	}

}
