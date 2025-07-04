package backend;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

public class login extends HttpServlet {
    Data db = new Data();
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            String xmlS = req.getParameter("xml");
            System.out.println("XML from Login.jsp: " + xmlS);

            if (xmlS == null) throw new Exception("no xml from jsp");

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlS)));
            String user = doc.getElementsByTagName("user").item(0).getTextContent();
            String pass = doc.getElementsByTagName("pass").item(0).getTextContent();

            System.out.println("User: " + user);

            String usertype = null;

            try (Connection c = db.connectdb()) {
               
                PreparedStatement ps = c.prepareStatement(
                    "SELECT type FROM users WHERE user = ? AND password = ?");
                ps.setString(1, user);
                ps.setString(2, pass);

                ResultSet rs = ps.executeQuery();

                if (!rs.next()) {
                    out.println("<?xml version=\"1.0\"?>");
                    out.println("<response>");
                    out.println("<message>Invalid login</message>");
                    out.println("</response>");
                    rs.close();
                    ps.close();
                    return;
                }

                usertype = rs.getString("type");

                ps = c.prepareStatement(
                    "SELECT ban FROM bans WHERE user = ?");
                ps.setString(1, user);

                rs = ps.executeQuery();

                if (rs.next()) {
                    String banMsg = rs.getString("ban");
                    

                    out.println("<?xml version=\"1.0\"?>");
                    out.println("<response>");
                    out.println("<message>You are banned: " + banMsg+"</message>");
                    out.println("</response>");
                    return;
                }

                rs.close();
                ps.close();


                Cookie userc = new Cookie("user", user);
                Cookie typec= new Cookie("type", usertype);
                res.addCookie(userc);
                res.addCookie(typec);

                out.println("<?xml version=\"1.0\"?>");
                out.println("<response>");
                out.println("<message>Login valid</message>");
                out.println("</response>");

            }

        } catch (Exception e) {
           res.setStatus(500);
        e.printStackTrace();

        out.println("<?xml version=\"1.0\"?>"); 
        out.println("<response>");
        out.println("<message>Problem with login.java</message>");
        out.println("</response>");
        } finally {
            out.close();
        }


    }
}
