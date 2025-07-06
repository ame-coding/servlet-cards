
package backend.admin;

import backend.Data;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
public class unbanupdate extends HttpServlet {
Data db = new Data();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            String xmlS = req.getParameter("xml");
            System.out.println("XML from client: " + xmlS);

            if (xmlS == null) throw new Exception("No xml from client");

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlS)));
            String user = doc.getElementsByTagName("user").item(0).getTextContent();

            System.out.println("User to unban: " + user);

            try (Connection c = db.connectdb()) {

                PreparedStatement ps = c.prepareStatement(
                    "DELETE FROM bans WHERE user = ?"
                );
                ps.setString(1, user);

                int rows = ps.executeUpdate();

                out.println("<?xml version=\"1.0\"?>");
                out.println("<response>");
                if (rows > 0) {
                    out.println("<message>User unbanned successfully</message>");
                } else {
                    out.println("<message>Failed to unban user</message>");
                }
                out.println("</response>");

                ps.close();
            }

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with unbanUpdate.java</message>");
            out.println("</response>");
        } finally {
            out.close();
        }
    }
}
