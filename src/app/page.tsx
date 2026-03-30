'use client';

import React, { useState, useMemo } from 'react';
import { Search, MoreVertical, MessageSquare, Phone, Video, Paperclip, Smile, Send } from 'lucide-react';

const MOCK_CONTACTS = [
  { id: 1, name: 'Alice', lastMessage: 'See ya later!', time: '10:45 AM', image: 'https://i.pravatar.cc/150?u=alice' },
  { id: 2, name: 'Bob', lastMessage: 'Did you see the match?', time: '9:30 AM', image: 'https://i.pravatar.cc/150?u=bob' },
  { id: 3, name: 'Charlie', lastMessage: 'Okay, thanks!', time: 'Yesterday', image: 'https://i.pravatar.cc/150?u=charlie' },
  { id: 4, name: 'David', lastMessage: 'How are you?', time: 'Monday', image: 'https://i.pravatar.cc/150?u=david' },
];

const MOCK_MESSAGES: Record<number, { id: number; text: string; time: string; self: boolean }[]> = {
  1: [
    { id: 1, text: 'Hi Alice!', time: '10:00 AM', self: true },
    { id: 2, text: 'Hey there! How is it going?', time: '10:01 AM', self: false },
    { id: 3, text: 'All good. Ready for our chat?', time: '10:40 AM', self: true },
    { id: 4, text: 'See ya later!', time: '10:45 AM', self: false },
  ],
  2: [
    { id: 101, text: 'Did you see the match?', time: '9:30 AM', self: false },
  ],
  3: [
    { id: 201, text: 'I sent the files.', time: 'Yesterday', self: true },
    { id: 202, text: 'Okay, thanks!', time: 'Yesterday', self: false },
  ],
  4: [
    { id: 301, text: 'How are you?', time: 'Monday', self: false },
  ]
};

export default function WhatsAppClone() {
  const [selectedContactId, setSelectedContactId] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messagesData, setMessagesData] = useState(MOCK_MESSAGES);

  const selectedContact = useMemo(() => 
    MOCK_CONTACTS.find(c => c.id === selectedContactId), 
  [selectedContactId]);

  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
    };

    setMessagesData(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));
    setMessageInput('');
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile-img">
            <img src="https://i.pravatar.cc/150?u=me" alt="me" className="avatar" />
          </div>
          <div className="header-actions">
            <button className="btn-icon"><MessageSquare size={20} /></button>
            <button className="btn-icon"><MoreVertical size={20} /></button>
          </div>
        </div>

        <div className="search-container">
          <div className="search-box">
            <Search size={18} color="#8696a0" />
            <input 
              type="text" 
              placeholder="Search or start new chat" 
              className="search-input"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list">
          {filteredContacts.map(contact => (
            <div 
              key={contact.id} 
              className={`chat-item ${selectedContactId === contact.id ? 'active' : ''}`}
              onClick={() => setSelectedContactId(contact.id)}
            >
              <img src={contact.image} alt={contact.name} className="avatar" />
              <div className="chat-info" style={{ marginLeft: '15px', flex: 1, borderBottom: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '500' }}>{contact.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{contact.time}</span>
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {contact.lastMessage}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-window">
        {selectedContact ? (
          <>
            <div className="chat-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={selectedContact.image} alt={selectedContact.name} className="avatar" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '500' }}>{selectedContact.name}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>online</span>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-icon"><Video size={20} /></button>
                <button className="btn-icon"><Phone size={20} /></button>
                <button className="btn-icon" style={{ borderLeft: '1px solid var(--divider)', marginLeft: '10px', borderRadius: '0' }}>
                  <Search size={20} style={{ marginLeft: '10px' }} />
                </button>
                <button className="btn-icon"><MoreVertical size={20} /></button>
              </div>
            </div>

            <div className="messages-area">
              {(messagesData[selectedContactId] || []).map(msg => (
                <div 
                  key={msg.id} 
                  className={`message-bubble ${msg.self ? 'message-self' : 'message-other'}`}
                >
                  {msg.text}
                  <span className="message-time">{msg.time}</span>
                </div>
              ))}
            </div>

            <div className="input-area">
              <button className="btn-icon"><Smile size={24} /></button>
              <button className="btn-icon"><Paperclip size={24} /></button>
              <input 
                type="text" 
                placeholder="Type a message" 
                className="message-input"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="btn-icon" onClick={handleSendMessage}>
                <Send size={24} color={messageInput ? '#00a884' : '#8696a0'} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            Select a contact to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
