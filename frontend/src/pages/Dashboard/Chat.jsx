import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/Api";
import { chatService } from "../../Services/chatService";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: "👋 Hello! I'm your HealthNexus Coach. How can I help with your fitness journey today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      options: ["Track Progress", "Workout Help", "Diet Advice", "Motivation"],
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContext, setShowContext] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(() => Date.now());

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // User data (in real app, this would come from context/API)
  const userData = {
    name: "John",
    currentWeight: 72,
    goalWeight: 68,
    habitScore: 85,
    todayCalories: 1450,
    calorieTarget: 2200,
    workoutToday: "Chest Day",
    lastWorkout: "Yesterday",
    streak: 7,
    protein: { current: 89, target: 150 },
    carbs: { current: 120, target: 250 },
    fat: { current: 35, target: 60 },
  };

  // Load chat history from backend on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await chatService.getData();
        if (res && res.chatHistory) {
          setChatHistory(res.chatHistory);
        }
      } catch (e) {
        console.error("Error loading chat history:", e);
      }
    };
    loadHistory();
  }, []);

  // Save to backend whenever chatHistory changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      chatService.updateData({ chatHistory }).catch((e) => console.error(e));
    }
  }, [chatHistory]);

  // Quick questions buttons
  const quickQuestions = [
    { id: 1, text: "📊 How's my progress?", icon: "📊" },
    { id: 2, text: "🍽️ What should I eat today?", icon: "🍽️" },
    { id: 3, text: "💪 Modify my workout", icon: "💪" },
    { id: 4, text: "😴 I'm feeling tired", icon: "😴" },
    { id: 5, text: "🥗 Meal ideas", icon: "🥗" },
    { id: 6, text: "🔥 Motivation", icon: "🔥" },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Save current chat to history
  const saveToHistory = () => {
    // Don't save if only welcome message or no user messages
    const userMessages = messages.filter((m) => m.type === "user");
    if (userMessages.length === 0) return;

    // Get first user message as title
    const firstUserMessage = userMessages[0]?.text.slice(0, 50);
    const chatTitle = firstUserMessage || "New Conversation";

    // Check if this chat already exists in history
    const existingIndex = chatHistory.findIndex(
      (chat) => chat.id === currentChatId,
    );

    const updatedHistoryEntry = {
      id: currentChatId,
      title: chatTitle + (chatTitle.length >= 50 ? "..." : ""),
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      fullDate: new Date().toISOString(),
      preview:
        messages[messages.length - 1]?.text.slice(0, 60) +
        (messages[messages.length - 1]?.text.length > 60 ? "..." : ""),
      messages: [...messages],
      messageCount: messages.length,
      lastMessageTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistory((prev) => {
      let newHistory;
      if (existingIndex >= 0) {
        // Update existing chat
        newHistory = [...prev];
        newHistory[existingIndex] = updatedHistoryEntry;
      } else {
        // Add new chat
        newHistory = [updatedHistoryEntry, ...prev];
      }
      // Keep only last 50 chats
      return newHistory.slice(0, 50);
    });
  };

  // Auto-save on new messages (debounced)
  useEffect(() => {
    const userMessages = messages.filter((m) => m.type === "user");
    if (userMessages.length > 0) {
      const timeoutId = setTimeout(saveToHistory, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [messages]);

  // Start new chat
  const startNewChat = () => {
    // Save current chat before clearing
    if (messages.filter((m) => m.type === "user").length > 0) {
      saveToHistory();
    }

    // Reset to welcome message
    setMessages([
      {
        id: 1,
        type: "ai",
        text: "👋 Hello! I'm your HealthNexus Coach. How can I help with your fitness journey today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        options: [
          "Track Progress",
          "Workout Help",
          "Diet Advice",
          "Motivation",
        ],
      },
    ]);

    setCurrentChatId(Date.now()); // New unique ID for new chat
    setSelectedChatId(null);
    setShowHistory(false);
    setIsMobileMenuOpen(false);
  };

  // Load chat from history
  const loadChatFromHistory = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setSelectedChatId(chat.id);
    setShowHistory(false);
    setIsMobileMenuOpen(false);

    // Optional: Show loading message
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // Delete history entry
  const deleteHistoryEntry = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Delete this chat history?")) {
      setChatHistory((prev) => prev.filter((chat) => chat.id !== id));

      // If deleted chat is currently open, start new chat
      if (selectedChatId === id) {
        startNewChat();
      }
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    if (chatHistory.length > 0 && window.confirm("Delete all chat history?")) {
      setChatHistory([]);
      try {
        await chatService.updateData({ chatHistory: [] });
      } catch (err) {
        console.error(err);
      }
      startNewChat();
    }
  };

  // Get AI response from backend
  const getAIResponse = async (userMessage) => {
    setIsTyping(true);

    try {
      const contextualMessage = `
        User Context:
        - Current Weight: ${userData.currentWeight}kg
        - Goal Weight: ${userData.goalWeight}kg
        - Habit Score: ${userData.habitScore}/100
        - Today's Calories: ${userData.todayCalories}/${userData.calorieTarget}
        - Workout Today: ${userData.workoutToday}
        - Streak: ${userData.streak} days
        - Protein: ${userData.protein.current}/${userData.protein.target}g
        - Carbs: ${userData.carbs.current}/${userData.carbs.target}g
        - Fat: ${userData.fat.current}/${userData.fat.target}g

        User Question: ${userMessage}

        Please provide a helpful fitness response based on this context. Keep it concise and actionable.
      `;

      const { data } = await api.post("/v1/ai/ask-ai", {
        message: contextualMessage,
      });

      // Determine options based on response content
      let options = [];
      const responseLower = data.reply.toLowerCase();

      if (
        responseLower.includes("weight") ||
        responseLower.includes("calorie")
      ) {
        options = ["Show meal plan", "Adjust calories", "Cardio exercises"];
      } else if (
        responseLower.includes("protein") ||
        responseLower.includes("diet") ||
        responseLower.includes("eat")
      ) {
        options = [
          "Create meal plan",
          "More protein foods",
          "Protein powder advice",
        ];
      } else if (
        responseLower.includes("workout") ||
        responseLower.includes("exercise")
      ) {
        options = ["Modify workout", "Alternative exercises", "Form tips"];
      } else if (
        responseLower.includes("tired") ||
        responseLower.includes("fatigue")
      ) {
        options = ["Take rest day", "Increase calories", "Stretching routine"];
      } else if (responseLower.includes("progress")) {
        options = ["View detailed stats", "Set new goal", "Share progress"];
      } else if (responseLower.includes("motivation")) {
        options = ["More motivation", "Success stories", "Weekly challenge"];
      } else {
        options = ["Ask about workouts", "Ask about diet", "Check progress"];
      }

      const newMessage = {
        id: messages.length + 2,
        type: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        options: options,
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage = {
        id: messages.length + 2,
        type: "ai",
        text: `I'm having trouble connecting right now. (Error: ${error.response?.status || "Network"})`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        options: ["Try again", "Contact support"],
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    if (!inputMessage.trim() || isTyping) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage("");

    // Get AI response
    await getAIResponse(messageToSend);
  };

  const handleQuickQuestion = (question) => {
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: question.text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    getAIResponse(question.text);
  };

  const handleOptionClick = (option) => {
    setInputMessage(option);
    setTimeout(() => {
      handleSendMessage(new Event("submit"));
    }, 100);
  };

  // Format date for display
  const formatHistoryDate = (dateStr) => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const yesterday = new Date(
      new Date().getTime() - 86400000,
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return dateStr;
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden p-2 sm:p-4 md:p-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-purple-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 ">
            {/* Mobile Header with History Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-4 bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg">
              <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HealthNexus Coach
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2.5 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <button
                  onClick={startNewChat}
                  className="p-2.5 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md"
                  title="New Chat"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile History Sidebar */}
            {isMobileMenuOpen && (
              <div
                className="lg:hidden fixed inset-0 bg-black/50 z-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div
                  className="absolute left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl p-5 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center">
                      <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                      Chat History
                    </h3>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* History Controls */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">
                      {chatHistory.length} conversations
                    </span>
                    {chatHistory.length > 0 && (
                      <button
                        onClick={clearAllHistory}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* History List */}
                  <div className="space-y-2.5">
                    {chatHistory.length > 0 ? (
                      chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => loadChatFromHistory(chat)}
                          className={`p-4 rounded-xl cursor-pointer transition-all duration-300 group relative ${
                            selectedChatId === chat.id
                              ? "bg-linear-to-r from-purple-100 to-pink-100 shadow-md border-2 border-purple-300"
                              : "bg-gray-50 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-transparent hover:border-purple-200"
                          }`}
                        >
                          <button
                            onClick={(e) => deleteHistoryEntry(e, chat.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-lg"
                          >
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <p className="font-semibold text-sm text-gray-800 truncate pr-6 mb-1">
                            {chat.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                            {chat.preview}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              {chat.messageCount}
                            </span>
                            <span className="text-gray-400 flex items-center">
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {formatHistoryDate(chat.date)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <svg
                          className="w-12 h-12 mx-auto mb-3 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p>No chat history yet</p>
                        <p className="text-sm mt-2">
                          Start a conversation to see it here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Chat History Sidebar */}
            {showHistory && (
              <div className="hidden lg:block w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-5 h-[calc(100vh-140px)] overflow-y-auto border border-purple-100 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center">
                    <span className="w-1 h-6 bg-linear-to-b from-purple-500 to-pink-500 rounded-full mr-3"></span>
                    Chat History
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* History Controls */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    {chatHistory.length} conversations
                  </span>
                  {chatHistory.length > 0 && (
                    <button
                      onClick={clearAllHistory}
                      className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear All
                    </button>
                  )}
                </div>

                {/* History List */}
                <div className="space-y-2.5">
                  {chatHistory.length > 0 ? (
                    chatHistory.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => loadChatFromHistory(chat)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] group relative ${
                          selectedChatId === chat.id
                            ? "bg-linear-to-r from-purple-100 to-pink-100 shadow-md border-2 border-purple-300"
                            : "bg-gray-50 hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-transparent hover:border-purple-200"
                        }`}
                      >
                        <button
                          onClick={(e) => deleteHistoryEntry(e, chat.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-lg"
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <p className="font-semibold text-sm text-gray-800 truncate pr-6 mb-1">
                          {chat.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                          {chat.preview}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            {chat.messageCount}
                          </span>
                          <span className="text-gray-400 flex items-center">
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {formatHistoryDate(chat.date)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="w-12 h-12 mx-auto mb-3 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <p>No chat history yet</p>
                      <p className="text-sm mt-2">
                        Start a conversation to see it here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main Chat Area */}
            <div
              className={`flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-purple-100 transition-all duration-500 ${
                showHistory
                  ? "lg:max-w-[calc(100%-320px)]"
                  : "max-w-5xl mx-auto"
              }`}
            >
              {/* Desktop Chat Header - Back Button Removed */}
              <div className="hidden lg:flex items-center justify-between p-4 border-b border-purple-100 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2.5 rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                    title={showHistory ? "Hide History" : "Show History"}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                  <h2 className="text-xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    HealthNexus Coach
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={startNewChat}
                    className="px-4 py-2 rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Chat
                  </button>
                </div>
              </div>

              {/* Context Panel (User Stats) */}
              {showContext && (
                <div className="bg-linear-to-r from-purple-600 via-pink-600 to-purple-600 p-4 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-2xl"></div>

                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                      <h3 className="font-bold text-lg flex items-center">
                        <span className="text-2xl mr-2">📊</span>
                        Your Stats
                      </h3>
                      <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                        <span className="text-2xl">🔥</span>
                        <div>
                          <p className="text-xs opacity-90">Streak</p>
                          <p className="text-lg font-bold">
                            {userData.streak} days
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      {[
                        {
                          label: "Weight",
                          value: `${userData.currentWeight}kg`,
                          icon: "⚖️",
                          color: "from-blue-400 to-blue-600",
                        },
                        {
                          label: "Habit Score",
                          value: userData.habitScore,
                          icon: "⭐",
                          color: "from-yellow-400 to-orange-500",
                        },
                        {
                          label: "Calories",
                          value: `${userData.todayCalories}/${userData.calorieTarget}`,
                          icon: "🔥",
                          color: "from-red-400 to-pink-600",
                        },
                        {
                          label: "Today",
                          value: userData.workoutToday,
                          icon: "💪",
                          color: "from-green-400 to-emerald-600",
                        },
                      ].map((stat, index) => (
                        <div
                          key={index}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 transform hover:scale-105 transition-all duration-300 hover:bg-white/30"
                        >
                          <p className="text-xs opacity-90 mb-1 flex items-center">
                            <span className="mr-1">{stat.icon}</span>
                            {stat.label}
                          </p>
                          <p className="text-base sm:text-lg font-bold truncate">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                      {[
                        {
                          label: "Protein",
                          current: userData.protein.current,
                          target: userData.protein.target,
                          icon: "💪",
                          color: "bg-blue-400",
                        },
                        {
                          label: "Carbs",
                          current: userData.carbs.current,
                          target: userData.carbs.target,
                          icon: "🍚",
                          color: "bg-yellow-400",
                        },
                        {
                          label: "Fat",
                          current: userData.fat.current,
                          target: userData.fat.target,
                          icon: "🥑",
                          color: "bg-green-400",
                        },
                      ].map((macro, index) => (
                        <div
                          key={index}
                          className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3"
                        >
                          <p className="text-xs opacity-90 mb-1.5">
                            {macro.icon} {macro.label}
                          </p>
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span>{macro.current}g</span>
                            <span className="opacity-75">
                              / {macro.target}g
                            </span>
                          </div>
                          <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full ${macro.color} rounded-full transition-all duration-500`}
                              style={{
                                width: `${Math.min((macro.current / macro.target) * 100, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div className="h-[calc(100vh-480px)] lg:h-[calc(100vh-400px)] overflow-y-auto p-4 sm:p-6 space-y-4 bg-linear-to-b from-gray-50/50 to-white">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fadeInUp`}
                  >
                    <div
                      className={`max-w-[90%] sm:max-w-[80%] group ${
                        message.type === "user"
                          ? "bg-linear-to-br from-purple-600 to-pink-600 text-white rounded-2xl rounded-tr-sm shadow-lg hover:shadow-xl"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-sm shadow-md hover:shadow-lg border border-gray-100"
                      } p-3 sm:p-4 transition-all duration-300 transform hover:scale-[1.02]`}
                    >
                      {message.type === "ai" && (
                        <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-gray-100">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                            <span className="text-xs sm:text-sm">🤖</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-500">
                            HealthNexus Coach
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-line leading-relaxed text-sm sm:text-base">
                        {message.text}
                      </p>

                      {/* Options Buttons */}
                      {message.options && message.options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                          {message.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleOptionClick(option)}
                              className={`text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                                message.type === "ai"
                                  ? "bg-linear-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100 border border-purple-200"
                                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}

                      {message.type === "user" && (
                        <div className="text-right mt-2 pt-2 border-t border-white/20">
                          <span className="text-xs opacity-75">
                            {message.timestamp}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start animate-fadeInUp">
                    <div className="bg-white text-gray-800 rounded-2xl rounded-tl-sm p-3 sm:p-4 shadow-md border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
                          <span className="text-xs sm:text-sm">🤖</span>
                        </div>
                        <div className="flex space-x-1.5">
                          <div className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.15s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-linear-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-4 sm:px-6 py-3 sm:py-4 bg-linear-to-r from-purple-50/50 to-pink-50/50 border-t border-purple-100">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Quick Actions
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                    Ready to help
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuickQuestion(q)}
                      className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-white hover:bg-linear-to-r hover:from-purple-50 hover:to-pink-50 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 hover:text-purple-700 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md border border-gray-200 hover:border-purple-300 font-medium"
                      disabled={isTyping}
                    >
                      <span className="mr-1 text-sm sm:text-base">
                        {q.icon}
                      </span>
                      <span className="hidden sm:inline">{q.text}</span>
                      <span className="sm:hidden">{q.text.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-purple-100 p-3 sm:p-5 bg-white/80 backdrop-blur-sm">
                <form
                  onSubmit={handleSendMessage}
                  className="flex space-x-2 sm:space-x-3"
                >
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything about fitness..."
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white shadow-sm hover:shadow-md placeholder-gray-400 text-sm sm:text-base"
                      disabled={isTyping}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className={`px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      !inputMessage.trim() || isTyping
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
                    }`}
                  >
                    {isTyping ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.15s" }}
                        ></div>
                        <div
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                    ) : (
                      <span className="flex items-center text-sm sm:text-base">
                        <span className="hidden sm:inline">Send</span>
                        <svg
                          className="w-4 h-4 ml-0 sm:ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fadeInUp {
            animation: fadeInUp 0.5s ease-out;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          ::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #a855f7, #ec4899);
            border-radius: 10px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #9333ea, #db2777);
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
