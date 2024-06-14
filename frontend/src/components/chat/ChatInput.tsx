import React from "react";
import { Textarea } from "@nextui-org/react";
import { VscArrowUp } from "react-icons/vsc";
import { twMerge } from "tailwind-merge";

interface ChatInputProps {
  disabled?: boolean;
  onSendMessage: (message: string) => void;
}

function ChatInput({ disabled = false, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = React.useState("");
  const [isComposing, setIsComposing] = React.useState(false);

  const handleSendChatMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const onKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isComposing) {
      event.preventDefault();
      if (!disabled) {
        handleSendChatMessage();
      }
    }
  };

  return (
    <div className="w-full relative text-base flex">
      <Textarea
        value={message}
        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setMessage(e.target.value)}
        onKeyDown={onKeyPress}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="Enter your message..."
        className="pb-3 px-3 bg-neutral-700 border border-neutral-600 rounded-lg pr-16 text-neutral-400"
        maxRows={10}
        minRows={1}
        variant="bordered"
      />

      <button
        type="button"
        onClick={handleSendChatMessage}
        disabled={disabled}
        className={twMerge(
          "bg-transparent border rounded-lg p-1 border-white hover:opacity-80 cursor-pointer select-none absolute right-5 bottom-[19px] transition active:bg-white active:text-black",
          disabled
            ? "cursor-not-allowed border-neutral-400 text-neutral-400"
            : "hover:bg-neutral-500",
        )}
        aria-label="Send message"
      >
        <VscArrowUp />
      </button>
    </div>
  );
}

export default ChatInput;
