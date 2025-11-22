/* ============================
   1. VARIABLES (CONEXIÓN CON HTML)
============================ */
// Buscamos los elementos por el ID exacto que tienen en tu HTML
const micOpenBtn = document.getElementById("micOpen");     // El botón flotante grande
const chatPanel = document.getElementById("chatPanel");    // La ventana del chat
const chatCloseBtn = document.getElementById("chatClose"); // La X para cerrar
const messages = document.getElementById("messages");      // Donde van los textos
const userInput = document.getElementById("userInput");    // Donde escribes
const sendBtn = document.getElementById("sendBtn");        // Botón Enviar
const voiceBtn = document.getElementById("voiceBtn");      // Micrófono pequeño dentro del chat

let recognition; // Variable para guardar la herramienta de voz

/* ============================
   2. ABRIR Y CERRAR EL CHAT
============================ */
// Al hacer clic en el botón flotante
micOpenBtn.addEventListener("click", () => {
    chatPanel.classList.remove("hidden"); // Mostrar panel
    userInput.focus(); // Poner cursor para escribir
});

// Al hacer clic en la X
chatCloseBtn.addEventListener("click", () => {
    chatPanel.classList.add("hidden"); // Ocultar panel
});

/* ============================
   3. AGREGAR MENSAJES A LA PANTALLA
============================ */
function addMessage(text, sender) {
    const div = document.createElement("div");
    // Si es "user" pone estilo azul, si es "bot" pone estilo gris
    div.className = sender === "user" ? "msg-user" : "msg-bot";
    div.textContent = text;

    messages.appendChild(div);
    // Bajar automáticamente al último mensaje
    messages.scrollTop = messages.scrollHeight;
}

/* ============================
   4. CEREBRO DEL BOT (RESPUESTAS)
============================ */
function botReply(text) {
    const t = text.toLowerCase();
    let reply = "";

    // Lógica simple de respuestas
    if (t.includes("hola") || t.includes("buenos")) {
        reply = "¡Hola! ¿Cómo estás? Soy tu asistente virtual.";
    } 
    else if (t.includes("precio") || t.includes("costo")) {
        reply = "Nuestros servicios son personalizados. ¿Te gustaría una cotización?";
    } 
    else if (t.includes("gracias")) {
        reply = "¡Con gusto! Estoy para ayudarte.";
    }
    else {
        // Eco: Repite lo que dices para confirmar que te escuchó
        reply = "Escuché: " + text + ". (Prueba decir 'Hola')";
    }

    // El bot escribe y habla
    addMessage(reply, "bot");
    speak(reply);
}

/* ============================
   5. ENVIAR MENSAJE
============================ */
function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Poner mensaje del usuario
    addMessage(text, "user");
    userInput.value = "";

    // 2. Esperar un poquito y responder
    setTimeout(() => botReply(text), 600);
}

// Enviar con Clic
sendBtn.addEventListener("click", handleSend);

// Enviar con Enter
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSend();
});

/* ============================
   6. CONFIGURAR EL MICRÓFONO
============================ */
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new Rec();
    recognition.lang = "es-ES";       // Español
    recognition.interimResults = false;

    // Evento: Clic en el micrófono pequeño dentro del chat
    voiceBtn.addEventListener("click", () => {
        recognition.start();
        voiceBtn.style.backgroundColor = "red"; // Se pone rojo al escuchar
        userInput.placeholder = "Escuchando...";
    });

    // Cuando detecta voz
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        userInput.value = text;
        
        // Volver a la normalidad
        voiceBtn.style.backgroundColor = ""; 
        userInput.placeholder = "Escribe o habla...";
        
        handleSend(); // Enviar automáticamente
    };

    // Cuando termina (bien o mal)
    recognition.onend = () => {
        voiceBtn.style.backgroundColor = "";
        userInput.placeholder = "Escribe o habla...";
    };

} else {
    // Si el navegador no soporta voz (algunos Firefox viejos o IE)
    voiceBtn.style.display = "none";
    console.log("Tu navegador no soporta voz.");
}

/* ============================
   7. QUE EL BOT HABLE (TEXT-TO-SPEECH)
============================ */
function speak(text) {
    if ("speechSynthesis" in window) {
        // Cancelar si ya estaba hablando para que no se atropelle
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        window.speechSynthesis.speak(utterance);
    }
}