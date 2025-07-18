import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaPaperPlane, FaLocationDot } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import { MessageSquare, Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import styles from "../../styles/Chat.module.css";

// Sample data
const mockContacts = [
  {
    id: 1,
    name: "Sarah Uwimana",
    type: "student",
    lastMessage: "Is the room still available?",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    avatar: null,
    isOnline: true,
    propertyName: "Modern Apartment in Kimironko",
    propertyLocation: "Kimironko"
  },
  {
    id: 2,
    name: "John Mugisha",
    type: "landlord",
    lastMessage: "The viewing is scheduled for tomorrow at 2PM",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    propertyName: "Spacious House in Remera",
    propertyLocation: "Remera"
  },
  {
    id: 3,
    name: "Grace Mukamana",
    type: "student",
    lastMessage: "Are you still looking for a roommate?",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    avatar: null,
    isOnline: true,
    propertyName: "Shared Room in Kacyiru",
    propertyLocation: "Kacyiru"
  },
  {
    id: 4,
    name: "Paul Nkurunziza",
    type: "landlord",
    lastMessage: "The deposit is $200 and first month rent",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    avatar: null,
    isOnline: false,
    propertyName: "Studio in Nyabugogo",
    propertyLocation: "Nyabugogo"
  },
  {
    id: 5,
    name: "Marie Uwase",
    type: "student",
    lastMessage: "What's your budget range?",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    avatar: null,
    isOnline: true,
    propertyName: "Looking for Roommate",
    propertyLocation: "Kiyovu"
  }
];

const mockMessages = {
  1: [
    { id: 1, senderId: 1, text: "Hi! I saw your listing for the apartment in Kimironko. Is it still available?", timestamp: "10:30 AM", isOwn: false },
    { id: 2, senderId: "current", text: "Yes, it's still available! Would you like to schedule a viewing?", timestamp: "10:32 AM", isOwn: true },
    { id: 3, senderId: 1, text: "That would be great! When would be a good time?", timestamp: "10:35 AM", isOwn: false },
    { id: 4, senderId: "current", text: "How about tomorrow afternoon around 3PM?", timestamp: "10:36 AM", isOwn: true },
    { id: 5, senderId: 1, text: "Is the room still available?", timestamp: "10:38 AM", isOwn: false }
  ],
  2: [
    { id: 1, senderId: 2, text: "Hello! I'm interested in viewing the house in Remera.", timestamp: "Yesterday", isOwn: false },
    { id: 2, senderId: "current", text: "Great! I have availability tomorrow. What time works for you?", timestamp: "Yesterday", isOwn: true },
    { id: 3, senderId: 2, text: "The viewing is scheduled for tomorrow at 2PM", timestamp: "1 hour ago", isOwn: false }
  ],
  3: [
    { id: 1, senderId: 3, text: "Hi! I'm looking for a roommate in Kacyiru area.", timestamp: "3 hours ago", isOwn: false },
    { id: 2, senderId: "current", text: "I might be interested! What's the rent like?", timestamp: "3 hours ago", isOwn: true },
    { id: 3, senderId: 3, text: "Are you still looking for a roommate?", timestamp: "3 hours ago", isOwn: false }
  ]
};

const Chat = () => {
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact, messages]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.propertyLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg = {
      id: Date.now(),
      senderId: "current",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    setContacts(prev => prev.map(contact => 
      contact.id === selectedContact.id 
        ? { ...contact, lastMessage: newMessage, lastMessageTime: "now" }
        : contact
    ));

    setNewMessage("");
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleBackToContacts = () => {
    setSelectedContact(null);
  };

  return (
    <div className={styles.container}>
      {/* Contacts Sidebar */}
      <div 
        className={`${styles.sidebar} ${isMobileView && selectedContact ? styles.sidebarHidden : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            <MessageSquare size={24} className={styles.titleIcon} />
            Messages
          </h2>
          
          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className={styles.contactsList}>
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`${styles.contactItem} ${selectedContact?.id === contact.id ? styles.contactItemActive : ''}`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className={styles.contactAvatar}>
                <FaUser size={20} className={styles.avatarIcon} />
                {contact.isOnline && <div className={styles.onlineIndicator} />}
              </div>
              
              <div className={styles.contactInfo}>
                <div className={styles.contactHeader}>
                  <h4 className={styles.contactName}>{contact.name}</h4>
                  <span className={styles.contactTime}>{contact.lastMessageTime}</span>
                </div>
                
                <div className={styles.contactDetails}>
                  <span className={styles.contactType}>
                    {contact.type === 'landlord' ? '🏠 Landlord' : '🎓 Student'}
                  </span>
                  <div className={styles.propertyInfo}>
                    <FaLocationDot size={12} className={styles.locationIcon} />
                    <span className={styles.propertyLocation}>{contact.propertyLocation}</span>
                  </div>
                </div>
                
                <p className={styles.lastMessage}>
                  {contact.lastMessage}
                  {contact.unreadCount > 0 && (
                    <span className={styles.unreadBadge}>{contact.unreadCount}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        className={`${styles.chatArea} ${isMobileView && !selectedContact ? styles.chatAreaHidden : ''}`}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className={styles.chatHeader}>
              {isMobileView && (
                <button className={styles.backButton} onClick={handleBackToContacts}>
                  <ArrowLeft size={20} />
                </button>
              )}
              
              <div className={styles.chatHeaderInfo}>
                <div className={styles.chatAvatar}>
                  <FaUser size={20} className={styles.avatarIcon} />
                  {selectedContact.isOnline && <div className={styles.onlineIndicator} />}
                </div>
                
                <div className={styles.chatContactInfo}>
                  <h3 className={styles.chatContactName}>{selectedContact.name}</h3>
                  <div className={styles.chatContactDetails}>
                    <span className={styles.contactType}>
                      {selectedContact.type === 'landlord' ? '🏠 Landlord' : '🎓 Student'}
                    </span>
                    <span className={styles.chatPropertyInfo}>
                      <FaLocationDot size={12} className={styles.locationIcon} />
                      {selectedContact.propertyLocation}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={styles.chatActions}>
                <button className={styles.actionButton}>
                  <Phone size={18} />
                </button>
                <button className={styles.actionButton}>
                  <Video size={18} />
                </button>
                <button className={styles.actionButton}>
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messagesContainer}>
              {messages[selectedContact.id]?.map(message => (
                <div
                  key={message.id}
                  className={`${styles.messageWrapper} ${message.isOwn ? styles.messageWrapperOwn : ''}`}
                >
                  <div
                    className={`${styles.message} ${message.isOwn ? styles.messageOwn : styles.messageOther}`}
                  >
                    <p className={styles.messageText}>{message.text}</p>
                    <span className={styles.messageTime}>{message.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className={styles.messageForm}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className={styles.messageInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(e);
                  }
                }}
              />
              <button onClick={handleSendMessage} className={styles.sendButton}>
                <FaPaperPlane size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={64} className={styles.emptyStateIcon} />
            <h3 className={styles.emptyStateTitle}>Select a conversation</h3>
            <p className={styles.emptyStateText}>
              Choose a contact from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;