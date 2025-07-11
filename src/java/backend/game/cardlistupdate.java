
package backend.game;


import backend.Data;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
public class cardlistupdate extends HttpServlet {
    Data db = new Data();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            String xmlS = req.getParameter("xml");
            System.out.println("Received XML:\n" + xmlS);
            if (xmlS == null) throw new Exception("No xml from client");

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlS)));

            String user = doc.getElementsByTagName("player").item(0).getTextContent().trim();

            StringBuilder cardsBuilder = new StringBuilder();
            String cards = "";

            String type = "e";
            String level = "e";

            for (int i = 0; i < 6; i++) {

                Element cparse = (Element) doc.getElementsByTagName("c").item(i);

                type = cparse.getElementsByTagName("type").item(0).getTextContent().trim();
                level = cparse.getElementsByTagName("level").item(0).getTextContent().trim();

                if (!type.equals("e")) {
                    cardsBuilder.append(type).append(level);
                } else {
                    cardsBuilder.append("e");
                }

                if (i < 5) {
                    cardsBuilder.append(",");
                }
            }

            cards = cardsBuilder.toString();

            try (Connection c = db.connectdb()) {


                PreparedStatement ps = c.prepareStatement(
                        "UPDATE inventory SET cards = ? WHERE user = ?"
                );
                ps.setString(1, cards);
                ps.setString(2, user);

                int rows = ps.executeUpdate();

                if (rows == 0) {
                    throw new Exception("Something wrong in database for user " + user);
                }

                out.println("<?xml version=\"1.0\"?>");
                out.println("<response>");
                out.println("<message>Success</message>");
                out.println("</response>");
            }

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with cardlistupdate.java</message>");
            out.println("</response>");
        } finally {
            out.close();
        }
    }


}
