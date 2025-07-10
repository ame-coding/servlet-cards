const startgame = () => {
    isgame = true;

    startcards().then(() => {
        cardcreate("cardContainer", currplayer, "inventory");
        loadpics("cardContainer", currcardpl, currplayer);
        isgame = false;
        console.log("Game initialized");
    });
};

let selectedCard = null;


const handleCardClick = (container, playerName, card) => {
 /* const containerType = container.dataset.type; // e.g., 'inventory', 'sell', 'buy'
  const containerPlayer = container.dataset.player || playerName;
  const cardsArray = containerType === 'sell' ? currplayersell : currplayer[containerPlayer];

  const cardIndex = parseInt(card.dataset.index, 10);
  const cardData = cardsArray[cardIndex];

  // Deselect if clicked again
  if (card.classList.contains('select')) {
    card.classList.remove('select');
    selectedCard = null;
    return;
  }

  card.classList.add('select');

  if (!selectedCard) {
    selectedCard = { container, card, cardData, index: cardIndex, containerType, containerPlayer };
    return;
  }

  const first = selectedCard;
  const second = { container, card, cardData, index: cardIndex, containerType, containerPlayer };

  // Same container
  if (first.container === second.container) {
    // Same type & level
    if (first.cardData.type === second.cardData.type && first.cardData.level === second.cardData.level) {
      // Merge
      cardsArray[first.index].level++;
      cardsArray[second.index] = { type: 'e', level: 'e' };
    } else if (second.cardData.type === 'e') {
      // Move to empty slot
      cardsArray[second.index] = first.cardData;
      cardsArray[first.index] = { type: 'e', level: 'e' };
    }
    loadpics(first.container.id, currplayer, playerName);
  }

  // Inventory ↔ Sell
  else if (
    (first.containerType === 'inventory' && second.containerType === 'sell') ||
    (first.containerType === 'sell' && second.containerType === 'inventory')
  ) {
    const firstArr = first.containerType === 'sell' ? currplayersell : currplayer[playerName];
    const secondArr = second.containerType === 'sell' ? currplayersell : currplayer[playerName];

    // Swap cards
    [firstArr[first.index], secondArr[second.index]] = [secondArr[second.index], firstArr[first.index]];

    loadpics(first.container.id, currplayer, playerName);
    loadpics(second.container.id, currplayer, playerName);
  }

  // Buy
  else if (second.containerType === 'buy') {
    const buyPlayer = second.container.dataset.player;
    const buyCards = currplayer[buyPlayer];
    const buyCard = buyCards[second.index];

    const inventory = currplayer[playerName];
    const emptyIndex = inventory.findIndex(c => c.type === 'e');

    if (coins[playerName] < requiredPrice(buyCard)) {
      console.warn("Not enough coins!");
    } else if (emptyIndex === -1) {
      console.warn("No space in inventory!");
    } else {
      // Deduct coins, add card
      coins[playerName] -= requiredPrice(buyCard);
      inventory[emptyIndex] = { ...buyCard };
      // Optionally mark buy card as sold: buyCards[second.index] = { type: 'e', level: 'e' };
      fetch('buyupdate', {
        method: 'POST',
        body: JSON.stringify({ player: playerName, card: buyCard }),
        headers: { 'Content-Type': 'application/json' }
      }).then(r => r.ok ? console.log('Purchase recorded') : console.error('Failed to record purchase'));

      loadpics(first.container.id, currplayer, playerName);
    }
  }

  // Cleanup selection
  first.card.classList.remove('select');
  second.card.classList.remove('select');
  selectedCard = null;*/
};

// Utility to get price of a card
const requiredPrice = (card) => {
  if (!card || card.type === 'e') return 0;
  return 10 * card.level; // Example: level 1 = 10 coins, level 2 = 20 coins, …
};

const handleCraft = (index, container) => {
  /*const assigned = assignedType[playerName]; // assuming you have `assignedType` like { player1: "f", … }

  // Backup original card
  const originalCard = { ...currplayer[playerName][index] };

  // Update in-memory
  currplayer[playerName][index] = { type: assigned, level: 1 };

  // Send to server
  fetch('cardupdate', {
    method: 'POST',
    body: JSON.stringify({
      user: playerName,
      index: index,
      type: assigned,
      level: 1
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => {
      if (!res.ok) throw new Error('Server rejected update');
      return res.json();
    })
    .then(() => {
      console.log(`Card crafted at slot ${index} for ${playerName}`);
      loadpics(container.id, currplayer, playerName);
    })
    .catch(err => {
      console.error(err);
      // revert
      currplayer[playerName][index] = originalCard;
      loadpics(container.id, currplayer, playerName);
    });*/
};

function selljsp() {/*
    const marketDiv = document.getElementById("market-content");
    marketDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between;">
            <div id="inventory-container"></div>
            <div id="sell-container"></div>
        </div>
    `;

    cardcreate("inventory-container", player, "inventory");
    loadpics("inventory-container", currplayer, player);

    cardcreate("sell-container", player, "sell");
    loadpics("sell-container", { [player]: currplayersell }, player);*/
}
function buyjsp() {/*
    const marketDiv = document.getElementById("market-content");
    marketDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2>Buy Market</h2>
            <div style="font-weight: bold;">Coins: <span id="coins">${playercoins}</span></div>
        </div>
        <table id="buy-table" style="width: 100%; border-collapse: collapse;">
            <tbody></tbody>
        </table>
    `;

    fetch("buylist") // replace with your actual servlet endpoint
        .then(res => res.text())
        .then(xmlStr => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlStr, "application/xml");

            const tbody = document.querySelector("#buy-table tbody");
            tbody.innerHTML = "";

            const users = xml.getElementsByTagName("user");
            for (let user of users) {
                const username = user.getAttribute("name");
                const coins = user.getElementsByTagName("coins")[0]?.textContent.trim() || "0";

                const cards = [];
                const cardNodes = user.getElementsByTagName("c");
                for (let cNode of cardNodes) {
                    const type = cNode.getElementsByTagName("type")[0]?.textContent.trim() || "e";
                    const level = cNode.getElementsByTagName("level")[0]?.textContent.trim() || "e";
                    cards.push({ type, level });
                }

                // Save to global dictionary for compatibility with cardcreate/loadpics
                currplayer[username] = cards;

                const row = document.createElement("tr");
                row.style.height = "20%";

                const cell = document.createElement("td");
                cell.innerHTML = `
                    <div><strong>${username}</strong> (Coins: ${coins})</div>
                    <div id="buy-${username}" class="buy-container" data-type="buy" data-player="${username}"></div>
                `;
                row.appendChild(cell);
                tbody.appendChild(row);

                cardcreate(`buy-${username}`, username, "buy");
                loadpics(`buy-${username}`, currplayer, username);
            }
        })
        .catch(err => {
            console.error("Error loading buy list", err);
        });*/
}
const startcards = () => {
    const xmls = "<user>" + currplayer + "</user>";

    return fetch(base + "start", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ xml: xmls })
    })
    .then(res => res.text())
    .then(xmlStr => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
        console.log(xmlDoc);

        const startcard = xmlDoc.getElementsByTagName("user")[0];

        const cards = [];
        const cardsarr = startcard.getElementsByTagName("c");
        for (let crd of cardsarr) {
            const typest = crd.getElementsByTagName("type")[0];
            const levelst = crd.getElementsByTagName("level")[0];

            const type = typest ? typest.textContent.trim() : "e";
            const level = levelst ? levelst.textContent.trim() : "e";

            cards.push({ type, level });
        }

        currcardpl = {};
        currcardpl[currplayer] = cards;

        const coinsst = startcard.getElementsByTagName("coins")[0];
        playercoins = coinsst ? parseInt(coinsst.textContent.trim(), 10) : 0;
        coindisp.textContent = playercoins;

        const assignedst = startcard.getElementsByTagName("assigned")[0];
        assigned = assignedst ? assignedst.textContent.trim() : "e";

        console.log(`Updated cards for ${currplayer}:`, currcardpl[currplayer]);
        console.log(`Coins for ${currplayer}:`, playercoins);
        console.log(`Assigned for ${currplayer}:`, assigned);
    })
    .catch(err => {
        console.error(`Error fetching data for ${currplayer}:`, err);
    });
};




const cardcreate = (whichcon, playerName, contype) => {
    const parentcon = document.getElementById(whichcon);
    if (!parentcon) {
    console.error(`No element found with id: ${whichcon}`);
    return;
}

     const gamecon = document.createElement('div');
      gamecon.className = 'cardcon';
    gamecon.innerHTML = '';
    gamecon.dataset.type = contype;
    gamecon.dataset.player = playerName;

    for (let i = 0; i < 6; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.index = i;

      const img = document.createElement('img');
      img.style.display = 'none';
      card.appendChild(img);

      if (isgame) {
    const craftBtn = document.createElement('button');
    craftBtn.textContent = 'Craft';
    craftBtn.className = 'but craft';
    craftBtn.addEventListener('click', () => {
      handleCraft(i, gamecon);
    });

    card.appendChild(craftBtn);
  }


      const levelc = document.createElement('div');
      levelc.className = 'card-level';
      levelc.textContent = "Lv.0";
      card.appendChild(levelc);

      card.addEventListener('click', () => {
        handleCardClick(gamecon, playerName, card);
      });

      gamecon.appendChild(card);
    }
       parentcon.appendChild(gamecon);
};

const loadpics = (whichcon, dictplayer, playername) => {
  const container = document.getElementById(whichcon);
  const carcon = container.querySelector(`.cardcon[data-player="${playername}"]`);
  const cards = carcon.querySelectorAll('.card');
  const playerCards = dictplayer[playername];

  cards.forEach((card, i) => {
    const { type, level } = playerCards[i];
     const img = card.querySelector('img');
     const crft = card.querySelector('button');
      const lvldiv = card.querySelector('.card-level');
    if (!type || type === "e") {
        img.style.display = 'none';
        img.alt = "e";
        crft.style.display = 'block';
        lvldiv.style.display = 'none';
      return;
    }

    const imgPath = `images/cards/${type}.png`;

      img.src = imgPath;
      img.alt = type;
      img.style.display = 'block';
      crft.style.display = 'none';
      lvldiv.style.display = 'block';
    let lvl = card.querySelector('.card-level');

    lvl.textContent = `Lvl ${level}`;
  });
};

/*
 * 
 * // Input: user data (you could get this from a DB or an API in practice)
const userData = {
  user1: [
    { type: "fire", level: 3 },
    { type: "water", level: 2 },
    { type: "earth", level: 1 }
  ],
  user2: [
    { type: "wind", level: 5 },
    { type: "light", level: 4 },
    { type: "dark", level: 3 },
    { type: "earth", level: 2 }
  ]
};

// Build the dictionary ensuring each user has 6 cards
const usersWithSixCards = {};

for (const [user, cards] of Object.entries(userData)) {
  const paddedCards = [...cards]; // copy existing cards

  // Pad with empty cards until there are 6
  while (paddedCards.length < 6) {
    paddedCards.push({ type: "e", level: "e" });
  }

  usersWithSixCards[user] = paddedCards;
}

console.log(usersWithSixCards);

function banjsp(){
    loadBanTable();
    
    function loadBanTable() {
        endevent(); 

        fetch(base+"ban") 
            .then(res => res.text())
            .then(xmlStr => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(xmlStr, "application/xml");
                    console.log(xml);

                    const tableDiv = document.getElementById("ban-table");
                    tableDiv.innerHTML = "";

                    const tableNode = xml.getElementsByTagName("table")[0];
                    const rows = tableNode ? tableNode.children : [];

                    const table = document.createElement("table");
                    const header = document.createElement("tr");
                    header.innerHTML = `<th>User</th><th>Type</th><th>Action</th>`;
                    table.appendChild(header);

                    for (let row of rows) {
                        const userEl = row.getElementsByTagName("user")[0];
                        const typeEl = row.getElementsByTagName("type")[0];

                        const user = userEl ? userEl.textContent : "";
                        const type = typeEl ? typeEl.textContent : "";

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${user}</td>
                            <td>${type}</td>
                            <td><button class="but banBtn" value="${user}">Ban</button></td>
                        `;
                        table.appendChild(tr);
                    }

                    tableDiv.appendChild(table);

                document.querySelectorAll(".but.banBtn").forEach(btn => {
                    addevent(btn, "click", () => {
                        showBanReason(btn.value);
                    });
                });
            });
    }
    const banReasonModal = document.getElementById("banReason");
    const banInput = document.getElementById("banInput");
    const message = document.getElementById("check");
    banInput.textContent="";
    let currentUser = "";
    function showBanReason(user) {
        currentUser = user;
        banInput.value = "";
        banReasonModal.hidden = false;
    }

    function hideBanReason() {
        banReasonModal.hidden = true;
    }


    addevent(document.getElementById("banClose"), "click", hideBanReason);

    addevent(document.getElementById("banReasonBtn"), "click", () => {
            const reason = banInput.value.trim();

            const xmlsend =
            "<request><user>"+currentUser+"</user><reason>"+reason+"</reason></request>";
        fetch(base + "banupdate", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ xml: xmlsend })
        })
        .then(res => res.text())
        .then(xmlStr => {
           const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
        const status = xmlDoc.getElementsByTagName("message")[0]?.textContent;
            message.textContent = status;
           
            hideBanReason();
               banjsp();
        })
        .catch(() => {
            message.textContent = "Error contacting server.";
            hideBanReason();
        });
     
    });
}


function unbanjsp(){
    loadunbanTable();
    
    function loadunbanTable() {
        endevent(); 

        fetch(base+"unban") 
            .then(res => res.text())
            .then(xmlStr => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(xmlStr, "application/xml");
                    console.log(xml);

                    const tableDiv = document.getElementById("unban-table");
                    tableDiv.innerHTML = "";

                    const tableNode = xml.getElementsByTagName("table")[0];
                    const rows = tableNode ? tableNode.children : [];

                    const table = document.createElement("table");
                    const header = document.createElement("tr");
                    header.innerHTML = `<th>User</th><th>Ban</th><th>Action</th>`;
                    table.appendChild(header);

                    for (let row of rows) {
                        const userEl = row.getElementsByTagName("user")[0];
                        const banEl = row.getElementsByTagName("ban")[0];

                        const user = userEl ? userEl.textContent : "";
                        const ban = banEl ? banEl.textContent : "";

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${user}</td>
                            <td>${ban}</td>
                            <td><button class="but unbanBtn" value="${user}">Unban</button></td>
                        `;
                        table.appendChild(tr);
                    }

                    tableDiv.appendChild(table);

                document.querySelectorAll(".but.unbanBtn").forEach(btn => {
                    addevent(btn, "click", () => {
                        curruserassign(btn.value);
                    });
                });
            });
    }
    const curruserassign = (user) =>{
            const message = document.getElementById("check");
           const xmlsend =
            "<request><user>"+user+"</user></request>";
        fetch(base + "unbanupdate", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ xml: xmlsend })
        })
        .then(res => res.text())
        .then(xmlStr => {
           const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
        const status = xmlDoc.getElementsByTagName("message")[0]?.textContent;
            message.textContent = status;
            unbanjsp();
        })
        .catch(() => {
            message.textContent = "Error contacting server.";
        });
        
        
    };

}
 
 let pingInterval = null;

function startGamePing() {
  if (pingInterval) return;
  pingInterval = setInterval(() => {
    console.log("[GAME] Ping to server...");
    // fetch('/game/ping') or similar
  }, 1000);
}

function stopGamePing() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log("[GAME] Pings paused.");
  }
}
  protected void service(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {
        res.setContentType("text/xml;charset=UTF-8");
        PrintWriter out = res.getWriter();

        try (Connection c = db.connectdb()) {

            PreparedStatement ps = c.prepareStatement(
                "SELECT user, type FROM users WHERE type = 'player' AND user NOT IN (SELECT user FROM bans);"
            );

            ResultSet rs = ps.executeQuery();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<table>");

            int i = 1;

            while (rs.next()) {
                String user = rs.getString("user");
                String type = rs.getString("type");

                out.println("<id i=\"" + i + "\">");
                out.println("<user>" + user + "</user>");
                out.println("<type>" + type + "</type>");
                out.println("</id>");

                i++;
            }

            out.println("</table>");

            rs.close();
            ps.close();

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with ban.java</message>");
            out.println("</response>");
        } finally {
            out.close();
        }

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
            String reason = doc.getElementsByTagName("reason").item(0).getTextContent();

            System.out.println("User to ban: " + user + ", Reason: " + reason);

            try (Connection c = db.connectdb()) {

                PreparedStatement ps = c.prepareStatement(
                    "INSERT INTO bans (user, ban) VALUES (?, ?)"
                );
                ps.setString(1, user);
                ps.setString(2, reason);

                int rows = ps.executeUpdate();

                out.println("<?xml version=\"1.0\"?>");
                out.println("<response>");
                if (rows > 0) {
                    out.println("<message>User banned successfully</message>");
                } else {
                    out.println("<message>Failed to ban user</message>");
                }
                out.println("</response>");

                ps.close();
            }

        } catch (Exception e) {
            res.setStatus(500);
            e.printStackTrace();

            out.println("<?xml version=\"1.0\"?>");
            out.println("<response>");
            out.println("<message>Problem with BanUpdate.java</message>");
            out.println("</response>");
        } finally {
            out.close();
        }
    }
*/