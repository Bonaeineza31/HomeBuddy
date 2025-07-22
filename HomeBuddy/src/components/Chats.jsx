// ChatComponents.jsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Home, MapPin, DollarSign, Users, Wifi, Car, Coffee, Dumbbell, Shield, HomeIcon } from 'lucide-react';
import styles from '../styles/Chat.module.css'; // Import your CSS module
import { MdHomeFilled } from 'react-icons/md';
import { HiHomeModern } from 'react-icons/hi2';

// Sample housing data - replace with your actual data source
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

// Main Chat Bot Component
export const ChatBot = ({ onListingView, customListings = sampleListings }) => {
  const [messages, setMessages] = useState([
    {
  text: (
    <span>
      Hi! I'm your HomeBuddy assistant. I'll help you find the perfect housing match! <HiHomeModern size={16} className="inline" />
      <br /><br />
      Tell me about your preferences:<br />
      • Budget range<br />
      • Preferred location<br />
      • Lifestyle preferences<br />
      • Any specific amenities you need
    </span>
  ),
  sender: 'bot',
  timestamp: new Date()
}
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const listings = customListings;
    
    // Enhanced keyword matching for better responses
    if (message.includes('budget') || message.includes('price') || message.includes('$') || message.includes('cheap') || message.includes('affordable')) {
      return {
        text: "Great! Budget is important for students. I found some affordable options that fit different budgets:",
        showListings: listings.filter(listing => 
          parseInt(listing.price.replace(/[^0-9]/g, '')) < 700
        )
      };
    }
    
    if (message.includes('gym') || message.includes('fitness') || message.includes('exercise') || message.includes('workout')) {
      return {
        text: "Looking for places with fitness facilities? Here are options with gym access:",
        showListings: listings.filter(listing => 
          listing.amenities.some(amenity => amenity.toLowerCase().includes('gym'))
        )
      };
    }
    
    if (message.includes('parking') || message.includes('car')) {
      return {
        text: "Need parking for your car? Here are properties with parking available:",
        showListings: listings.filter(listing => 
          listing.amenities.some(amenity => amenity.toLowerCase().includes('parking'))
        )
      };
    }
    
    if (message.includes('downtown') || message.includes('campus') || message.includes('university') || message.includes('near campus')) {
      return {
        text: "Perfect! Location near campus saves time and transport costs. Here are close options:",
        showListings: listings.filter(listing => 
          listing.location.toLowerCase().includes('campus') || 
          listing.location.toLowerCase().includes('university') ||
          listing.location.toLowerCase().includes('downtown')
        )
      };
    }
    
    if (message.includes('roommate') || message.includes('shared') || message.includes('friends') || message.includes('social')) {
      return {
        text: "Shared housing is great for international students! You'll save money and make friends:",
        showListings: listings.filter(listing => 
          parseInt(listing.roommates.split('-')[1] || listing.roommates.split('-')[0]) > 1
        )
      };
    }
    
    if (message.includes('quiet') || message.includes('study') || message.includes('peaceful') || message.includes('library')) {
      return {
        text: "Need a peaceful study environment? Here are quiet options perfect for academics:",
        showListings: listings.filter(listing => 
          listing.description.toLowerCase().includes('quiet') || 
          listing.amenities.some(amenity => amenity.toLowerCase().includes('study'))
        )
      };
    }

    if (message.includes('wifi') || message.includes('internet') || message.includes('online')) {
      return {
        text: "Reliable internet is essential for studies! All these places have good WiFi:",
        showListings: listings.filter(listing => 
          listing.amenities.some(amenity => amenity.toLowerCase().includes('wifi'))
        )
      };
    }

    if (message.includes('international') || message.includes('foreign') || message.includes('exchange')) {
      return {
        text: "As an international student, you'll love these culturally diverse, welcoming places:",
        showListings: listings.filter(listing => 
          listing.description.toLowerCase().includes('international') ||
          listing.description.toLowerCase().includes('multicultural')
        )
      };
    }

    // Default helpful response
    const defaultResponses = [
      {
        text: "I'd love to help you find the perfect home! Here are some popular options for students. You can also tell me more about:\n\n• Your budget range\n• Preferred location (near campus, downtown, etc.)\n• Do you want roommates?\n• Important amenities (gym, parking, etc.)",
        showListings: listings.slice(0, 2)
      },
      {
        text: "Here are some great housing options to get you started. Feel free to ask me about specific features you're looking for!",
        showListings: listings
      }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
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
        listings: botResponse.showListings
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

  const handleListingView = (listing) => {
    if (onListingView) {
      onListingView(listing);
    } else {
      // Default action - you can customize this
      console.log('Viewing listing:', listing);
     (`/property/property${property.id}`); 
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
          placeholder="Tell me about your ideal housing... (budget, location, amenities)"
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