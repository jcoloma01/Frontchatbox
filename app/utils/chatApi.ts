const API_URL = "http://172.16.32.73:8000/stream_query";

// Fetch messages from the backend
export const fetchMessages = async () => {
  try {
    // Aseguramos que el backend reciba un POST con un cuerpo JSON
    const response = await fetch(API_URL, {
      method: "POST", // Cambiar a POST
      headers: {
        "Content-Type": "application/json", // Especificar que el cuerpo es JSON
      },
      body: JSON.stringify({ query: "getMessages" }), // Cambia 'getMessages' si el backend requiere algo diferente
    });

    if (!response.ok) throw new Error("Failed to fetch messages");
    return response.json(); // Devuelve la respuesta en formato JSON
  } catch (error) {
    console.error("Error fetching messages:", error);
    return []; // En caso de error, retorna un arreglo vacío
  }
};

// Send a new message to the backend
export const sendMessage = async (message: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }), // Aquí estamos enviando el mensaje con la clave 'query'
    });

    if (!response.ok) throw new Error("Failed to send message");
    return response.json(); // Devuelve la respuesta en formato JSON
  } catch (error) {
    console.error("Error sending message:", error);
    return null; // En caso de error, retorna null
  }
};
