import React, { useState, useRef, useEffect } from 'react';
import {HomeIcon, MessageSquare, Send, X, Home, MapPin, DollarSign, Users, Wifi, Car, Coffee, Dumbbell, Shield } from 'lucide-react';

// Sample housing data - in real app this would come from your backend
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

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your HomeBuddy assistant. I'll help you find the perfect housing match! 🏠 Tell me about your preferences - budget, location, lifestyle, and any specific amenities you need.",
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

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Simple keyword matching - in real app you'd use proper NLP/AI
    if (message.includes('budget') || message.includes('price') || message.includes('$') || message.includes('cheap') || message.includes('affordable')) {
      return {
        text: "Great! Budget is important. I see you're looking for affordable options. Based on popular ranges for international students, here are some matches:",
        showListings: sampleListings.filter(listing => parseInt(listing.price.replace(/[^0-9]/g, '')) < 700)
      };
    }
    
    if (message.includes('gym') || message.includes('fitness') || message.includes('exercise')) {
      return {
        text: "I found some great places with fitness facilities! These listings have gym access:",
        showListings: sampleListings.filter(listing => listing.amenities.includes('Gym'))
      };
    }
    
    if (message.includes('parking') || message.includes('car')) {
      return {
        text: "Looking for parking? Here are properties with parking available:",
        showListings: sampleListings.filter(listing => listing.amenities.includes('Parking'))
      };
    }
    
    if (message.includes('downtown') || message.includes('campus') || message.includes('university')) {
      return {
        text: "Perfect! Location near campus is crucial. Here are some options close to university areas:",
        showListings: sampleListings.filter(listing => listing.location.toLowerCase().includes('campus') || listing.location.toLowerCase().includes('university'))
      };
    }
    
    if (message.includes('roommate') || message.includes('shared') || message.includes('friends')) {
      return {
        text: "Looking to share with others? That's a great way to save money and make friends! Here are shared accommodations:",
        showListings: sampleListings.filter(listing => parseInt(listing.roommates.split('-')[1]) > 1)
      };
    }
    
    if (message.includes('quiet') || message.includes('study') || message.includes('peaceful')) {
      return {
        text: "I understand you need a quiet environment for studying. Here are some peaceful options:",
        showListings: sampleListings.filter(listing => listing.description.toLowerCase().includes('quiet') || listing.amenities.includes('Study Room'))
      };
    }

    // Default responses for common queries
    const defaultResponses = [
      {
        text: "I'd be happy to help you find housing! Could you tell me more about:\n• Your budget range\n• Preferred location\n• Do you want roommates?\n• Any specific amenities you need?",
        showListings: []
      },
      {
        text: "Here are some popular options for international students:",
        showListings: sampleListings
      }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        listings: botResponse.showListings
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ListingCard = ({ listing }) => (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px',
      margin: '8px 0',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={listing.image} 
        alt={listing.title}
        style={{
          width: '100%',
          height: '120px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '12px'
        }}
      />
      <h4 style={{ margin: '0 0 8px 0', color: 'navy', fontSize: '16px' }}>
        {listing.title}
      </h4>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', color: '#666' }}>
        <MapPin size={14} />
        <span style={{ fontSize: '14px' }}>{listing.location}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', color: '#1d4ed8', fontWeight: '600' }}>
        <DollarSign size={14} />
        <span style={{ fontSize: '16px' }}>{listing.price}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px', color: '#666' }}>
        <Users size={14} />
        <span style={{ fontSize: '14px' }}>{listing.roommates} roommates</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {listing.amenities.map((amenity, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: '#f0f2f5',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#3730a3'
          }}>
            {getAmenityIcon(amenity)}
            {amenity}
          </div>
        ))}
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
        {listing.description}
      </p>
      <button style={{
        width: '100%',
        padding: '8px',
        backgroundColor: 'navy',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
      }}>
        View Details
      </button>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      maxWidth: '800px',
      margin: '20px auto',
      border: '1px solid #e0e0e0',
      borderRadius: '16px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Chat Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'navy',
        color: 'white',
        borderRadius: '16px 16px 0 0'
      }}>
        <MessageSquare size={24} />
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>HomeBuddy Assistant</h3>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>Find your perfect home match</p>
        </div>
      </div>

      {/* Messages Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        backgroundColor: '#f8f9fa'
      }}>
        {messages.map((message) => (
          <div key={message.id} style={{
            display: 'flex',
            justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: message.sender === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
              backgroundColor: message.sender === 'user' ? 'navy' : '#fff',
              color: message.sender === 'user' ? 'white' : '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-line'
            }}>
              {message.text}
              {message.listings && message.listings.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  {message.listings.map(listing => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '18px 18px 18px 6px',
              backgroundColor: '#fff',
              color: '#666',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center'
              }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.5s' }}></div>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ccc', borderRadius: '50%', animation: 'pulse 1.5s infinite 1s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '16px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        borderRadius: '0 0 16px 16px'
      }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me about your ideal housing... (budget, location, amenities)"
          style={{
            flex: 1,
            padding: '12px 16px',
            border: '1px solid #d0d0d0',
            borderRadius: '20px',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '12px 16px',
            backgroundColor: 'navy',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={18} />
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Floating Chat Button Component
const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1001
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'navy',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '350px',
          height: '500px',
          zIndex: 1000,
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          backgroundColor: 'white'
        }}>
          <div style={{ height: '100%' }}>
            <ChatBot />
          </div>
        </div>
      )}
    </>
  );
};

// Main App Component showing both implementations
const App = () => {
  const [activeTab, setActiveTab] = useState('full');

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '20px',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => setActiveTab('full')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'full' ? 'navy' : '#f0f2f5',
            color: activeTab === 'full' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Full Chat Page
        </button>
        <button
          onClick={() => setActiveTab('floating')}
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'floating' ? 'navy' : '#f0f2f5',
            color: activeTab === 'floating' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Floating Chat Demo
        </button>
      </div>

      {/* Content */}
      {activeTab === 'full' ? (
        <div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1 style={{ color: 'navy', marginBottom: '8px' }}>Find Your Perfect Home</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>Chat with our AI assistant to discover housing that matches your lifestyle</p>
          </div>
          <ChatBot />
        </div>
      ) : (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: 'navy', marginBottom: '16px' }}>Floating Chat Demo</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            This simulates how the floating chat button would appear on your other pages.
            Click the chat button in the bottom-right corner!
          </p>
          
          {/* Demo content to show floating chat */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '40px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: 'navy', marginBottom: '20px' }}>Your Regular Page Content</h3>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              This represents your normal page content. The floating chat button allows users to get housing help from any page without leaving their current location.
            </p>
            <div style={{ height: '300px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
              Sample page content area
            </div>
          </div>
          <FloatingChatButton />
        </div>
      )}
    </div>
  );
};

export default App;