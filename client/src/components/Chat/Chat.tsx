import "./Chat.css";
import DefaultPrompts from "../DefaultPrompts/DefaultPrompt/DefaultPrompts";
import ChatInput from "../ChatInput/ChatInput";

export default function Chat() {
  return (
    <div className="chat-container">
      <DefaultPrompts />
      <ChatInput />
    </div>
  );
}
