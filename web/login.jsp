
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Login</title>
<style>

@font-face {
    font-family: 'Jacquard';
    src: url('fonts/Jacquard.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

.login-container {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    width: 35%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    
}

.login-container h1 {
    font-family: 'Jacquard', serif;
    color: rgba(255, 255, 255, 0.95);
    font-size: 80px;
    text-align: center;
    margin: 0 0 8px 0;
}

.login {
	margin:0;
    display: flex;
    flex-direction: column;
    gap: 5px; 
    background: rgba(0, 0, 0, 0.4); 
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 6px;
}

.input-box {
	margin-top: -5px;
	 display: flex;
    flex-direction: column;
    font-size: 14px;
    font-family: Arial, sans-serif;
    color: #ddd;
    margin-bottom: 3px;
    text-align: left;
}

.login input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid rgba(128, 128, 128, 0.4);
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    font-size: 14px;
    box-sizing: border-box;
}

.login input:focus {
    outline: none;
    border-color: #a0522d;
    background: rgba(0, 0, 0, 0.3);
}

.login input::placeholder {
    color: #aaa;
}

.logbut {
    align-self: center;
    margin-top: 8px; 
    padding: 8px 16px;
    background-color: #a0522d;
    color: #fff3e0;
    font-weight: bold;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
}

.logbut:hover {
    background-color: #8b4513;
}

#check {
    color: #cc7722;
    font-size: 13px;
    text-align: center;
    margin: 5px 0;
    font-family: Arial, sans-serif;
}

.signup-link {
    color: #cc7722;
    font-size: 14px;
    cursor: pointer;
    background: none;
    border: none;
    text-align: center;
    display: block;
      margin:0;
}

.signup-link:hover {
    color: #e38d45;
}

</style>
</head>
<body>
    <div class="login-container">
        <h1>Natuur</h1>
<div class="login">
  <div class="input-box">
    <p>Email</p><input type="email" id="email" required>
    <p>Password</p><input type="password" id="pass" required>
   </div>
    <button type="button" class="logbut" id="login">Login</button>
  <p id="check"></p>
  <button class="signup-link" onclick="location.href='index.jsp?view=signup'">Signup</button>
</div>
    </div>
<script>
     const base = '<%= request.getContextPath() %>/';
document.getElementById("login").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("pass").value.trim();
    const check = document.getElementById("check");

    if (!email || !pass) {
        check.textContent = "Enter both email and password";
        return;
    }

    check.textContent = "Logging in...";

    const xmlsend =
        "<login><user>"+email+"</user><pass>"+pass+"</pass></login>";

    fetch(base+"login", {
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
            check.textContent = "No message was sent from Login.java";
            return;
        }

        if (message.trim() === "Login valid") {
            window.location.href = "index.jsp";
        } else {
            check.textContent = message;
        }
    })
    .catch(err => {
        console.error(err);
        check.textContent = "Error contacting server.";
    });
});
</script>

</body>
</html>