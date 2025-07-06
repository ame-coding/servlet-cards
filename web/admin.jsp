
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="javax.servlet.http.Cookie"%>
<%
    String u = "";
    Cookie[] cook = request.getCookies();
    
     if (cook != null) {
        for (Cookie c : cook) {
            if ("user".equals(c.getName())) {
                u = c.getValue();
            }
        }
    }
    
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Panel</title>
<link rel="stylesheet" type="text/css" href="admin/adminstyle.css">

<style>
 @font-face {
    font-family: 'Jacquard';
    src: url('fonts/Jacquard.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
  .admin-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 0;
     color:white;
     font-family: Tahoma, serif;
}


  .header {

    padding: 0 10px;
    display: flex;
    align-items: center;
    height: 9vh;  
     background: rgba(0, 0, 0, 0.6);
  }

  .menu-btn {
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    margin-right: 10px;
	color: white;
  }

  .sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 150px;
     background: rgba(0, 0, 0, 0.9);
    padding: 20px;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 100;
    
     
  }
  .sidebar.show {
    transform: translateX(0);
  }
  .sidebar a {
    display: block;
    color: white;
    text-decoration: none;
    margin: 10px 0;
  }
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    float: right;
  }

.admin-scroll {
    flex: 1;
    overflow: auto;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;

    display: flex;
    justify-content: center; /* center horizontally */
    align-items: flex-start; /* align to top */
}

.admin-content {
    width: 100%;
    box-sizing: border-box;
}



 #welcome {
    font-family: 'Jacquard', serif;
      position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

</style>
</head>
<body>
<div class="admin-container">
<div class="header">
  <button class="menu-btn" id="menuBtn">☰</button>
  <h1 id="title">Welcome</h1>
</div>

<div class="sidebar" id="sidebar">
  <button class="close-btn" id="closeBtn"><</button>
  <h2>Admin</h2>
  <a href="#" open-admin="admin/ban.jsp">Ban</a>
  <a href="#" open-admin="admin/unban.jsp">Unban</a>
  <a href="#" open-admin="admin/delete.jsp">Delete</a>
  <a href="#" open-admin="admin/add.jsp">Add</a>
  <a href="logout.jsp">Logout</a>
</div>
<div class="admin-scroll">
    <div class="admin-content" id="admin-content">
        <h2 id="welcome">Welcome, <%= u %></h2>
    </div>
</div>
</div>
<script>
     const base = '<%= request.getContextPath() %>/';
     const adminuser="<%= u %>";
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const title = document.getElementById("title");
menuBtn.onclick = () => {
  sidebar.classList.add('show');
};

closeBtn.onclick = () => {
  sidebar.classList.remove('show');
};

var adminContent = document.getElementById('admin-content');

var links = sidebar.querySelectorAll('a[open-admin]');

for (var i = 0; i < links.length; i++) {
    var link = links[i];

    link.addEventListener('click', function(e) {
        e.preventDefault();

        var jsplink = this.getAttribute('open-admin');

        fetch(jsplink)
            .then((jspr)=>{
                if (!jspr.ok) {
                    throw new Error('Cant open jsp: ' + response.status);
                }
                return jspr.text();
            })
            .then((jsphtml)=>{
                endevent();
                adminContent.innerHTML = jsphtml;
                                switch (jsplink) {
                    case "admin/ban.jsp":
                        console.log("Ban JSP loaded");
                        title.textContent = "Ban";
                        banjsp();
                        break;

                    case "admin/unban.jsp":
                        console.log("Unban JSP loaded");
                        title.textContent = "Unban";
                        unbanjsp();
                        break;

                    case "admin/delete.jsp":
                        console.log("Delete JSP loaded");
                        title.textContent = "Delete";
                        deletejsp();
                        break;

                    case "admin/add.jsp":
                        console.log("Add JSP loaded");
                        title.textContent = "Add";
                        addjsp(); 
                        break;

                    default:
                        console.log("Jsp being weird bruh: " + jsplink);
                        break;
                }
            })
            .catch((error)=>{
                adminContent.innerHTML =
                    '<p style="color:red;">idk why jsp cant be loaded' + jsplink + '</p>';
                console.error(error);
            });

        sidebar.classList.remove('show');
    });
}
</script>
<script src="admin/adminscript.js"></script>

</body>
</html>
