import React, { createContext, useContext, useReducer, useCallback } from "react";

const AppContext = createContext(null);

const initialState = {
  userName: "",
  hasOnboarded: false,
  selectedQuestion: null,
  drawnCards: [],
  readingResult: null,
  language: "hinglish",
  chatMessages: [],
  isReading: false,
  currentPhase: "onboarding",
  chatHistory: [],
  currentAppStatus: "idle",
  currentQuestion: ""
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER_NAME":
      return { ...state, userName: action.payload, hasOnboarded: true, currentPhase: "reading" };
    case "SELECT_QUESTION":
      return {
        ...state,
        selectedQuestion: action.payload,
        currentPhase: "card-selection",
        drawnCards: [],
        readingResult: null,
        chatMessages: []
      };
    case "SET_DRAWN_CARDS":
      return { ...state, drawnCards: action.payload };
    case "SET_READING_RESULT":
      return { ...state, readingResult: action.payload, isReading: false };
    case "SET_READING":
      return { ...state, isReading: true };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "ADD_CHAT_MESSAGE":
      return { ...state, chatMessages: [...state.chatMessages, action.payload] };
    case "CLEAR_CHAT":
      return { ...state, chatMessages: [] };
    case "RESET_READING":
      return {
        ...state,
        selectedQuestion: null,
        drawnCards: [],
        readingResult: null,
        chatMessages: [],
        isReading: false,
        currentPhase: "reading",
        currentAppStatus: "idle",
        currentQuestion: ""
      };
    case "SET_CURRENT_QUESTION":
      return { ...state, currentQuestion: action.payload };
    case "SET_APP_STATUS":
      return { ...state, currentAppStatus: action.payload };
    case "ADD_CHAT_HISTORY_ENTRY":
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case "CLEAR_CHAT_HISTORY":
      return { ...state, chatHistory: [] };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUserName = useCallback((name) => dispatch({ type: "SET_USER_NAME", payload: name }), []);
  const selectQuestion = useCallback((q) => dispatch({ type: "SELECT_QUESTION", payload: q }), []);
  const setDrawnCards = useCallback((cards) => dispatch({ type: "SET_DRAWN_CARDS", payload: cards }), []);
  const setReadingResult = useCallback((result) => dispatch({ type: "SET_READING_RESULT", payload: result }), []);
  const setReading = useCallback(() => dispatch({ type: "SET_READING" }), []);
  const setLanguage = useCallback((lang) => dispatch({ type: "SET_LANGUAGE", payload: lang }), []);
  const addChatMessage = useCallback((msg) => dispatch({ type: "ADD_CHAT_MESSAGE", payload: msg }), []);
  const clearChat = useCallback(() => dispatch({ type: "CLEAR_CHAT" }), []);
  const resetReading = useCallback(() => dispatch({ type: "RESET_READING" }), []);
  const setCurrentQuestion = useCallback((q) => dispatch({ type: "SET_CURRENT_QUESTION", payload: q }), []);
  const setAppStatus = useCallback((status) => dispatch({ type: "SET_APP_STATUS", payload: status }), []);
  const addChatHistoryEntry = useCallback((entry) => dispatch({ type: "ADD_CHAT_HISTORY_ENTRY", payload: entry }), []);
  const clearChatHistory = useCallback(() => dispatch({ type: "CLEAR_CHAT_HISTORY" }), []);

  return (
    <AppContext.Provider value={{
      state,
      setUserName,
      selectQuestion,
      setDrawnCards,
      setReadingResult,
      setReading,
      setLanguage,
      addChatMessage,
      clearChat,
      resetReading,
      setCurrentQuestion,
      setAppStatus,
      addChatHistoryEntry,
      clearChatHistory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
