//make sure to add the library for the sql you using
package backend;
import java.io.*;
import java.sql.*;

public class Data {
    private final String dbPath = "D:\\experiment\\db\\natuur.db";

    public Connection connectdb() throws Exception {
        Class.forName("org.sqlite.JDBC");
        System.out.println("Connecting to DB: " + dbPath);
        return DriverManager.getConnection("jdbc:sqlite:" + dbPath);
    }
}
