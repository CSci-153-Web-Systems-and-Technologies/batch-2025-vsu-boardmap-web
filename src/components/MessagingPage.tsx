// components/MessagingPage.tsx
import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, MessageSquare, Users } from "lucide-react";
import { Message, getConversation, sendMessage } from "../utils/api";
import { createClient } from "../utils/supabase/client";
import { toast } from "sonner";

interface Conversation {
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastTimestamp: string;
  propertyId?: string;
  propertyTitle?: string;
  unread: boolean;
}

interface MessagingPageProps {
  userId: string;
  recipientId?: string; // Optional: for direct conversation
  recipientName?: string;
  propertyId?: string;
  propertyTitle?: string;
  accessToken: string;
  onBack: () => void;
  // Add mode to distinguish between single conversation and conversation list
  mode?: "single" | "list";
}

export default function MessagingPage({
  userId,
  recipientId,
  recipientName,
  propertyId,
  propertyTitle,
  accessToken,
  onBack,
  mode = recipientId ? "single" : "list", // Auto-detect mode
}: MessagingPageProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(
      recipientId && recipientName
        ? {
            otherUserId: recipientId,
            otherUserName: recipientName,
            lastMessage: "",
            lastTimestamp: new Date().toISOString(),
            propertyId,
            propertyTitle,
            unread: false,
          }
        : null
    );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(
    mode === "list"
  );
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (mode === "list") {
      loadConversations();
    } else if (selectedConversation) {
      loadMessages(selectedConversation.otherUserId);
    }

    // Set up polling
    const interval = setInterval(() => {
      if (selectedConversation) {
        loadMessages(selectedConversation.otherUserId);
      }
      if (mode === "list") {
        loadConversations();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedConversation, mode]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const supabase = createClient();

      // Get all messages where user is sender or recipient
      const { data: allMessages, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error loading conversations:", error);
        return;
      }

      // Group messages by conversation partner
      const conversationsMap = new Map<string, Conversation>();

      allMessages?.forEach((msg: any) => {
        const otherUserId =
          msg.sender_id === userId ? msg.recipient_id : msg.sender_id;
        const otherUserName =
          msg.sender_id === userId
            ? msg.recipient_name || "User"
            : msg.sender_name || "User";

        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            otherUserId,
            otherUserName,
            lastMessage: msg.message,
            lastTimestamp: msg.timestamp || msg.created_at,
            propertyId: msg.property_id,
            propertyTitle: msg.property_title,
            unread: msg.sender_id !== userId && !msg.read,
          });
        }
      });

      const conversationsList = Array.from(conversationsMap.values()).sort(
        (a, b) =>
          new Date(b.lastTimestamp).getTime() -
          new Date(a.lastTimestamp).getTime()
      );

      setConversations(conversationsList);
    } catch (error) {
      console.error("Error loading conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    try {
      setLoading(true);
      const msgs = await getConversation(userId, otherUserId, accessToken);
      setMessages(msgs);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.otherUserId);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      await sendMessage(
        selectedConversation.otherUserId,
        newMessage.trim(),
        selectedConversation.propertyId,
        accessToken
      );
      setNewMessage("");

      // Reload messages
      await loadMessages(selectedConversation.otherUserId);

      // If in list mode, also refresh conversations
      if (mode === "list") {
        await loadConversations();
      }

      toast.success("Message sent!");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatConversationTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render conversation list (for owners/students viewing all conversations)
  const renderConversationList = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#e7f0dc] border-b-2 border-[#597445] p-4 md:p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[#d4e5c8] rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-[#597445]" />
          </button>
          <div className="flex-1">
            <h2 className="font-['Rethink_Sans:Bold',sans-serif] text-[18px] md:text-[24px] text-[#4f6f52]">
              Messages
            </h2>
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445]">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loadingConversations ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79ac78] mx-auto mb-2"></div>
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445]">
                Loading conversations...
              </p>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageSquare size={64} className="text-[#e7f0dc] mb-4" />
            <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] text-[#4f6f52] mb-2">
              No conversations yet
            </h3>
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] max-w-md">
              Start messaging property owners or students to see your
              conversations here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.otherUserId}
                onClick={() => handleSelectConversation(conv)}
                className={`p-4 rounded-[15px] border border-[#e7f0dc] hover:border-[#79ac78] hover:bg-[#f8faf5] cursor-pointer transition-all ${
                  selectedConversation?.otherUserId === conv.otherUserId
                    ? "border-[#79ac78] bg-[#e7f0dc]"
                    : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-[#597445] text-white rounded-full w-12 h-12 flex items-center justify-center text-[16px] font-['Rethink_Sans:Bold',sans-serif] flex-shrink-0">
                    {conv.otherUserName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[16px] text-[#4f6f52] truncate">
                        {conv.otherUserName}
                      </h3>
                      <span className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#79ac78] whitespace-nowrap ml-2">
                        {formatConversationTime(conv.lastTimestamp)}
                      </span>
                    </div>
                    <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] text-[#597445] truncate mt-1">
                      {conv.lastMessage}
                    </p>
                    {conv.propertyTitle && (
                      <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#79ac78] mt-1">
                        Re: {conv.propertyTitle}
                      </p>
                    )}
                  </div>
                  {conv.unread && (
                    <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render single conversation chat
  const renderChat = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#e7f0dc] border-b-2 border-[#597445] p-4 md:p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={
              mode === "list" ? () => setSelectedConversation(null) : onBack
            }
            className="p-2 hover:bg-[#d4e5c8] rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-[#597445]" />
          </button>
          <div className="bg-[#597445] text-white rounded-full w-10 h-10 flex items-center justify-center text-[16px] font-['Rethink_Sans:Bold',sans-serif]">
            {selectedConversation?.otherUserName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="font-['Rethink_Sans:Bold',sans-serif] text-[18px] md:text-[24px] text-[#4f6f52]">
              {selectedConversation?.otherUserName}
            </h2>
            {selectedConversation?.propertyTitle && (
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] text-[#597445] line-clamp-1">
                Re: {selectedConversation.propertyTitle}
              </p>
            )}
          </div>
          {mode === "list" && (
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-[#d4e5c8] rounded-full transition-colors md:hidden"
              aria-label="View all conversations"
            >
              <Users size={20} className="text-[#597445]" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-white to-[#f8faf5]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#79ac78] mx-auto mb-2"></div>
              <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445]">
                Loading messages...
              </p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageSquare size={64} className="text-[#e7f0dc] mb-4" />
            <h3 className="font-['Rethink_Sans:SemiBold',sans-serif] text-[20px] text-[#4f6f52] mb-2">
              No messages yet
            </h3>
            <p className="font-['Rethink_Sans:Regular',sans-serif] text-[16px] text-[#597445] max-w-md">
              Start the conversation with {selectedConversation?.otherUserName}{" "}
              about {selectedConversation?.propertyTitle || "the property"}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === userId;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] md:max-w-[60%] rounded-[15px] p-4 ${
                    isOwn
                      ? "bg-[#79ac78] text-white"
                      : "bg-[#e7f0dc] text-[#4f6f52]"
                  }`}
                >
                  {!isOwn && (
                    <p className="font-['Rethink_Sans:SemiBold',sans-serif] text-[12px] md:text-[14px] mb-1 opacity-90">
                      {msg.senderName}
                    </p>
                  )}
                  <p className="font-['Rethink_Sans:Regular',sans-serif] text-[14px] md:text-[16px] whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                  <p
                    className={`font-['Rethink_Sans:Regular',sans-serif] text-[11px] md:text-[12px] mt-2 ${
                      isOwn ? "opacity-80" : "opacity-60"
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-2 border-[#e7f0dc] p-4 md:p-6 bg-white">
        <div className="flex gap-3">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${selectedConversation?.otherUserName}...`}
            rows={2}
            disabled={sending}
            className="flex-1 bg-white border-2 border-[#597445] rounded-[12px] px-4 py-3 text-[#4f6f52] outline-none focus:ring-2 focus:ring-[#79ac78] resize-none disabled:opacity-50 placeholder-[#597445]/60"
            maxLength={1000}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-[#597445] text-white rounded-[12px] px-4 md:px-6 hover:bg-[#4f6f52] active:bg-[#3d5841] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Send message"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
        <p className="font-['Rethink_Sans:Regular',sans-serif] text-[12px] text-[#597445]/60 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-white rounded-[20px] shadow-[0px_0px_20px_0px_rgba(89,116,69,0.2)] overflow-hidden">
      {mode === "list" && !selectedConversation
        ? renderConversationList()
        : selectedConversation
        ? renderChat()
        : mode === "single"
        ? renderChat()
        : renderConversationList()}
    </div>
  );
}
