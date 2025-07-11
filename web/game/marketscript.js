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
 
};


const requiredPrice = (card) => {
  if (card.type === 'e') return 0;
  return 100 * card.level;
};

const handleCraft = (index) => {
  
 let originalCards = JSON.parse(JSON.stringify(currcardpl[currplayer]));

  currcardpl[currplayer][index] = { type: assigned, level: 1 };
    let xmlc = currcardpl[currplayer];
    let xmls = '<?xml version="1.0"?>';
    xmls += '<user>';

    for (let i = 0; i < 6; i++) {
        let x = xmlc[i];
        let type = x.type;
        let level = x.level;

        xmls += "<c i=\"" + (i + 1) + "\">";
        xmls += "<type>" + type + "</type>";
        xmls += "<level>" + level + "</level>";
        xmls += "</c>";
    }

    xmls += "<player>" + currplayer + "</player>";
    xmls += "</user>";
    console.log(xmls);
            fetch(base + 'cardlistupdate', {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: new URLSearchParams({ xml: xmls })
          })
          .then(res => {
              if (!res.ok) throw new Error('Network response was not ok');
              return res.text();
          })
          .then(xmlStr => {
              console.log('Response XML:', xmlStr);
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlStr, "application/xml");
              const xmlm = xmlDoc.getElementsByTagName("message")[0];

              if (xmlm && xmlm.textContent.trim() === "Success") {
                  loadpics("cardContainer", currcardpl, currplayer);
              } else {
                  currcardpl[currplayer][index] = originalCards[index];
                  loadpics("cardContainer", currcardpl, currplayer);
              }
          })
          .catch(err => {
              console.error('Fetch error:', err);
              currcardpl[currplayer][index] = originalCards[index];
              loadpics("cardContainer", currcardpl, currplayer);
          });
};

function selljsp() {
}
function buyjsp() {
    
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
