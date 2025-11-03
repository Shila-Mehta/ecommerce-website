import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../css/Messages.css";
import "react-toastify/dist/ReactToastify.css";

const MySwal = withReactContent(Swal);

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load messages. Please try again later.");
      toast.error("❌ Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (msg) => {
    setReplyTo(msg);
    setReplyMessage("");
    setShowModal(true);
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      MySwal.fire({
        title: "Empty Reply",
        text: "Reply cannot be empty.",
        icon: "warning",
        confirmButtonColor: "#6c5ce7",
        timer: 2500,
        timerProgressBar: true,
      });
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/messages/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: replyTo._id,
          email: replyTo.email,
          subject: `Re: ${replyTo.subject}`,
          message: replyMessage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setShowModal(false);
        setReplyMessage("");
        toast.success(`Reply sent to ${replyTo.name} (${replyTo.email})`);

        setMessages((prev) =>
          prev.map((msg) => (msg._id === replyTo._id ? data.updatedMessage : msg))
        );
      } else {
        throw new Error("Failed to send reply");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      setShowModal(false);
      toast.error("❌ Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "This message will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
        if (res.ok) {
          setMessages((prev) => prev.filter((msg) => msg._id !== id));
          toast.success("Message deleted successfully");
        } else {
          throw new Error("Failed to delete message");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("❌ Failed to delete message");
      }
    }
  };

  const closeModal = () => {
    if (!sending) {
      setShowModal(false);
      setReplyTo(null);
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <button className="btn refresh-btn" onClick={fetchMessages} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchMessages}>Try Again</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="empty-state">
          <p className="no-messages">No messages yet</p>
          <p>Messages will appear here when users contact you.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="messages-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name || "Unknown Sender"}</td>
                  <td>{msg.email || "No Email"}</td>
                  <td>{msg.message || "No message"}</td>
                  <td className="actions">
                    <button className="btn reply-btn" onClick={() => handleReply(msg)}>
                      Reply
                    </button>
                    <button className="btn delete-btn" onClick={() => handleDelete(msg._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reply Modal */}
      {showModal && replyTo && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reply to Message</h2>
              <button className="modal-close" onClick={closeModal} disabled={sending}>
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-sender-card">
          
                <div className="sender-info">
                  <div className="sender-name">{replyTo?.name || "Unknown"}</div>
                  <div className="sender-email">{replyTo?.email || "No Email"}</div>
                </div>
              </div>

              <div className="reply-textarea-container">
                <label>Your Reply:</label>
                <textarea
                  className="modal-textarea"
                  placeholder="Type your reply..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  disabled={sending}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn send-btn"
                onClick={sendReply}
                disabled={sending || !replyMessage.trim()}
              >
                {sending ? "Sending..." : "Send Reply"}
              </button>
              <button className="btn cancel-btn" onClick={closeModal} disabled={sending}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* React Toastify container */}
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
};

export default Messages;
