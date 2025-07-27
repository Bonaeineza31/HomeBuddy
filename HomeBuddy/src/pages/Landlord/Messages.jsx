import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaPaperPlane } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { MessageSquare, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react";
import styles from "../../styles/LandlordMessages.module.css";

const mockContacts = [
  {
    id: 1,
    name: "Sarah Uwimana",
    type: "student",
    lastMessage: "Is the room still available?",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    propertyLocation: "Kimironko"
  },
  {
    id: 2,
    name: "John Mugisha",
    type: "landlord",
    lastMessage: "The viewing is scheduled for tomorrow at 2PM",
    lastMessageTime: "1 hour ago",
    unreadCount: 0,
    isOnline: false,
    propertyLocation: "Remera"
  },
  {
    id: 3,
    name: "Grace Mukamana",
    type: "student",
    lastMessage: "Are you still looking for a roommate?",
    lastMessageTime: "3 hours ago",
    unreadCount: 1,
    isOnline: true,
    propertyLocation: "Kacyiru"
  }
];

const mockMessages = {
  1: [
    { id: 1, senderId: 1, text: "Hi! Is it still available?", timestamp: "10:30 AM", isOwn: false },
    { id: 2, senderId: "current", text: "Yes, would you like a viewing?", timestamp: "10:32 AM", isOwn: true }
  ],
  2: [
    { id: 1, senderId: 2, text: "Hello! I'm interested in viewing the house in Remera.", timestamp: "Yesterday", isOwn: false },
    { id: 2, senderId: "current", text: "I’m available tomorrow. What time?", timestamp: "Yesterday", isOwn: true }
  ]
};

const LandMessages = () => {
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
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact, messages]);

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.propertyLocation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    const newMsg = {
      id: Date.now(),
      senderId: "current",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMsg]
    }));

    setContacts(prev =>
      prev.map(contact =>
        contact.id === selectedContact.id
          ? { ...contact, lastMessage: newMessage, lastMessageTime: "now" }
          : contact
      )
    );

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
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isMobileView && selectedContact ? styles.sidebarHidden : ""}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            <Link to="/landlord" className={styles.linkTitle}>
              <MessageSquare size={22} /> Messages
            </Link>
          </h2>
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.contactsList}>
          {filteredContacts.map(contact => (
            <div
              key={contact.id}
              className={`${styles.contactItem} ${selectedContact?.id === contact.id ? styles.contactItemActive : ""}`}
              onClick={() => handleContactSelect(contact)}
            >
              <div className={styles.contactAvatar}>
                <FaUser size={18} />
                {contact.isOnline && <span className={styles.onlineIndicator} />}
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactHeader}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactTime}>{contact.lastMessageTime}</span>
                </div>
                <div className={styles.contactSubInfo}>
                  <span>{contact.type === "landlord" ? "🏠" : "🎓"} {contact.propertyLocation}</span>
                </div>
                <p className={styles.lastMessage}>{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${styles.chatArea} ${isMobileView && !selectedContact ? styles.chatAreaHidden : ""}`}>
        {selectedContact ? (
          <>
            <div className={styles.chatHeader}>
              {isMobileView && (
                <button className={styles.backButton} onClick={handleBackToContacts}>
                  <ArrowLeft size={18} />
                </button>
              )}
              <div className={styles.chatContact}>
                <FaUser size={20} />
                <div>
                  <div className={styles.chatName}>{selectedContact.name}</div>
                  <div className={styles.chatMeta}>
                    {selectedContact.type === "landlord" ? "Landlord" : "Student"} | {selectedContact.propertyLocation}
                  </div>
                </div>
              </div>
              <div className={styles.chatActions}>
                <Phone size={18} />
                <Video size={18} />
                <MoreVertical size={18} />
              </div>
            </div>

            <div className={styles.messagesContainer}>
              {messages[selectedContact.id]?.map(msg => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.isOwn ? styles.own : styles.other}`}>
                  <div className={styles.messageBubble}>
                    <p>{msg.text}</p>
                    <span className={styles.timestamp}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.messageForm} onSubmit={handleSendMessage}>
              <input
                type="text"
                className={styles.messageInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit" className={styles.sendButton}>
                <FaPaperPlane size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={64} />
            <h3>Select a conversation</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandMessages;