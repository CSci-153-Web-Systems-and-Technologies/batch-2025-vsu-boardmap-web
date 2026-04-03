import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, MessageSquare, Send, Users } from "lucide-react";
import { Message, getConversation, sendMessage } from "../utils/api";
import { createAuthenticatedClient } from "../utils/supabase/client";
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
  recipientId?: string;
  recipientName?: string;
  propertyId?: string;
  propertyTitle?: string;
  accessToken: string;
  onBack: () => void;
  mode?: "single" | "list";
}

const areMessagesEqual = (left: Message[], right: Message[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((message, index) => {
    const next = right[index];
    return (
      message.id === next.id &&
      message.message === next.message &&
      message.timestamp === next.timestamp &&
      message.senderId === next.senderId
    );
  });
};

const areConversationsEqual = (left: Conversation[], right: Conversation[]) => {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((conversation, index) => {
    const next = right[index];
    return (
      conversation.otherUserId === next.otherUserId &&
      conversation.lastMessage === next.lastMessage &&
      conversation.lastTimestamp === next.lastTimestamp &&
      conversation.unread === next.unread &&
      conversation.propertyId === next.propertyId &&
      conversation.propertyTitle === next.propertyTitle
    );
  });
};

const getMessagingLoadMessage = (error: any) => {
  const message = String(error?.message || "").toLowerCase();

  if (message.includes("does not exist") || message.includes("relation")) {
    return "The messages table is not ready yet in Supabase for this project.";
  }

  if (
    message.includes("jwt") ||
    message.includes("permission") ||
    message.includes("row-level security")
  ) {
    return "Your session is active, but messaging still needs the right Supabase permissions.";
  }

  return "We could not load conversations right now.";
};

export default function MessagingPage({
  userId,
  recipientId,
  recipientName,
  propertyId,
  propertyTitle,
  accessToken,
  onBack,
  mode = recipientId ? "single" : "list",
}: MessagingPageProps) {
  const initialConversation = useMemo<Conversation | null>(() => {
    if (!recipientId || !recipientName) {
      return null;
    }

    return {
      otherUserId: recipientId,
      otherUserName: recipientName,
      lastMessage: "",
      lastTimestamp: new Date().toISOString(),
      propertyId,
      propertyTitle,
      unread: false,
    };
  }, [recipientId, recipientName, propertyId, propertyTitle]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    initialConversation
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(mode === "single");
  const [loadingConversations, setLoadingConversations] = useState(mode === "list");
  const [conversationError, setConversationError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedConversation(initialConversation);
  }, [initialConversation]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadConversations = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (mode !== "list") {
      return;
    }

    if (!silent) {
      setLoadingConversations(true);
    }

    try {
      const supabase = createAuthenticatedClient(accessToken);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("timestamp", { ascending: false });

      if (error) {
        throw error;
      }

      const conversationMap = new Map<string, Conversation>();
      (data || []).forEach((message: any) => {
        const otherUserId =
          message.sender_id === userId ? message.recipient_id : message.sender_id;
        const otherUserName =
          message.sender_id === userId
            ? message.recipient_name || message.recipient_name || "User"
            : message.sender_name || "User";

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            otherUserId,
            otherUserName,
            lastMessage: message.message,
            lastTimestamp: message.timestamp || message.created_at,
            propertyId: message.property_id,
            propertyTitle: message.property_title,
            unread: message.sender_id !== userId && !message.read,
          });
        }
      });

      const nextConversations = Array.from(conversationMap.values()).sort(
        (left, right) =>
          new Date(right.lastTimestamp).getTime() -
          new Date(left.lastTimestamp).getTime()
      );

      setConversations((current) =>
        areConversationsEqual(current, nextConversations) ? current : nextConversations
      );
      setConversationError(null);
    } catch (error) {
      console.error("Error loading conversations:", error);
      if (!silent) {
        setConversations([]);
        setConversationError(getMessagingLoadMessage(error));
      }
    } finally {
      if (!silent) {
        setLoadingConversations(false);
      }
    }
  }, [accessToken, mode, userId]);

  const loadMessages = useCallback(
    async (otherUserId: string, { silent = false }: { silent?: boolean } = {}) => {
      if (!silent) {
        setLoadingMessages(true);
      }

      try {
        const nextMessages = await getConversation(userId, otherUserId, accessToken);
        setMessages((current) =>
          areMessagesEqual(current, nextMessages) ? current : nextMessages
        );
      } catch (error) {
        console.error("Error loading messages:", error);
        if (!silent) {
          toast.error("Failed to load messages.");
        }
      } finally {
        if (!silent) {
          setLoadingMessages(false);
        }
      }
    },
    [accessToken, userId]
  );

  useEffect(() => {
    if (mode === "list") {
      loadConversations();
    }
  }, [mode, loadConversations]);

  useEffect(() => {
    if (selectedConversation?.otherUserId) {
      loadMessages(selectedConversation.otherUserId);
      return;
    }

    setMessages([]);
    setLoadingMessages(false);
  }, [loadMessages, selectedConversation?.otherUserId]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      if (mode === "list") {
        void loadConversations({ silent: true });
      }

      if (selectedConversation?.otherUserId) {
        void loadMessages(selectedConversation.otherUserId, { silent: true });
      }
    }, 8000);

    return () => window.clearInterval(interval);
  }, [loadConversations, loadMessages, mode, selectedConversation?.otherUserId]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleSend = async () => {
    if (!selectedConversation || !newMessage.trim() || sending) {
      return;
    }

    setSending(true);
    try {
      await sendMessage(
        selectedConversation.otherUserId,
        newMessage.trim(),
        selectedConversation.propertyId,
        accessToken
      );
      setNewMessage("");
      await loadMessages(selectedConversation.otherUserId, { silent: true });
      if (mode === "list") {
        await loadConversations({ silent: true });
      }
      toast.success("Message sent.");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Unable to send the message.");
    } finally {
      setSending(false);
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

  const renderConversationList = () => (
    <div className="boardmap-message-shell">
      <div className="boardmap-panel boardmap-message-header-card">
        <div className="boardmap-message-header">
          <button type="button" onClick={onBack} className="boardmap-button-secondary">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="boardmap-section-title" style={{ fontSize: "1.35rem" }}>
              Messages
            </h2>
            <p className="boardmap-helper">
              {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      <div className="boardmap-panel boardmap-message-list-card boardmap-scroll">
        {loadingConversations ? (
          <div className="boardmap-empty-state">
            <strong>Loading conversations</strong>
            <p>We are checking for the latest activity in your inbox.</p>
          </div>
        ) : conversationError ? (
          <div className="boardmap-empty-state">
            <MessageSquare size={42} style={{ margin: "0 auto", color: "#2f6a45" }} />
            <strong>Messaging is temporarily unavailable</strong>
            <p>{conversationError}</p>
            <div style={{ marginTop: "1rem" }}>
              <button
                type="button"
                className="boardmap-button-secondary"
                onClick={loadConversations}
              >
                Try again
              </button>
            </div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="boardmap-empty-state">
            <MessageSquare size={42} style={{ margin: "0 auto", color: "#2f6a45" }} />
            <strong>No conversations yet</strong>
            <p>Once you start messaging owners or students, your threads will appear here.</p>
          </div>
        ) : (
          <div className="boardmap-message-conversation-list">
            {conversations.map((conversation) => (
              <button
                key={conversation.otherUserId}
                type="button"
                onClick={() => handleSelectConversation(conversation)}
                className={`boardmap-list-card boardmap-chat-conversation ${
                  selectedConversation?.otherUserId === conversation.otherUserId
                    ? "boardmap-chat-conversation-active"
                    : ""
                }`}
              >
                <div className="boardmap-chat-conversation-inner">
                  <div className="boardmap-avatar boardmap-message-avatar">
                    {conversation.otherUserName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="boardmap-chat-conversation-copy">
                    <div className="boardmap-chat-conversation-head">
                      <strong style={{ fontSize: "1rem" }}>{conversation.otherUserName}</strong>
                      <span className="boardmap-helper">{formatTime(conversation.lastTimestamp)}</span>
                    </div>
                    <p
                      className="boardmap-helper"
                      style={{
                        marginTop: "0.35rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {conversation.lastMessage}
                    </p>
                    {conversation.propertyTitle && (
                      <span className="boardmap-chip" style={{ marginTop: "0.55rem" }}>
                        {conversation.propertyTitle}
                      </span>
                    )}
                  </div>
                  {conversation.unread && (
                    <span className="boardmap-chat-unread-dot" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="boardmap-message-shell">
      <div className="boardmap-panel boardmap-message-header-card">
        <div className="boardmap-message-header">
          <button
            type="button"
            onClick={mode === "list" ? () => setSelectedConversation(null) : onBack}
            className="boardmap-button-secondary"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="boardmap-avatar boardmap-message-avatar">
            {selectedConversation?.otherUserName
              ?.split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="boardmap-message-header-copy">
            <h2 className="boardmap-section-title" style={{ fontSize: "1.35rem" }}>
              {selectedConversation?.otherUserName}
            </h2>
            {selectedConversation?.propertyTitle && (
              <p className="boardmap-helper">About {selectedConversation.propertyTitle}</p>
            )}
          </div>
          {mode === "list" && (
            <button
              type="button"
              onClick={() => setSelectedConversation(null)}
              className="boardmap-button-secondary"
            >
              <Users size={18} />
            </button>
          )}
        </div>
      </div>

      <div
        className="boardmap-panel boardmap-chat-panel boardmap-scroll"
      >
        <div className="boardmap-chat-thread boardmap-scroll">
          {loadingMessages ? (
            <div className="boardmap-empty-state">
              <strong>Loading messages</strong>
              <p>Pulling in the latest conversation thread now.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="boardmap-empty-state">
              <MessageSquare size={42} style={{ margin: "0 auto", color: "#2f6a45" }} />
              <strong>No messages yet</strong>
              <p>
                Start the conversation with {selectedConversation?.otherUserName || "this user"}.
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === userId;
              return (
                <div
                  key={message.id}
                  className={`boardmap-chat-row ${
                    isOwnMessage ? "boardmap-chat-row-own" : "boardmap-chat-row-other"
                  }`}
                >
                  <div
                    className={`boardmap-chat-bubble ${
                      isOwnMessage ? "boardmap-chat-bubble-own" : "boardmap-chat-bubble-other"
                    }`}
                  >
                    {!isOwnMessage && (
                      <strong style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                        {message.senderName}
                      </strong>
                    )}
                    <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{message.message}</p>
                    <span className="boardmap-chat-bubble-time">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="boardmap-chat-compose">
          <div className="boardmap-chat-compose-row">
            <textarea
              className="boardmap-textarea"
              style={{ minHeight: 74, marginBottom: 0 }}
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Message ${selectedConversation?.otherUserName || "this user"}...`}
              disabled={sending}
              maxLength={1000}
            />
            <button
              type="button"
              onClick={handleSend}
              className="boardmap-button-primary boardmap-chat-send-button"
              disabled={!newMessage.trim() || sending}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="boardmap-helper" style={{ marginTop: "0.55rem" }}>
            Press Enter to send. Use Shift + Enter for a new line.
          </p>
        </div>
      </div>
    </div>
  );

  return mode === "list" && !selectedConversation ? renderConversationList() : renderChat();
}
