package terrateniente.datos;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DBManager {
	
	// JDBC driver name and database URL
    static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
    static final String DB_URL="jdbc:mysql://localhost:3306/terrateniente";
    
    //  Database credentials
    static final String USER = "root";
    static final String PASS = "1234";

    
	private static Connection connect() throws SQLException{
	
	         // Register JDBC driver
	         try {
				Class.forName("com.mysql.jdbc.Driver");
			} catch (ClassNotFoundException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

	         // Open a connection
	         Connection conn = DriverManager.getConnection(DB_URL, USER, PASS);
	         return conn;
		
		
	}

	public static ResultSet execQuery(String query) throws SQLException{
		Connection conn = connect();
		if(conn == null) return null;
		Statement stmt;
		
		try {
			stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(query);
		
			return rs;
		} catch (SQLException e) {
			// TODO Auto-generated catch block
		
			e.printStackTrace();
		}
		return null;
		
	}
	
	public static int updateQuery(String sqlQuery) throws SQLException  {
		Connection conn = connect();
		if (conn == null)
			return -1;
		
			Statement stmn = conn.createStatement();
			return stmn.executeUpdate(sqlQuery);
		
	}
	
}
