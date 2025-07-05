   
    function endlisten() {
    const signupBtn = document.getElementById("signup");
    if (signupBtn) {
        signupBtn.removeEventListener("click", signlisten);
    }
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
const banlisten=()=>{
    
    
    
};
function addjsp(){
    
document.getElementById("signup").addEventListener("click",signlisten);
}

function banjsp(){

const banReasonModal = document.getElementById("banReason");
const banCloseBtn = document.getElementById("banClose");
const banInput = document.getElementById("banInput");
const banBtn = document.getElementById("banBtn");


let banreason = "";

// Show the modal
function showBanReason() {
    banReasonModal.style.display = "block";
    banInput.value = "";  // reset input
    banreason = "";       // clear previous value
}

// Hide the modal
function hideBanReason() {
    banReasonModal.style.display = "none";
}

// Attach listeners
banCloseBtn.addEventListener("click", hideBanReason);

banBtn.addEventListener("click", () => {
    banreason = banInput.value.trim();

    if (banreason.length === 0) {
        alert("Please enter a ban reason.");
        return;
    }

    console.log("Ban reason:", banreason);

    // send banreason somewhere or use as needed
    hideBanReason();
});

}