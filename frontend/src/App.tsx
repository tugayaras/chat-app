import { useEffect, useState } from 'react';
import { HubConnectionBuilder,HubConnection } from '@microsoft/signalr';

function App() {
  type Message = {
  user: string;       
  message: string;
};
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages,setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
  const [username, setUsername] = useState('Kullanici');

  useEffect(()=> {
    const conn=
     new HubConnectionBuilder()
 .withUrl("http://localhost:5059/chatHub")
.withAutomaticReconnect()
.build();
conn.on("ReceiveMessage",
  (user,message) =>{
      setMessages(prev => 
        [...prev,{user,message}]);
});

conn.start().then(() =>
console.log("SignalR Bağlanamadı."));
setConnection(conn);
 },[]);

 const sendMessage = async () => {
  if(connection && input){
    await connection.invoke(
      "SendMessage",username,
      input
    );
    setInput('');
  }
  else{
     console.warn("SignalR bağlantısı henüz hazır değil.");
  }
 };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat Uygulaması</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Adınız" />
      <div style={{ marginTop: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Mesaj yazın..." />
        <button onClick={sendMessage}>Gönder</button>
      </div>
      <ul>
        {messages.map((msg, idx) => (
          <li key={idx}><b>{msg.user}</b>: {msg.message}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
