
<%@page contentType="text/html" pageEncoding="UTF-8"%>


<div class="content-container">
  <div class="input-box">
    <p>Email</p><input type="email" id="email" required>
    <p>Password</p><input type="text" id="pass" required>
    <p>Type</p>
    <div class="type-radio">
        <label><input type="radio" name="userType" value="admin" required>Admin</label>
  <label><input type="radio" name="userType" value="player" required checked>Player</label>
    </div>
   </div>
    <button type="button" class="but" id="signup">Add</button>
  <p id="check"></p>
</div>

