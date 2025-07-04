
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Admin Panel</title>
  <style>
  

    .container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 220px;
      background: #222;
      color: #fff;
      padding: 20px;
      flex-shrink: 0;
      transition: transform 0.3s ease;
    }

    .sidebar nav a {
      display: block;
      margin: 15px 0;
      color: white;
      text-decoration: none;
    }

    .sidebar h2 {
      margin-bottom: 20px;
    }

    /* Main */
    .main {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: #f5f5f5;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .menu-button {
      display: none;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }

    /* Grid */
    .content-grid {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .card {
      background: #fff;
      border: 1px solid #ccc;
      padding: 20px;
      border-radius: 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
        z-index: 1000;
      }

      .sidebar.open {
        transform: translateX(0);
      }

      .menu-button {
        display: block;
      }

      .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0,0,0,0.3);
        z-index: 900;
      }

      .overlay.show {
        display: block;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar" id="sidebar">
      <h2>Admin</h2>
      <nav>
        <a href="#">Dashboard</a>
        <a href="#">Users</a>
        <a href="#">Settings</a>
        <a href="#">Logout</a>
      </nav>
    </div>

    <div class="overlay" id="overlay"></div>

    <main class="main">
      <header class="header">
        <button id="toggleSidebar" class="menu-button">☰</button>
        <h1>Dashboard</h1>
      </header>

      <section class="content-grid">
        <div class="card">Widget A</div>
        <div class="card">Widget B</div>
        <div class="card">Widget C</div>
        <div class="card">Widget D</div>
        <div class="card">Widget E</div>
        <div class="card">Widget F</div>
      </section>
    </main>
  </div>

  <script>
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
  </script>
</body>
</html>
