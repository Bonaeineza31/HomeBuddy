import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, MapPin, DollarSign, Users, Wifi, Car, Coffee, Dumbbell, Shield } from 'lucide-react';
import styles from '../styles/Chat.module.css'; // Import CSS module

// Sample housing data
const sampleListings = [
  {
    id: 1,
    title: "Modern Studio Apartment",
    location: "Downtown Campus Area",
    price: "$800/month",
    roommates: "1-2",
    amenities: ["WiFi", "Gym", "Parking", "Security"],
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=200&fit=crop",
    description: "Perfect for international students, close to university"
  },
  {
    id: 2,
    title: "Shared House - International Students",
    location: "Student Quarter",
    price: "$600/month",
    roommates: "3-4",
    amenities: ["WiFi", "Common Kitchen", "Study Room", "Laundry"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop",
    description: "Multicultural environment, great for making friends"
  },
  {
    id: 3,
    title: "Cozy 2-Bedroom Apartment",
    location: "Near University",
    price: "$950/month",
    roommates: "1-2",
    amenities: ["WiFi", "Parking", "Pet Friendly", "Balcony"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop",
    description: "Quiet neighborhood, perfect for studying"
  }
];

// Listing Card Component
const ListingCard = ({ listing, onViewDetails }) => {
  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': Wifi,
      'Gym': Dumbbell,
      'Parking': Car,
      'Security': Shield,
      'Common Kitchen': Coffee,
      'Study Room': Coffee,
      'Laundry': Coffee,
      'Pet Friendly': Coffee,
      'Balcony': Coffee
    };
    const IconComponent = icons[amenity] || Coffee;
    return <IconComponent size={14} />;
  };

  return (
    <div className={styles['listing-card']}>
      <img 
        src={listing.image} 
        alt={listing.title}
        className={styles['listing-image']}
      />
      <h4 className={styles['listing-title']}>
        {listing.title}
      </h4>
      <div className={`${styles['listing-detail']} ${styles['listing-location']}`}>
        <MapPin size={14} />
        <span>{listing.location}</span>
      </div>
      <div className={`${styles['listing-detail']} ${styles['listing-price']}`}>
        <DollarSign size={14} />
        <span>{listing.price}</span>
      </div>
      <div className={`${styles['listing-detail']} ${styles['listing-roommates']}`}>
        <Users size={14} />
        <span>{listing.roommates} roommates</span>
      </div>
      <div className={styles['amenities-container']}>
        {listing.amenities.map((amenity, index) => (
          <div key={index} className={styles['amenity-tag']}>
            {getAmenityIcon(amenity)}
            {amenity}
          </div>
        ))}
      </div>
      <p className={styles['listing-description']}>
        {listing.description}
      </p>
      <button 
        className={styles['view-details-btn']}
        onClick={() => onViewDetails && onViewDetails(listing)}
      >
        View Details
      </button>
    </div>
  );
};

// Contact Form Component
const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = () => {
    if (formData.name && (formData.email || formData.phone)) {
      onSubmit(formData);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className={styles['contact-form']}>
      <h4 className={styles['contact-form-title']}>Leave Your Contact Information</h4>
      <div>
        <input
          type="text"
          placeholder="Your Name *"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className={styles['contact-input']}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={styles['contact-input']}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className={styles['contact-input']}
        />
        <textarea
          placeholder="Any specific requirements?"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          rows="3"
          className={styles['contact-textarea']}
        />
        <button
          type="button"
          onClick={handleSubmit}
          className={styles['contact-submit-btn']}
        >
          Submit Contact Info
        </button>
      </div>
    </div>
  );
};

// Main Chat Bot Component
export const ChatBot = ({ onListingView, customListings = sampleListings }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey! How may I help you today? 😊",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationStep, setConversationStep] = useState('greeting'); // greeting, housing_interest, listings, contact
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase().trim();
    
    // Simple greetings
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const housingKeywords = ['housing', 'house', 'apartment', 'room', 'home', 'rent', 'place to stay', 'accommodation'];
    const positiveResponses = ['yes', 'yeah', 'sure', 'okay', 'ok', 'yep', 'of course', 'definitely'];
    
    switch (conversationStep) {
      case 'greeting':
        if (greetings.some(greeting => message.includes(greeting))) {
          setConversationStep('housing_interest');
          return {
            text: "Hello! Nice to meet you! \n\nDo you want help finding housing? I can show you some great options!"
          };
        } else if (housingKeywords.some(keyword => message.includes(keyword)) || positiveResponses.some(response => message.includes(response))) {
          setConversationStep('listings');
          return {
            text: "Perfect! I'd love to help you find the right housing. Here are some available options:",
            showListings: customListings
          };
        } else {
          return {
            text: "I'm here to help you with housing! Are you looking for a place to stay?"
          };
        }

      case 'housing_interest':
        if (positiveResponses.some(response => message.includes(response)) || housingKeywords.some(keyword => message.includes(keyword))) {
          setConversationStep('listings');
          return {
            text: "Excellent! Let me show you some available housing options:",
            showListings: customListings
          };
        } else if (message.includes('no') || message.includes('not really')) {
          setConversationStep('contact');
          return {
            text: "No problem! If you need any assistance later, feel free to reach out. Would you like to leave your contact information so one of our agents can help you with other services?",
            showContact: true
          };
        } else {
          return {
            text: "I can help you find housing! Just let me know if you're interested in seeing some available places."
          };
        }

      case 'listings':
        if (message.includes('contact') || message.includes('agent') || message.includes('call me') || message.includes('reach out')) {
          setConversationStep('contact');
          return {
            text: "I'd be happy to connect you with one of our agents! Please leave your contact information and an agent will reach out to you soon:",
            showContact: true
          };
        } else if (message.includes('more') || message.includes('other') || message.includes('different')) {
          return {
            text: "Here are some additional housing options for you:",
            showListings: customListings
          };
        } else {
          return {
            text: "Great question! If you'd like more detailed information or want to schedule a viewing, I can connect you with one of our agents. Would you like me to have an agent reach out to you?"
          };
        }

      case 'contact':
        return {
          text: "Thank you for your interest! An agent will contact you within 24 hours. Is there anything else I can help you with today?"
        };

      default:
        return {
          text: "I'm here to help! Are you looking for housing assistance?"
        };
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate realistic bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        listings: botResponse.showListings,
        showContact: botResponse.showContact
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContactSubmit = (contactData) => {
    const confirmationMessage = {
      id: Date.now(),
      text: `Thank you, ${contactData.name}! I've received your contact information. One of our agents will reach out to you soon. Have a great day! 🏠✨`,
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, confirmationMessage]);
    setConversationStep('contact');
  };

  const handleListingView = (listing) => {
    if (onListingView) {
      onListingView(listing);
    } else {
      console.log('Viewing listing:', listing);
    }
  };

  return (
    <div className={styles['chat-container']}>
      {/* Chat Header */}
      <div className={styles['chat-header']}>
        <MessageSquare size={24} />
        <div>
          <h3>HomeBuddy Assistant</h3>
          <p>Find your perfect home match</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className={styles['messages-container']}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`${styles['message-wrapper']} ${styles[message.sender]}`}
          >
            <div className={`${styles.message} ${styles[message.sender]}`}>
              {message.text}
              {message.listings && message.listings.length > 0 && (
                <div className={styles['listings-container']}>
                  {message.listings.map(listing => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      onViewDetails={handleListingView}
                    />
                  ))}
                </div>
              )}
              {message.showContact && (
                <ContactForm onSubmit={handleContactSubmit} />
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className={`${styles['message-wrapper']} ${styles.bot}`}>
            <div className={styles['typing-indicator']}>
              <div className={styles['typing-dot']}></div>
              <div className={styles['typing-dot']}></div>
              <div className={styles['typing-dot']}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={styles['input-container']}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={styles['chat-input']}
          disabled={isTyping}
        />
        <button
          onClick={handleSendMessage}
          className={styles['send-button']}
          disabled={!inputMessage.trim() || isTyping}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

// Floating Chat Button Component
export const FloatingChatButton = ({ onListingView, customListings }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className={styles['floating-chat-button']}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles['float-button']}
          aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className={styles['floating-chat-window']}>
          <ChatBot 
            onListingView={onListingView} 
            customListings={customListings}
          />
        </div>
      )}
    </>
  );
};

// Chat Page Component (for full-page chat)
export const ChatPage = ({ onListingView, customListings }) => {
  return (
    <div className={styles['full-chat-page']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Find Your Perfect Home</h1>
        <p className={styles['page-subtitle']}>
          Chat with our AI assistant to discover housing that matches your lifestyle and budget
        </p>
      </div>
      <ChatBot 
        onListingView={onListingView} 
        customListings={customListings}
      />
    </div>
  );
};

export default ChatBot;