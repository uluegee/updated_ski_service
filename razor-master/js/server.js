// Überprüfen, ob der Benutzer eingeloggt ist
// Wenn nicht, wird zur Login-Seite weitergeleitet
document.addEventListener("DOMContentLoaded", () => {
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!authToken || !userId) {
    alert("Bitte loggen Sie sich ein, um fortzufahren.");
    window.location.href = "login.html"; // Weiterleitung zur Login-Seite
  }
});

// Helper-Funktion: Validiert eine E-Mail-Adresse
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

// Helper-Funktion: Validiert eine Telefonnummer
function validatePhone(phone) {
  const phonePattern = /^[0-9\s+()-]{7,15}$/;
  return phonePattern.test(phone);
}

// Ticket-Erstellung: Daten an den Backend-Ticket-Endpoint senden
document.getElementById("booking-form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Verhindert das automatische Neuladen der Seite

  // Formulardaten sammeln
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const serviceType = document.querySelector('input[name="selection"]:checked')?.value;
  const priority = document.getElementById("specialities").value;

  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");

  if (!authToken || !userId) {
    alert("Sie müssen eingeloggt sein, um diesen Service zu buchen.");
    window.location.href = "login.html";
    return;
  }

  // Validierung der Eingaben
  if (!name || !email || !phone || !serviceType || !priority) {
    alert("Bitte füllen Sie alle Pflichtfelder aus.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
    return;
  }

  if (!validatePhone(phone)) {
    alert("Bitte geben Sie eine gültige Telefonnummer ein.");
    return;
  }

  // Payload erstellen
  const payload = {
    Name: name,
    Email: email,
    Phone: phone,
    Priority: priority,
    Service: serviceType,
    Status: "Pending", // Standardstatus
    AssignedTo: parseInt(userId), // Eingeloggter Benutzer
  };

  try {
    // Daten an den Server senden
    const response = await fetch("http://localhost:5080/api/ServiceOrders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Token für Authentifizierung
      },
      body: JSON.stringify(payload),
    });

    // Antwort des Servers verarbeiten
    if (response.ok) {
      document.getElementById("confirmationMessage").innerText =
        "Buchung erfolgreich! Vielen Dank für Ihre Anfrage.";
      document.getElementById("confirmationMessage").style.color = "green";
    } else {
      const error = await response.json();
      console.error("Fehler beim Buchen:", error);
      document.getElementById("confirmationMessage").innerText =
        "Fehler bei der Buchung. Bitte versuchen Sie es später erneut.";
      document.getElementById("confirmationMessage").style.color = "red";
    }
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
    document.getElementById("confirmationMessage").innerText =
      "Es gab ein Problem beim Verbinden mit dem Server.";
    document.getElementById("confirmationMessage").style.color = "red";
  }
});
