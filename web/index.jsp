<%@ page session="true" %>
    <%@page import="javax.servlet.http.Cookie"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
  <title>Natuur</title>
</head>
<body>
  <%@ include file="fireback.html" %>
  <div class="splash">

<%

    Cookie[] cook = request.getCookies();
    String type = null;
     if (cook != null) {
        for (Cookie c : cook) {
             if ("type".equals(c.getName())) {
                type = c.getValue();
            }
        }
    }
 
     if (type == null && "signup".equals(request.getParameter("view"))) {
        RequestDispatcher rd = request.getRequestDispatcher("signup.jsp");
        rd.include(request, response);
    } else if ("admin".equals(type)) {
        RequestDispatcher rd = request.getRequestDispatcher("admin.jsp");
        rd.include(request, response);
    } else if ("player".equals(type)) {
        RequestDispatcher rd = request.getRequestDispatcher("game.jsp");
        rd.include(request, response);
    } else {
        RequestDispatcher rd = request.getRequestDispatcher("login.jsp");
        rd.include(request, response);
    }

%>
  </div>
</body>
</html>
