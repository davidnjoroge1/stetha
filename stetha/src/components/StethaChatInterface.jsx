import React, { useState, useRef, useEffect } from 'react';
import { SendHorizontal, Bot, Mic, User, Sun, Moon, Plus, Menu, X, Clock, Search, ChevronLeft, ChevronRight, Image as ImageIcon, Paperclip, ThumbsUp, ThumbsDown, Camera, XCircle } from 'lucide-react';

const StethaChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "Headache Consultation",
      preview: "I've been experiencing severe headaches...",
      date: "2024-03-23",
      messages: [
        {
          id: 1,
          type: 'user',
          content: "I've been experiencing severe headaches lately",
          timestamp: "10:30 AM",
          reactions: []
        },
        {
          id: 2,
          type: 'bot',
          content: "I understand you're experiencing severe headaches. Could you tell me more about the frequency and intensity?",
          timestamp: "10:31 AM",
          reactions: []
        }
      ]
    },
    {
      id: 2,
      title: "Back Pain Discussion",
      preview: "My lower back has been hurting...",
      date: "2024-03-22",
      messages: [
        {
          id: 1,
          type: 'user',
          content: "My lower back has been hurting for the past week",
          timestamp: "2:15 PM",
          reactions: []
        },
        {
          id: 2,
          type: 'bot',
          content: "I'm sorry to hear about your back pain. Let's try to understand the cause. When did it start exactly?",
          timestamp: "2:16 PM",
          reactions: []
        }
      ]
    }
  ]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setIsCollapsed(false);
      } else {
        setSidebarOpen(true);
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Update chat history
    if (currentChatId) {
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: updatedMessages, preview: inputText }
          : chat
      ));
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: updatedMessages.length + 1,
        type: 'bot',
        content: "I understand your concern. Let me help you with that. Can you provide more details about your symptoms?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      if (currentChatId) {
        setChatHistory(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: finalMessages }
            : chat
        ));
      }
      setIsLoading(false);
      setIsTyping(false);
    }, 2000);
  };

  const startNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Consultation",
      preview: "Start a new consultation",
      date: new Date().toISOString().split('T')[0],
      messages: [{
        id: 1,
        type: 'bot',
        content: "Hello! I'm Stetha AI, your medical assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      }]
    };
    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMessages(newChat.messages);
  };

  const selectChat = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setCurrentChatId(chatId);
      setMessages(selectedChat.messages);
    }
  };

  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TypingIndicator = () => (
    <div className="flex space-x-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  );

  const toggleSidebar = () => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(!isCollapsed);
    } else {
      setSidebarOpen(!isSidebarOpen);
    }
  };

  const handleReaction = (messageId, reaction) => {
    setMessages(prevMessages =>
      prevMessages.map(message =>
        message.id === messageId
          ? { ...message, reactions: message.reactions.includes(reaction) 
              ? message.reactions.filter(r => r !== reaction)
              : [...message.reactions, reaction] }
          : message
      )
    );
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording for 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        // Simulate a response after recording
        const newMessage = {
          id: messages.length + 1,
          type: 'user',
          content: "This is a simulated voice message.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactions: []
        };
        setMessages(prev => [...prev, newMessage]);
      }, 3000);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    setIsCameraActive(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch(err => {
        console.error("Error accessing the camera: ", err);
        setIsCameraActive(false);
      });
  };

  const captureImage = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, 300, 150);
    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
    setSelectedImage(imageDataUrl);
    setIsCameraActive(false);
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  };

  const cancelImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendImageMessage = () => {
    if (selectedImage) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: selectedImage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [],
        isImage: true
      };
      setMessages([...messages, newMessage]);
      setSelectedImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          ${isCollapsed ? 'w-20' : 'w-72'}
          fixed md:relative h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 
          transition-all duration-300 ease-in-out z-10
        `}
      >
        <div className={`p-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>
          
          {!isCollapsed && (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* New Chat Button */}
              <button
                onClick={startNewChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </>
          )}

          {/* Chat List */}
          <div className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
            {filteredHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${isCollapsed ? 'flex justify-center' : ''}`}
              >
                {isCollapsed ? (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {chat.title.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {chat.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {chat.preview}
                    </p>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
              <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Stetha AI</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Medical Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? 
                <Sun className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200" /> :
                <Moon className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200" />
              }
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xl ${
                  message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-600 dark:bg-blue-500'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  {message.type === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
                <div className="flex flex-col">
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm transform transition-all duration-200 hover:shadow-md ${
                      message.type === 'user'
                        ? 'bg-blue-600 dark:bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 border dark:border-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                    }`}
                  >
                    {message.isImage ? (
                      <img src={message.content} alt="User uploaded" className="max-w-full h-auto rounded-lg" />
                    ) : (
                      message.content
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1 mx-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {message.timestamp}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleReaction(message.id, 'thumbsUp')}
                        className={`p-1 rounded-full transition-colors ${
                          message.reactions.includes('thumbsUp')
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <ThumbsUp className={`w-4 h-4 ${
                          message.reactions.includes('thumbsUp')
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </button>
                      <button
                        onClick={() => handleReaction(message.id, 'thumbsDown')}
                        className={`p-1 rounded-full transition-colors ${
                          message.reactions.includes('thumbsDown')
                            ? 'bg-red-100 dark:bg-red-900'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <ThumbsDown className={`w-4 h-4 ${
                          message.reactions.includes('thumbsDown')
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-500 dark:text-gray-400'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Bot className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Image Preview</h3>
                <button onClick={cancelImage} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg mb-4" />
              <div className="flex justify-end space-x-2">
                <button onClick={cancelImage} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Cancel
                </button>
                <button onClick={sendImageMessage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Capture */}
        {isCameraActive && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Camera Capture</h3>
                <button onClick={() => setIsCameraActive(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <video ref={videoRef} className="w-full h-auto rounded-lg mb-4" />
              <canvas ref={canvasRef} style={{ display: 'none' }} width={300} height={150} />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setIsCameraActive(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                  Cancel
                </button>
                <button onClick={captureImage} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Capture
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your medical question..."
                  className="w-full px-4 py-3 pr-24 border dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    className="p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Recording Animation */}
      {isRecording && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 flex flex-col items-center">
            <div className="w-24 h-24 relative mb-4">
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-25 animate-ping"></div>
              <div className="absolute inset-0 bg-red-500 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center">
                <Mic className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Listening...</p>
            <p className="text-gray-600 dark:text-gray-400">Speak now</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StethaChatInterface;

