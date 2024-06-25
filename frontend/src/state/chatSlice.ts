import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  sender: "user" | "assistant";
  content: string;
}

interface SliceState {
  messages: Message[];
}

const initialState: SliceState = {
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage(state, action: PayloadAction<string>) {
      const message: Message = {
        sender: "user",
        content: action.payload,
      };
      state.messages.push(message);
    },

    addAssistantMessage(state, action: PayloadAction<string>) {
      const message: Message = {
        sender: "assistant",
        content: action.payload,
      };
      state.messages.push(message);
    },

    clearMessages(state) {
      state.messages = [];
    },

    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },

    addMessage(state, action: PayloadAction<Message>) {
      state.messages.push(action.payload);
    },
  },
});

export const { addUserMessage, addAssistantMessage, clearMessages, setMessages, addMessage } =
  chatSlice.actions;

export default chatSlice.reducer;
