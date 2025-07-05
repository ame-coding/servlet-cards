const listeners = [];

function addListener(element, event, handler) {
    element.addEventListener(event, handler);
    listeners.push({ element, event, handler });
}

function endAllListeners() {
    for (const { element, event, handler } of listeners) {
        element.removeEventListener(event, handler);
    }
    listeners.length = 0;
}

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
function loadBanTable() {
    endAllListeners(); // clear previous listeners

    fetch("ban-servlet") // adjust URL if needed
        .then(res => res.text())
        .then(xmlStr => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlStr, "application/xml");

            const tableDiv = document.querySelector(".ban-table");
            tableDiv.innerHTML = "";

            const rows = xml.getElementsByTagName("table")[0].children;

            const table = document.createElement("table");
            table.style.width = "100%";
            table.style.borderCollapse = "collapse";

            const header = document.createElement("tr");
            header.innerHTML = `<th>User</th><th>Type</th><th>Action</th>`;
            table.appendChild(header);

            for (let row of rows) {
                const user = row.getElementsByTagName("user")[0].textContent;
                const type = row.getElementsByTagName("type")[0].textContent;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${user}</td>
                    <td>${type}</td>
                    <td><button class="banBtn" data-user="${user}">Ban</button></td>
                `;
                table.appendChild(tr);
            }

            tableDiv.appendChild(table);

            // attach banBtn logic
            document.querySelectorAll(".banBtn").forEach(btn => {
                addListener(btn, "click", () => {
                    showBanReason(btn.dataset.user);
                });
            });
        });
}

function addjsp(){
    
document.getElementById("signup").addEventListener("click",signlisten);
}

function banjsp(){
document.addEventListener("DOMContentLoaded", loadBanTable);

const banReasonModal = document.getElementById("banReason");
const banInput = document.getElementById("banInput");
const message = document.getElementById("message");

let currentUser = "";

function showBanReason(user) {
    currentUser = user;
    banInput.value = "";
    banReasonModal.hidden = false;
}

function hideBanReason() {
    banReasonModal.hidden = true;
}

addListener(document.getElementById("banClose"), "click", hideBanReason);

addListener(document.getElementById("banReasonBtn"), "click", () => {
    const reason = banInput.value.trim();
    if (!reason) {
        message.textContent = "Please enter a reason.";
        return;
    }

    fetch("ban-update", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user: currentUser, reason: reason })
    })
    .then(res => res.text())
    .then(response => {
        if (response.trim() === "success") {
            message.textContent = "User banned successfully.";
            loadBanTable(); // refresh table
        } else {
            message.textContent = "Failed to ban user.";
        }
        hideBanReason();
    })
    .catch(() => {
        message.textContent = "Error contacting server.";
        hideBanReason();
    });
});

}