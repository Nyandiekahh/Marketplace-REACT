import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { messagesService } from '../services/messages';
import Loading from '../components/common/Loading';
import './MessagesPage.css';

const MessagesPage = () => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    try {
      const data = await messagesService.getConversations();
      setConversations(data.results || data);
      if (data.length > 0 && !selectedConversation) {
        selectConversation(data[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    try {
      const data = await messagesService.getConversation(conversation.id);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await messagesService.sendMessage(selectedConversation.id, newMessage);
      setNewMessage('');
      selectConversation(selectedConversation); // Reload messages
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="conversations-list">
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>
          {conversations.length === 0 ? (
            <div className="empty-state">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div className="conversations">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.other_participant?.first_name?.[0] || 'U'}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-name">
                      {conv.other_participant?.first_name} {conv.other_participant?.last_name}
                    </div>
                    <div className="conversation-preview">
                      {conv.last_message?.text || 'No messages yet'}
                    </div>
                  </div>
                  {conv.unread_count > 0 && (
                    <span className="unread-badge">{conv.unread_count}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="messages-panel">
          {selectedConversation ? (
            <>
              <div className="messages-header">
                <div className="messages-header-info">
                  <div className="conversation-avatar">
                    {selectedConversation.other_participant?.first_name?.[0] || 'U'}
                  </div>
                  <div>
                    <h3>
                      {selectedConversation.other_participant?.first_name}{' '}
                      {selectedConversation.other_participant?.last_name}
                    </h3>
                    {selectedConversation.ad && (
                      <p className="ad-title">{selectedConversation.ad.title}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="messages-body">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.is_mine ? 'message-mine' : 'message-theirs'}`}
                  >
                    <div className="message-content">{message.text}</div>
                    <div className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="messages-input">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !newMessage.trim()}>
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
