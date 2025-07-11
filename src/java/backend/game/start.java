
package backend.game;


import backend.Data;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.*;
import java.sql.*;
import java.util.Random;
import javax.xml.parsers.*;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;
public class start extends HttpServlet {

   Data db = new Data();

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try {
            String xmlS = req.getParameter("xml");
            if (xmlS == null) throw new Exception("No xml from client");

            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlS)));
            String user = doc.getElementsByTagName("user").item(0).getTextContent();

            String cards = null;
            int coins = 0;
            String assign = null;

            try (Connection c = db.connectdb()) {
                c.setAutoCommit(false);

                PreparedStatement ps = c.prepareStatement(
                        "SELECT cards, coins, assign FROM inventory WHERE user = ?"
                );
                ps.setString(1, user);
                ResultSet rs = ps.executeQuery();

                if (rs.next()) {
                   
                    cards = rs.getString("cards");
                    coins = rs.getInt("coins");
                    assign = rs.getString("assign");
                } else {
                
                    String defaultCards = "e,e,e,e,e,e";
                    String defaultSell = "e,e,e,e,e,e";
                    String[] assignOptions = {"f", "w", "a"};
                    assign = assignOptions[new Random().nextInt(assignOptions.length)];
                    coins = 1000;

                  
                    ps = c.prepareStatement(
                            "INSERT INTO inventory(user, cards, sell, assign, coins) VALUES(?,?,?,?,?)"
                    );
                    ps.setString(1, user);
                    ps.setString(2, defaultCards);
                    ps.setString(3, defaultSell);
                    ps.setString(4, assign);
                    ps.setInt(5, coins);
                    ps.executeUpdate();

                    cards = defaultCards;
                }

                c.commit();

               
                String[] cardArray = cards.split(",");

                out.println("<?xml version=\"1.0\"?>");
                out.println("<user>");

                for (int i = 0; i < cardArray.length; i++) {
                    String cardStr = cardArray[i];
                    String type = "e";
                    String level = "e";

                    if (!cardStr.equals("e")) {
                        type = cardStr.replaceAll("\\d+$", "");
                        level = cardStr.substring(type.length());
                    }

                    out.printf("<c i=\"%d\">%n", i + 1);
                    out.printf("<type>%s</type>%n", type);
                    out.printf("<level>%s</level>%n", level);
                    out.println("</c>");
                }

                out.printf("<assigned>%s</assigned>%n", assign);
                out.printf("<coins>%d</coins>%n", coins);

                out.println("</user>");
            }

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with start.java: " + e.getMessage() + "</message>");
            out.println("</response>");
        } finally {
            out.close();
        }
    }
}
