<%@page import="javax.servlet.http.Cookie"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%

    Cookie[] cook = request.getCookies();
    
     if (cook != null) {
        for (Cookie c : cook) {
            c.setMaxAge(0);
            c.setPath(c.getPath());
            response.addCookie(c);
        }
    }
    response.sendRedirect("index.jsp");
%>