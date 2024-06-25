import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdChatbubbles } from "react-icons/io";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { VscArrowDown } from "react-icons/vsc";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import ChatInput from "./ChatInput";
import Chat from "./Chat";
import { RootState } from "#/store";
import AgentState from "#/types/AgentState";
import { sendChatMessage } from "#/services/chatService";
import { addUserMessage, addAssistantMessage } from "#/state/chatSlice";
import { useScrollToBottom } from "#/hooks/useScrollToBottom";
import Session from "#/services/session";
import { getToken } from "#/services/auth";
import { startChat, getMessages } from "../../services/api";

interface ScrollButtonProps {
  onClick: () => void;
  icon: JSX.Element;
  label: string;
  disabled?: boolean;
}

function ScrollButton({
  onClick,
  icon,
  label,
  disabled = false,
}: ScrollButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="relative border-1 text-xs rounded px-2 py-1 border-neutral-600 bg-neutral-700 cursor-pointer select-none"
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center">
        {icon} <span className="inline-block">{label}</span>
      </div>
    </button>
  );
}

const ChatInterface = () => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state: RootState) => state.chat);
  const { curAgentState } = useSelector((state: RootState) => state.agent);

  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackPermissions, setFeedbackPermissions] = useState<"public" | "private">("private");
  const [feedbackToken, setFeedbackToken] = useState("");
  const [feedbackVersion, setFeedbackVersion] = useState("1.0");
  const [feedbackTrajectory, setFeedbackTrajectory] = useState<Record<string, unknown>[]>([]);
  const [feedbackPolarity, setFeedbackPolarity] = useState<"positive" | "negative">("positive");
  const [feedbackShared, setFeedbackShared] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollDomToBottom, onChatBodyScroll, hitBottom } =
    useScrollToBottom(scrollRef);

  useEffect(() => {
    if (curAgentState === AgentState.INIT && messages.length === 0) {
      dispatch(addAssistantMessage("Initial message")); // Replace with your specific message
    }

    const fetchMessages = async () => {
      const chatMessages = await getMessages(1); // Replace with dynamic chat ID
      // Assuming addAssistantMessage adds messages to the Redux store
      chatMessages.forEach((msg: { content: string; }) => dispatch(addAssistantMessage(msg.content)));
    };
    fetchMessages();
  }, [curAgentState, dispatch, messages.length]);

  const handleSendMessage = async (content: string) => {
    dispatch(addUserMessage(content));
    const newMessage = await startChat(content);
    dispatch(addAssistantMessage(newMessage.content));
  };

  const handleSendContinueMsg = () => {
    handleSendMessage("Continue message"); // Replace with your specific message
  };

  const shareFeedback = async (polarity: "positive" | "negative") => {
    setFeedbackShared(messages.length);
    const filteredHistory = Session._history.filter((item) => item !== "api key"); // Adjust based on actual structure
    setFeedbackEmail(""); // Reset email after sharing feedback
    setFeedbackPermissions("private"); // Reset permissions after sharing feedback
    setFeedbackToken(getToken());
    setFeedbackTrajectory(filteredHistory);
    setFeedbackPolarity(polarity);
    // Logic to handle feedback submission goes here (if needed)
  };

  return (
    <div className="flex flex-col h-full bg-neutral-800">
      <div className="flex items-center gap-2 border-b border-neutral-600 text-sm px-4 py-2">
        <IoMdChatbubbles />
        Chat
      </div>
      <div className="flex-1 flex flex-col relative min-h-0">
        <div
          ref={scrollRef}
          className="overflow-y-auto p-3"
          onScroll={(e) => onChatBodyScroll(e.currentTarget)}
        >
          <Chat messages={messages} />
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center">
          {!hitBottom &&
            <ScrollButton
              onClick={scrollDomToBottom}
              icon={<VscArrowDown className="inline mr-2 w-3 h-3" />}
              label="To Bottom"
            />}
          {curAgentState === AgentState.AWAITING_USER_INPUT &&
            hitBottom &&
            <ScrollButton
              onClick={handleSendContinueMsg}
              icon={<RiArrowRightDoubleLine className="inline mr-2 w-3 h-3" />}
              label="Continue Message"
            />}
        </div>

        {feedbackShared !== messages.length && messages.length > 3 && (
          <div className="flex justify-start gap-2 p-2">
            <ScrollButton
              onClick={() => shareFeedback("positive")}
              icon={<FaRegThumbsUp className="inline mr-2 w-3 h-3" />}
              label=""
            />
            <ScrollButton
              onClick={() => shareFeedback("negative")}
              icon={<FaRegThumbsDown className="inline mr-2 w-3 h-3" />}
              label=""
            />
          </div>
        )}
      </div>

      <ChatInput
        disabled={curAgentState === AgentState.LOADING}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default ChatInterface;
