// Login: Daten an den Backend-Login-Endpoint senden
async function handleLogin(event) {
    event.preventDefault();

    // Formular-Daten abrufen
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validierung
    if (!username || !password) {
        alert('Bitte Benutzername und Passwort eingeben.');
        return;
    }

    // Daten vorbereiten
    const data = { username, password };

    try {
        // Anfrage an den Server senden
        const response = await fetch('http://localhost:5080/api/Users/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();

            // Token und userId speichern
            if (result.token && result.userId) {
                localStorage.setItem('authToken', result.token);
                localStorage.setItem('userId', result.userId);
                alert('Login erfolgreich!');

                // Weiterleitung zur gewünschten Seite
                window.location.href = 'bestellung.html';
            } else {
                alert('Login erfolgreich, aber Daten konnten nicht gespeichert werden.');
            }
        } else {
            const error = await response.json();
            alert(`Login fehlgeschlagen: ${error.message || 'Unbekannter Fehler'}`);
        }
    } catch (error) {
        console.error('Fehler:', error);
        alert('Ein unerwarteter Fehler ist aufgetreten.');
    }
}

// Event-Listener für das Login-Formular hinzufügen
document.getElementById('login-form').addEventListener('submit', handleLogin);
