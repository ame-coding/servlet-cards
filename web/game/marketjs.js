
 const startgame=()=>{
     
     isgame=true;
    cardcreate("cardContainer");
    isgame=false;
    
    };
let selectedCard = null;


const handleCardClick = (container, playerName, card) => {
  const containerType = container.dataset.type; // e.g., 'inventory', 'sell', 'buy'
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
  selectedCard = null;
};

// Utility to get price of a card
const requiredPrice = (card) => {
  if (!card || card.type === 'e') return 0;
  return 10 * card.level; // Example: level 1 = 10 coins, level 2 = 20 coins, …
};

const cardcreate = (whichcon, playerName, containerType = 'inventory') => {
  const container = document.getElementById(whichcon);
  container.innerHTML = '';
  container.dataset.type = containerType;
  container.dataset.player = playerName;

  const cardsArray =
    containerType === 'sell' ? currplayersell :
    containerType === 'buy' ? currplayer[playerName] : 
    currplayer[playerName];

  for (let i = 0; i < cardsArray.length; i++) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = i;

    const img = document.createElement('img');
    img.style.display = 'none';
    card.appendChild(img);

    if (isgame) {
  const craftBtn = document.createElement('button');
  craftBtn.textContent = 'Craft';
  craftBtn.className = 'but craft-button';
  craftBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    handleCraft(playerName, i, container);
  });
  card.appendChild(craftBtn);
}


    const levelBadge = document.createElement('div');
    levelBadge.className = 'card-level';
    levelBadge.textContent = `Lv.${i + 1}`;
    card.appendChild(levelBadge);

    card.addEventListener('click', () => {
      handleCardClick(container, playerName, card);
    });

    container.appendChild(card);
  }
};
const handleCraft = (playerName, index, container) => {
  const assigned = assignedType[playerName]; // assuming you have `assignedType` like { player1: "f", … }

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
    });
};

const loadpics = (whichcon, dictplayer, playername) => {
  const container = document.getElementById(whichcon);
  const cards = container.querySelectorAll('.card');

  const playerCards = dictplayer[playername];
  if (!playerCards) {
    console.error(`Player '${playername}' not found in dictplayer`);
    return;
  }

  caches.open('cards-images').then(cache => {
    cards.forEach((card, i) => {
      const { type, level } = playerCards[i] || {};

      if (!type || type === "e") {
        console.log(`Skipping card ${i} for player '${playername}' (empty or 'e')`);
        return;
      }

      const imgPath = `images/cards/${type}.png`;

      cache.match(imgPath).then(cachedRes => {
        if (cachedRes) {
          cachedRes.blob().then(blob => {
            const imgURL = URL.createObjectURL(blob);

            const img = document.createElement('img');
            img.src = imgURL;
            img.alt = type;
            img.style.display = 'block';

            // Clear any existing children before appending
            card.innerHTML = '';

            card.appendChild(img);

            const lvlBox = document.createElement('div');
            lvlBox.className = 'card-level';
            lvlBox.textContent = `Lvl ${level}`;
            card.appendChild(lvlBox);
          });
        } else {
          console.warn(`Image ${imgPath} not found in cache. Skipping card ${i}.`);
        }
      });
    });
  });
};

const usercards=()=>{
    fetch(`checkorcreate`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `xml=<user>${player}</user>`
    })
    .then(res => res.text())
    .then(xmlStr => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlStr, "application/xml");
        console.log(xml);

        const userNode = xml.getElementsByTagName("user")[0];
        if (!userNode) {
            console.warn(`No <user> element in response`);
            return;
        }

        const cards = [];
        const cardNodes = userNode.getElementsByTagName("c");
        for (let cNode of cardNodes) {
            const type = cNode.textContent.trim();
            cards.push({ type, level: "e" });
        }

        currcardpl[player] = cards;

        const coinNode = userNode.getElementsByTagName("coin")[0];
        const coins = coinNode ? parseInt(coinNode.textContent.trim(), 10) : 0;
        playercoins=coins;
        console.log(`Updated cards for ${player}:`, currcardpl[player]);
        console.log(`Coins for ${player}:`, coins);

        // You can also update the UI here if you want
    })
    .catch(err => {
        console.error(`Error fetching data for ${player}:`, err);
    });
    
    
};
function selljsp() {
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
    loadpics("sell-container", { [player]: currplayersell }, player);
}
function buyjsp() {
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
        });
}





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
*/