
package backend.admin;

import backend.Data;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
public class delete extends HttpServlet {
Data db = new Data();
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try (Connection c = db.connectdb()) {

            PreparedStatement ps = c.prepareStatement(
                "SELECT user, type FROM users"
            );

            ResultSet rs = ps.executeQuery();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<table>");

            int i = 1;

            while (rs.next()) {
                String user = rs.getString("user");
                String type = rs.getString("type");

                out.println("<id i=\"" + i + "\">");
                out.println("<user>" + user + "</user>");
                out.println("<type>" + type + "</type>");
                out.println("</id>");

                i++;
            }

            out.println("</table>");

            rs.close();
            ps.close();

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with delete.java</message>");
            out.println("</response>");
        } finally {
            out.close();
        }


    }
}
