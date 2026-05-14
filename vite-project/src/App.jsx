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

  return (
    <div>
      <form onSubmit ={handleSubmit}>
        <input type="text" value={inputMessage} placeholder="Escribe el mensaje"
          onChange={(e) => setInputMessage(e.target.value)}
          />
        <button type="submit">Enviar</button>
      </form>
      <ul>
        {
          // mensaje = { user: "Pepe", inputMessage: "Hola" }
          mensajesRecibidos.map((mensaje, index) => (<li key={index}>
            <strong>{mensaje.user}</strong> <span>({mensaje.hora}):</span> {mensaje.texto}
          </li>))
        }
      </ul>
    </div>
  )
}

export default App;