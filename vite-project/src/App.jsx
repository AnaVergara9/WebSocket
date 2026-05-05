import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function App() {
  //useState es un hook de React que nos permite ir actualizando lo de la pantalla sin necesidad de recargarla
  const [socket, setSocket] = useState();

  useEffect(() => {
    // Cuando yo carge la pagina hace lo que meta ahí dentro, en este caso, se conecta al servidor de socket.io
    const newSocket = io("localhost:3000");

    return () => {
      newSocket.disconnect();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    if(socket) {
      socket.emit("message", inputMessage)
    }
  }
  
  return (
    <div>
      <form>
        <input type="text" placeholder="Escribir el mensaje"/>
        <button>Enviar</button>
      </form>
    </div>
  )
}

export default App;
