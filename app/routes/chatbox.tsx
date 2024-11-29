// Tu código original actualizado con estilos visuales adicionales
import React, { useEffect, useState } from "react";
import { fetchMessages, sendMessage } from "~/utils/chatApi";

// Define la interfaz para los mensajes
interface Message {
  text: string;
  isOwnMessage: boolean;
}

const Chatbox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessageToBackend = async (message: string) => {
    try {
      const response = await fetch("http://172.16.32.73:8000/stream_query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAndSetMessages = async () => {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages as Message[]);
    };

    fetchAndSetMessages();
    const interval = setInterval(fetchAndSetMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: newMessage, isOwnMessage: true },
    ]);

    try {
      const backendResponse = await sendMessageToBackend(newMessage);

      if (backendResponse) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: backendResponse.query, isOwnMessage: false },
        ]);
      } else {
        console.error("No response from backend");
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }

    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col p-4">
        <h2 className="text-2xl font-bold mb-6">Chat</h2>
        <ul className="space-y-4">
          <li>
            <a
              href="#"
              className="block p-4 bg-blue-600 rounded-md shadow hover:bg-blue-500 transition"
            >
              Contact 1
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block p-4 bg-blue-600 rounded-md shadow hover:bg-blue-500 transition"
            >
              Contact 2
            </a>
          </li>
          <li>
            <a
              href="#"
              className="block p-4 bg-blue-600 rounded-md shadow hover:bg-blue-500 transition"
            >
              Contact 3
            </a>
          </li>
        </ul>
      </div>

      {/* Chatbox */}
      <div className="flex flex-col flex-grow bg-blue-100 p-4">
        <div className="flex-grow overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow max-w-[70%] ${
                msg.isOwnMessage
                  ? "bg-blue-200 self-end text-blue-900"
                  : "bg-white text-blue-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white px-4 py-2 ml-3 rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
