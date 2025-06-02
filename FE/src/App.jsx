import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './App.css';
import Users from './Users'
import { Button, Row, Col, Modal } from 'reactstrap';

const socket = io('http://localhost:4000');

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState('');
  const chatBoxRef = useRef(null);

  //pridobi podatke
  const fetchData = async () => {
    const messagesRes = await axios.get('http://localhost:4000/api/messages');
    setMessages(messagesRes.data);
  };

  useEffect(() => {
    fetchData();
    const storedUser = localStorage.getItem('chatUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentUserId(JSON.parse(storedUser)?.id);
    } else {
      setShowLogin(true);
    }

    //prejeto novo sporočilo
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    //posodobljena reakcija
    socket.on('messageReactionUpdated', (update) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === update.id ? { ...msg, likes: update.likes } : msg))
      );
    });
    //limita sporočil
    socket.on('rateLimitExceeded', (data) => {
      alert(data.message); 
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageReactionUpdated');
      socket.off('rateLimitExceeded');
    };
  }, []);

  //ko pride novo sporočilo pojdi na novo sporočilo
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  //shrani novo sporočilo
  const sendMessage = () => {
    if (!input.trim() || !currentUserId) return;
    socket.emit('sendMessage', {
      userId: currentUserId,
      text: input
    });

    setInput('');
  };

  //login uporabnika
  const handleLogin = async (name) => {
    try {
      const res = await axios.post('http://localhost:4000/auth/login', { name });
      localStorage.setItem('chatUser', JSON.stringify(res.data.user));
      setUser(res.data.user);
      setCurrentUserId(res.data.user.id);
      setShowLogin(false);
      if (res?.data?.newUser) {
        fetchData()
      }
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: 'auto'
          });
        }
      }, 150);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  //odjava uporabnika
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:4000/auth/logout', { id: user.id });
    } catch (err) {
      console.warn('Logout failed:', err.message);
    } finally {
      localStorage.removeItem('chatUser');
      setUser(null);
      setCurrentUserId(null)
      setShowLogin(true);
    }
  };

  //shrani reakcijo na sporočilo
  const reactToMessage = async (messageId, type) => {
    try {
      await axios.post(`http://localhost:4000/api/messages/${messageId}/react`, {
        userId: currentUserId,
        username: user.name,
        type

      });
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  return (
    <div className="App">
      <Row style={{ marginBottom: '1rem' }}>
        <Col md="6"><h2>Chat Channel</h2>
        </Col>
        <Col md="6" >
          {user ? (
            <div style={{ display: 'flex', alignItems: 'right', gap: '1rem', float: 'right' }}>
              <h2>Welcome, {user.name}!</h2>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            showLogin && (
              <Modal isOpen={showLogin}  >
                <LoginModal
                  onLogin={handleLogin}
                  error={error}
                  setError={setError}
                />
              </Modal>
            )
          )}
        </Col>
      </Row>

      {!showLogin ? (
        <Row className="main-content">
          <Col md="2" style={{ overflowY: 'auto' }}>
            <Users />
          </Col>
          <Col md="10" className="fill-height">
            <div className="chat-box" ref={chatBoxRef}>
              {messages.map((msg) => {
                const likeCount = msg.likes?.filter(r => r.type === 'like').length || 0;
                const dislikeCount = msg.likes?.filter(r => r.type === 'dislike').length || 0;
                const hasLiked = msg.likes?.some(r => r.userId === currentUserId && r.type === 'like');
                const hasDisliked = msg.likes?.some(r => r.userId === currentUserId && r.type === 'dislike');
                const likeUsers = msg.likes?.filter(r => r.type === 'like') || [];
                const dislikeUsers = msg.likes?.filter(r => r.type === 'dislike') || [];

                const likeTooltip = likeUsers.map(r => r.username).join('\n ') || 'No likes';
                const dislikeTooltip = dislikeUsers.map(r => r.username).join('\n ') || 'No dislikes';

                return (
                  <div key={msg.id} className={msg.user_id === currentUserId ? 'my-msg' : 'msg'}>
                    <strong>{msg.username}:</strong> {msg.text}
                    <div className="timestamp">{new Date(msg.date * 1000).toLocaleTimeString()}</div>
                    <div>
                      <button
                        className={`reaction-button ${hasLiked ? 'reaction-liked' : ''}`}
                        onClick={() => reactToMessage(msg.id, 'like')}
                        title={`Liked by: ${likeTooltip}`}
                      >
                        👍 {likeCount}
                      </button>
                      <button
                        className={`reaction-button ${hasDisliked ? 'reaction-disliked' : ''}`}
                        onClick={() => reactToMessage(msg.id, 'dislike')}
                        title={`Disliked by: ${dislikeTooltip}`}
                      >
                        👎 {dislikeCount}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="input-area" style={{ gap: '1rem' }}>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
              />
              <Button color='primary' onClick={sendMessage}>Send</Button></div>
          </Col>
        </Row>
      ) : (<>
      </>)}
    </div>
  );
}

//modal za prijavo uporabnika
function LoginModal({ onLogin, error, setError }) {
  console.log("object")
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    await onLogin(name);
  };

  return (
    <div >
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Button type="submit" color="primary" style={{ width: "100%", marginTop: "1rem" }}>Login</Button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>

  );
}

export default App;
