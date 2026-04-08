"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLocationUpdater, setShowLocationUpdater] = useState(false);
  const [shipments, setShipments] = useState<any[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("shipments");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    awb: "",
    sender: "",
    receiver: "",
    origin: "",
    destination: "",
    weight: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  // Reply modal state
  const [replyModal, setReplyModal] = useState<{ open: boolean; email: string; name: string }>({
    open: false,
    email: "",
    name: "",
  });
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Compose email modal state
  const [composeModal, setComposeModal] = useState(false);
  const [composeEmail, setComposeEmail] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [sendingCompose, setSendingCompose] = useState(false);

  // Helper functions
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (date: any) => {
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "Invalid date";
      return d.toLocaleString();
    } catch {
      return "Invalid date";
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          await Promise.all([fetchShipments(), fetchMessages()]);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Data fetching functions
  const fetchShipments = async () => {
    const res = await fetch("/api/admin/shipments");
    const data = await res.json();
    setShipments(data);
  };

  const fetchMessages = async () => {
    const res = await fetch("/api/messages");
    const data = await res.json();
    setMessages(data);
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loggingIn) return;

    setLoggingIn(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsAuthenticated(true);
        await Promise.all([fetchShipments(), fetchMessages()]);
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch {
      alert("Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  // Logout
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setActiveTab("shipments");
  };

  // Create shipment
  const createShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newShipment),
      });
      if (response.ok) {
        alert("Shipment created successfully!");
        setShowCreateForm(false);
        setNewShipment({
          awb: "",
          sender: "",
          receiver: "",
          origin: "",
          destination: "",
          weight: "",
          content: "",
        });
        await fetchShipments();
        setActiveTab("shipments");
      } else {
        const data = await response.json();
        alert(`Failed to create shipment: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create shipment.");
    }
  };

  // Update tracking
  const updateTrackingStatus = async (awb: string, status: string, location: string, notes: string) => {
    const response = await fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ awb, status, location, notes }),
    });
    if (response.ok) {
      alert("Tracking updated successfully!");
      await fetchShipments();
      setSelectedShipment(null);
    } else {
      alert("Failed to update tracking");
    }
  };

  // Mark message as read
  const markMessageAsRead = async (id: string) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchMessages();
    } catch (error) {
      console.error("Error marking message as read:", error);
      alert("Could not mark message as read");
    }
  };

  // Reply to message
  const sendReply = async () => {
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    setSendingReply(true);
    try {
      const response = await fetch("/api/admin/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: replyModal.email,
          subject: "Re: Your enquiry - First Fly Express",
          message: replyText,
          customerName: replyModal.name,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Reply sent successfully!");
        setReplyModal({ open: false, email: "", name: "" });
        setReplyText("");
      } else {
        alert(data.error || "Failed to send reply.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the reply.");
    } finally {
      setSendingReply(false);
    }
  };

  // Send compose email
  const sendComposeEmail = async () => {
    if (!composeEmail.trim() || !composeMessage.trim()) {
      alert("Please enter recipient email and message.");
      return;
    }
    setSendingCompose(true);
    try {
      const response = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: composeEmail,
          subject: composeSubject || "Message from FirstFlyExpress",
          message: composeMessage,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Email sent successfully!");
        setComposeModal(false);
        setComposeEmail("");
        setComposeSubject("");
        setComposeMessage("");
      } else {
        alert(data.error || "Failed to send email.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the email.");
    } finally {
      setSendingCompose(false);
    }
  };

  // Open reply modal
  const openReplyModal = (email: string, name: string) => {
    setReplyModal({ open: true, email, name });
    setReplyText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-shield-alt text-red-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-2">Access the administration panel</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@firstflyexpress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loggingIn ? (
                <>
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login to Dashboard
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === "unread").length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
        <div className="flex justify-around items-center">
          <button
            onClick={() => {
              setActiveTab("shipments");
              setMobileMenuOpen(false);
            }}
            className={`flex-1 flex flex-col items-center py-3 transition ${
              activeTab === "shipments"
                ? "text-red-600 border-t-2 border-red-600"
                : "text-gray-500"
            }`}
          >
            <i
              className={`fas fa-box text-xl ${
                activeTab === "shipments" ? "text-red-600" : ""
              }`}
            ></i>
            <span className="text-xs mt-1">Shipments</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              setMobileMenuOpen(false);
            }}
            className={`flex-1 flex flex-col items-center py-3 transition ${
              activeTab === "create"
                ? "text-red-600 border-t-2 border-red-600"
                : "text-gray-500"
            }`}
          >
            <i
              className={`fas fa-plus-circle text-xl ${
                activeTab === "create" ? "text-red-600" : ""
              }`}
            ></i>
            <span className="text-xs mt-1">Create</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("messages");
              setMobileMenuOpen(false);
            }}
            className={`flex-1 flex flex-col items-center py-3 transition relative ${
              activeTab === "messages"
                ? "text-red-600 border-t-2 border-red-600"
                : "text-gray-500"
            }`}
          >
            <i
              className={`fas fa-envelope text-xl ${
                activeTab === "messages" ? "text-red-600" : ""
              }`}
            ></i>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1/3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px]">
                {unreadCount}
              </span>
            )}
            <span className="text-xs mt-1">Messages</span>
          </button>
          <button
            onClick={logout}
            className="flex-1 flex flex-col items-center py-3 text-gray-500"
          >
            <i className="fas fa-sign-out-alt text-xl"></i>
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block bg-red-600 text-white px-6 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-shield-alt text-2xl"></i>
            <div>
              <h1 className="font-bold text-lg">Admin Dashboard</h1>
              <p className="text-xs text-red-100">You are logged in as Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setComposeModal(true)}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm font-semibold"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Send Email
            </button>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm font-semibold"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header - UPDATED with Send Email button */}
      <div className="md:hidden bg-red-600 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fas fa-shield-alt"></i>
            <div>
              <h1 className="font-bold text-sm">Admin Panel</h1>
              <p className="text-xs text-red-100">Administrator</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Send Email button for mobile */}
            <button
              onClick={() => setComposeModal(true)}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center"
            >
              <i className="fas fa-paper-plane mr-1"></i>
              <span>Send</span>
            </button>
            <button
              onClick={logout}
              className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-1"></i>
              <span>Exit</span>
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
              <i className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("shipments")}
                className={`px-6 py-4 font-semibold transition relative ${
                  activeTab === "shipments"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <i className="fas fa-box mr-2"></i>
                Shipments
              </button>

              <button
                onClick={() => setActiveTab("create")}
                className={`px-6 py-4 font-semibold transition relative ${
                  activeTab === "create"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <i className="fas fa-plus mr-2"></i>
                Create Shipment
              </button>

              <button
                onClick={() => setActiveTab("messages")}
                className={`px-6 py-4 font-semibold transition relative ${
                  activeTab === "messages"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <i className="fas fa-envelope mr-2"></i>
                Messages
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={logout}
              className="px-6 py-4 font-semibold text-gray-600 hover:text-red-600 transition"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Shipments Tab */}
        {activeTab === "shipments" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                <i className="fas fa-box text-red-600 mr-2"></i>
                Manage Shipments
              </h2>
              <button
                onClick={() => setActiveTab("create")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
              >
                <i className="fas fa-plus mr-2"></i>
                New Shipment
              </button>
            </div>

            {shipments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center border border-gray-100">
                <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">No shipments yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Click the button above to create your first shipment
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-6">
                {shipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-800">
                            AWB: {shipment.awb}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            Created: {formatDate(shipment.created_at || shipment.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            shipment.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : shipment.status === "In Transit"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {shipment.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm bg-gray-50 p-3 rounded-xl">
                        <div>
                          <p className="text-gray-500 text-xs">From:</p>
                          <p className="font-medium text-gray-800">{shipment.sender || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">To:</p>
                          <p className="font-medium text-gray-800">{shipment.receiver || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Origin:</p>
                          <p className="font-medium text-gray-800">{shipment.origin || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Destination:</p>
                          <p className="font-medium text-gray-800">
                            {shipment.destination || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                          Tracking History
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {shipment.tracking_updates &&
                          shipment.tracking_updates.length > 0 ? (
                            shipment.tracking_updates.map((update: any, idx: number) => (
                              <div key={update.id || idx} className="flex items-start gap-3 text-sm">
                                <div
                                  className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                                    update.completed ? "bg-green-500" : "bg-gray-300"
                                  }`}
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{update.status}</p>
                                  <p className="text-xs text-gray-500">
                                    {update.location} • {formatDateTime(update.timestamp)}
                                  </p>
                                  {update.notes && (
                                    <p className="text-xs text-gray-600 mt-1">{update.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm text-center py-4">
                              No tracking updates yet
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setShowLocationUpdater(true);
                        }}
                        className="mt-4 text-red-600 hover:text-red-700 text-sm font-semibold w-full sm:w-auto bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Update Tracking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Shipment Tab */}
        {activeTab === "create" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                <i className="fas fa-plus-circle text-green-600 mr-2"></i>
                Create New Shipment
              </h2>
              <button
                onClick={() => setActiveTab("shipments")}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
              <form onSubmit={createShipment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Airway Bill Number (AWB) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newShipment.awb}
                    onChange={(e) => setNewShipment({ ...newShipment, awb: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                    placeholder="e.g., FFE-2024001"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sender Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.sender}
                      onChange={(e) => setNewShipment({ ...newShipment, sender: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Receiver Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.receiver}
                      onChange={(e) => setNewShipment({ ...newShipment, receiver: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Origin City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.origin}
                      onChange={(e) => setNewShipment({ ...newShipment, origin: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.destination}
                      onChange={(e) =>
                        setNewShipment({ ...newShipment, destination: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      value={newShipment.weight}
                      onChange={(e) => setNewShipment({ ...newShipment, weight: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content Type *
                    </label>
                    <input
                      type="text"
                      required
                      value={newShipment.content}
                      onChange={(e) => setNewShipment({ ...newShipment, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 transition"
                      placeholder="e.g., Documents, Electronics"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition shadow-md"
                  >
                    <i className="fas fa-save mr-2"></i>
                    Create Shipment
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewShipment({
                        awb: "",
                        sender: "",
                        receiver: "",
                        origin: "",
                        destination: "",
                        weight: "",
                        content: "",
                      });
                    }}
                    className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
              <i className="fas fa-envelope text-blue-600 mr-2"></i>
              Customer Messages
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm rounded-full px-3 py-1">
                  {unreadCount} unread
                </span>
              )}
            </h2>

            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center border border-gray-100">
                <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg">No messages yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Messages from contact form and enquiry modal will appear here
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition ${
                      message.status === "unread"
                        ? "border-l-4 border-l-red-500 shadow-md ring-1 ring-red-100"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{message.name}</h3>
                          <p className="text-sm text-gray-500">{message.email}</p>
                          {message.phone && (
                            <p className="text-xs text-gray-500 mt-1">
                              <i className="fas fa-phone-alt mr-1"></i> {message.phone}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400">
                            {formatDateTime(message.created_at)}
                          </span>
                          {message.status === "unread" && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <i className="fas fa-circle mr-1 text-xs"></i> New
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {message.company && (
                        <div className="mb-3 p-2 bg-gray-50 rounded-lg text-sm">
                          <i className="fas fa-building text-gray-500 mr-2"></i>
                          <span className="font-medium">Company:</span> {message.company}
                        </div>
                      )}

                      {(message.pickup || message.delivery || message.weight || message.content_type) && (
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-blue-50 rounded-xl text-sm">
                          {message.pickup && (
                            <div>
                              <span className="text-xs text-gray-500 block">Pickup Location</span>
                              <span className="font-medium text-gray-800">{message.pickup}</span>
                            </div>
                          )}
                          {message.delivery && (
                            <div>
                              <span className="text-xs text-gray-500 block">Delivery Location</span>
                              <span className="font-medium text-gray-800">{message.delivery}</span>
                            </div>
                          )}
                          {message.weight && (
                            <div>
                              <span className="text-xs text-gray-500 block">Weight</span>
                              <span className="font-medium text-gray-800">{message.weight} kg</span>
                            </div>
                          )}
                          {message.content_type && (
                            <div>
                              <span className="text-xs text-gray-500 block">Content Type</span>
                              <span className="font-medium text-gray-800">{message.content_type}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => openReplyModal(message.email, message.name)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          <i className="fas fa-reply mr-2"></i>
                          Reply via Email
                        </button>
                        {message.status === "unread" && (
                          <button
                            onClick={() => markMessageAsRead(message.id)}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                          >
                            <i className="fas fa-check mr-2"></i>
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Update Tracking Modal */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl p-6 w-full max-w-md animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Update Tracking</h3>
              <button
                onClick={() => setSelectedShipment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4 pb-2 border-b">
              AWB: <span className="font-semibold">{selectedShipment.awb}</span>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const status = formData.get("status") as string;
                const location = formData.get("location") as string;
                const notes = formData.get("notes") as string;
                updateTrackingStatus(selectedShipment.awb, status, location, notes);
              }}
            >
              <select
                name="status"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select Status</option>
                <option value="Booking Confirmed">Booking Confirmed</option>
                <option value="Picked Up">Picked Up</option>
                <option value="In Transit">In Transit</option>
                <option value="Arrived at Destination Hub">Arrived at Destination Hub</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-3 focus:ring-2 focus:ring-red-500"
                required
              />
              <textarea
                name="notes"
                placeholder="Additional Notes"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShipment(null)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Reply to {replyModal.name}
              </h3>
              <button
                onClick={() => setReplyModal({ open: false, email: "", name: "" })}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Replying to: <span className="font-medium">{replyModal.email}</span>
            </p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {replyText.length} characters
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {sendingReply ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Send Reply
                  </>
                )}
              </button>
              <button
                onClick={() => setReplyModal({ open: false, email: "", name: "" })}
                className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {composeModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Send Email to Client</h3>
              <button
                onClick={() => setComposeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times text-2xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={composeEmail}
                  onChange={(e) => setComposeEmail(e.target.value)}
                  placeholder="client@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Message from FirstFlyExpress"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
                  required
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {composeMessage.length} characters
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={sendComposeEmail}
                  disabled={sendingCompose}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {sendingCompose ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Email
                    </>
                  )}
                </button>
                <button
                  onClick={() => setComposeModal(false)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Compose FAB - kept for convenience */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setComposeModal(true)}
          className="bg-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition"
        >
          <i className="fas fa-paper-plane text-xl"></i>
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}