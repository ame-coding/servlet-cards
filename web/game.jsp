
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="javax.servlet.http.Cookie"%>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Natuur</title>
<style>
 
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index:0;
}

.view {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transition: transform 0.6s ease;
  overflow-y: auto;
  box-sizing: border-box;
}

.game-view {
  color: #000000;
  z-index: 1;
    padding-top: 40px;
    color:white;
        height:100%;
        position: relative;
         font-size:14px;
}

.market-view {

  color: #ffffff;
  z-index: 10;
  transform: translateY(-100%);
}

.market-view.show {
  transform: translateY(0);
}

.but {
    align-self: center; 
    padding: 5px 8px;
    background-color:#663300;
    color: #b35900;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    width: auto;
      font-size: 16px;
}
.toggle-button {
  position: absolute;
  left: 90%;
  transform: translateX(-50%);
  z-index: 100;
  transition: top 0.6s ease;
}
#coinsLabel{
    position:absolute;
    color:#99994d;
    top:5%;
    left:3%;
     font-size:20px;
}
#logout{
    position:absolute;
    top:90%;
    left:3%;
}
</style>
<link rel="stylesheet" type="text/css" href="game/marketcss.css">
</head>
<body>
  <div class="wrapper">
    <button id="toggleBtn" class="but toggle-button" style="top: 10px;">▼Trade</button>

    <div id="gameView" class="view game-view">
      <p id="coinsLabel">$0<p>

      <div class="card-container" id="cardContainer"></div>
      <button class="but" onclick="window.location.href='logout.jsp'" id="logout">Logout</button>

    </div>

    <div id="marketView" class="view market-view">
      <jsp:include page="market.jsp" />
    </div>
  </div>
  <script>
 
    const toggleBtn = document.getElementById('toggleBtn');
const marketView = document.getElementById('marketView');

let showingMarket = false;

toggleBtn.addEventListener('click', () => {
  showingMarket = !showingMarket;

  if (showingMarket) {
    marketView.classList.add('show');
    toggleBtn.textContent = '▲Game';
    toggleBtn.style.top = 'calc(100% - 50px)';
    if (typeof stopGamePing === 'function') {
      stopGamePing();
    }
  } else {
    marketView.classList.remove('show');
    toggleBtn.textContent = '▼Trade';
    toggleBtn.style.top = '10px';
    if (typeof startGamePing === 'function') {
      startGamePing();
    }
  }
});</script>
  <script src="game/marketjs.js"></script>
</body>
</html>
