// Registrierung: Daten an den Backend-Registrierungs-Endpoint senden
async function handleRegister(event) {
    event.preventDefault();
  
    // Formular-Daten abrufen
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm_password")
      .value.trim();
  
    // Validierung
    if (!username || !password || !confirmPassword) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }
  
    if (password !== confirmPassword) {
      document.getElementById("password-error").style.display = "block";
      return;
    } else {
      document.getElementById("password-error").style.display = "none";
    }
  
    // Daten vorbereiten
    const data = { username, password };
  
    // Anfrage an den Server senden
    try {
      const response = await fetch("http://localhost:5080/api/Users/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert("Registrierung erfolgreich! Sie können sich jetzt anmelden.");
        // Weiterleitung zur Login-Seite
        window.location.href = "login.html";
      } else {
        const error = await response.json();
        alert(
          `Fehler bei der Registrierung: ${error.message || "Unbekannter Fehler"}`
        );
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Ein unerwarteter Fehler ist aufgetreten.");
    }
  }
  
  // Event-Listener für das Formular
  document
    .getElementById("register-form")
    .addEventListener("submit", handleRegister);
  