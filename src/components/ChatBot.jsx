import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/chat-bot.scss';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { user } = useSelector(state => state.auth);

  const handleSendMessage = () => {
    if (message.trim()) {
      const botResponse = message.includes('статус') ? 'Ваш статус заявки: Подана. Ожидайте проверки.' : 'Пожалуйста, уточните ваш запрос!';
      setChatHistory([...chatHistory, { user: message, bot: botResponse }]);
      setMessage('');
    }
  };

  if (!user) return null;

  return (
    <div className="chat-bot">
      <h2>Чат-бот</h2>
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index}>
            <p><strong>Вы:</strong> {msg.user}</p>
            <p><strong>Бот:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default ChatBot;