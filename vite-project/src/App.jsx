import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  //useState es un hook de React que nos permite ir actualizando lo de la pantalla sin necesidad de recargarla
  const [socket, setSocket] = useState();
  const [inputMessage, setInputMessage] = useState("");
  const [mensajesRecibidos, setMensajeRecibido] = useState([]);
  const [user, setUser] = useState("")

  useEffect(() => {
    // Cuando yo carge la pagina hace lo que meta ahí dentro, en este caso, se conecta al servidor de socket.io
    const newSocket = io("http://localhost:3000/");
    setSocket(newSocket);

    newSocket.on("message", (msg) => {
      setMensajeRecibido(msg);
    });

    setUser(prompt("Ingrese su nombre"))

    return () => {
      newSocket.disconnect();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if(socket && inputMessage.trim() !== "") {
      const nuevoMensaje = {
        user: user,
        texto: inputMessage,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };

      socket.emit("message", nuevoMensaje);
      setInputMessage("");
    }
  }


  // ... resto del código igual

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'Arial' }}>
      <h2>Chat en vivo</h2>
      
      {/* Caja de mensajes con scroll */}
      <div style={{ 
        border: '1px solid #ddd', 
        height: '400px', 
        overflowY: 'scroll', 
        padding: '10px',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        marginBottom: '10px'
      }}>
        {mensajesRecibidos.map((mensaje, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            padding: '8px 12px',
            borderRadius: '15px',
            backgroundColor: mensaje.user === user ? '#dcf8c6' : '#fff', // Color diferente si es mi mensaje
            alignSelf: mensaje.user === user ? 'flex-end' : 'flex-start',
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            width: 'fit-content',
            maxWidth: '80%'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#555', fontWeight: 'bold' }}>
              {mensaje.user} <span style={{ fontWeight: 'normal', fontSize: '0.7rem', marginLeft: '5px' }}>{mensaje.hora}</span>
            </div>
            <div style={{ marginTop: '3px' }}>{mensaje.texto}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '5px' }}>
        <input 
          type="text" 
          value={inputMessage} 
          placeholder="Escribe un mensaje..."
          onChange={(e) => setInputMessage(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;