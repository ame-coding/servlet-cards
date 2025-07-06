const listeners = [];

function addevent(element, event, handler) {
    element.addEventListener(event, handler);
    listeners.push({ element, event, handler });
}

function endevent() {
    for (const { element, event, handler } of listeners) {
        element.removeEventListener(event, handler);
    }
    listeners.length = 0;
}

function addjsp(){

    const signlisten=()=>{
            const email = document.getElementById("email").value.trim();
        const pass = document.getElementById("pass").value.trim();
        const radios = document.getElementsByName("userType");

        var type = null;

        for (let i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                type = radios[i].value;
                break;
            }
        }
        const check = document.getElementById("check");

        if (!email || !pass) {
            check.textContent = "Enter both email and password";
            return;
        }

        check.textContent = "Signing up...";

        const xmlsend =
            "<login><user>"+email+"</user><pass>"+pass+"</pass><type>"+type+"</type><add>admin</add></login>";
         console.log(base);   
        fetch(base+"signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ xml: xmlsend })
        })
        .then(response => response.text())
        .then(str => {

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "application/xml");
            const message = xmlDoc.getElementsByTagName("message")[0]?.textContent;

            if (!message) {
                check.textContent = "No message was sent from Signup.java";
                return;
            }

            if (message.trim() === "Signing up") {
                check.textContent = "Succesful addition";
            }else{
                check.textContent = message;
            }
        })
        .catch(err => {
            console.error(err);
            check.textContent = "Error contacting server.";
        });

        };

        addevent(document.getElementById("signup"), "click", signlisten);

}

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

function deletejsp(){
    loadunbanTable();
    
    function loadunbanTable() {
        endevent(); 

        fetch(base+"delete") 
            .then(res => res.text())
            .then(xmlStr => {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(xmlStr, "application/xml");
                    console.log(xml);

                    const tableDiv = document.getElementById("delete-table");
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
                        if (user === adminuser) {
                            continue;
                        }

                        const type= typeEl ? typeEl.textContent : "";

                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td>${user}</td>
                            <td>${type}</td>
                            <td><button class="but deleteBtn" value="${user}">Delete</button></td>
                        `;
                        table.appendChild(tr);
                    }

                    tableDiv.appendChild(table);

                document.querySelectorAll(".but.deleteBtn").forEach(btn => {
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
        fetch(base + "deleteupdate", {
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
            deletejsp();
        })
        .catch(() => {
            message.textContent = "Error contacting server.";
        });
        
        
    };

}