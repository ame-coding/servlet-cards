<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
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
<style>
     @font-face {
    font-family: 'Jacquard';
    src: url('fonts/Jacquard.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}
 .market-container{
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
     color:white;
     font-family: Tahoma, serif;
     font-size: 16px;
}


  .header {
      font-family: 'Jacquard', serif;
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

.market-scroll {
    flex: 1;
    overflow: auto;
    background: rgba(0, 0, 0, 0.5);
    padding: 10px;

    display: flex;
    justify-content: center; /* center horizontally */
    align-items: flex-start; /* align to top */
}

.market-content {
    position: relative;
    width: 100%;
    box-sizing: border-box;
      height: 100%;
}



#welcome {
    font-family: 'Jacquard', serif;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 40px;
}


</style>
<div class="market-container">
<div class="header">
  <button class="menu-btn" id="menuBtn">☰</button>
  <h1 id="title">Welcome</h1>
</div>

<div class="sidebar" id="sidebar">
  <button class="close-btn" id="closeBtn"><</button>
  <h2 style="font-family: 'Jacquard', serif;">Trade</h2>
  <a href="#" open-mar="game/sell.jsp">Sell</a>
  <a href="#" open-mar="game/buy.jsp">Buy</a>
  <a href="#" open-mar="game/attack.jsp">Attack</a>

</div>
<div class="market-scroll">
    <div class="market-content" id="market-content">
        <h2 id="welcome"></h2>
    </div>
</div>
</div>
<script>
       const base = '<%= request.getContextPath() %>/';
     const player="<%= u %>";  
    const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const title = document.getElementById("title");
document.getElementById("welcome").textContent="Welcome, "+player;
menuBtn.onclick = () => {
  sidebar.classList.add('show');
};

closeBtn.onclick = () => {
  sidebar.classList.remove('show');
};

var marketContent = document.getElementById('market-content');

var links = sidebar.querySelectorAll('a[open-mar]');

for (var i = 0; i < links.length; i++) {
    var link = links[i];

    link.addEventListener('click', function(e) {
        e.preventDefault();

        var jsplink = this.getAttribute('open-mar');

        fetch(jsplink)
            .then((jspr)=>{
                if (!jspr.ok) {
                    throw new Error('Cant open jsp: ' + jspr.status);
                }
                return jspr.text();
            })
             .then(function(jsphtml) {
                endevent();
                marketContent.innerHTML = jsphtml;

                switch (jsplink) {
                    case "game/sell.jsp":
                        console.log("Sell JSP loaded");
                        title.textContent = "Sell";
                        selljsp();
                        break;

                    case "game/buy.jsp":
                        console.log("Buy JSP loaded");
                        title.textContent = "Buy";
                        buyjsp();
                        break;

                    case "game/attack.jsp":
                        console.log("Attack JSP loaded");
                        title.textContent = "Attack";
                        attackjsp();
                        break;

                    default:
                        console.log("Unknown JSP: " + jsplink);
                        break;
                }
            })
            .catch((error)=>{
                marketContent.innerHTML =
                    '<p style="color:red;">idk why jsp cant be loaded' + jsplink + '</p>';
                console.error(error);
            });

        sidebar.classList.remove('show');
    });
}


</script>
