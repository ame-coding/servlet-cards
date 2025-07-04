package backend;


import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;


public class signup extends HttpServlet {

  Data db = new Data();
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            String xmlS = req.getParameter("xml");
            System.out.println("XML from Signup.jsp: " + xmlS);

            if (xmlS == null) throw new Exception("no xml from jsp");

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlS)));
            String user = doc.getElementsByTagName("user").item(0).getTextContent();
            String pass = doc.getElementsByTagName("pass").item(0).getTextContent();

            System.out.println("User: " + user);


            try (Connection c = db.connectdb()) {
               
                PreparedStatement ps = c.prepareStatement(
                    "SELECT type FROM users WHERE user = ?");
                ps.setString(1, user);

                ResultSet rs = ps.executeQuery();
                
                if (rs.next()) {
                    out.println("<?xml version=\"1.0\"?>");
                    out.println("<response>");
                    out.println("<message>User exists</message>");
                    out.println("</response>");
                    rs.close();
                    ps.close();
                    return;
                }
                rs.close();
                ps = c.prepareStatement(
                    "INSERT INTO users (user, password, type) VALUES (?, ?, 'player');");
                ps.setString(1, user);
                ps.setString(2, pass);

                ps.executeUpdate();
                
                ps.close();

                Cookie userc = new Cookie("user", user);
                Cookie typec= new Cookie("type", "player");
                res.addCookie(userc);
                res.addCookie(typec);

                out.println("<?xml version=\"1.0\"?>");
                out.println("<response>");
                out.println("<message>Signing up</message>");
                out.println("</response>");

            }

        } catch (Exception e) {
           res.setStatus(500);
        e.printStackTrace();

        out.println("<?xml version=\"1.0\"?>"); 
        out.println("<response>");
        out.println("<message>Problem with Sign.java</message>");
        out.println("</response>");
        } finally {
            out.close();
        }
    }


}
