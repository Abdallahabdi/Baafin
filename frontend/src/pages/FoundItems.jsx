import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import ProtectedRoute from '../components/ProtectedRoute';
import API from '../api/api';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import ItemModal from '../components/ItemModal';

export default function FoundItems() {
  const [foundItems, setFoundItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [chatUser, setChatUser] = useState(null); // For chat modal

  const fetchFoundItems = async () => {
    const res = await API.get('/found');
    setFoundItems(res.data || []);
  };

  useEffect(() => {
    fetchFoundItems();
  }, []);

  const filteredItems = foundItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await API.delete(`/found/${id}`);
    toast.success("Found item deleted successfully");
    fetchFoundItems();
  };

  // ADD / EDIT
  const handleSubmit = async (data) => {
    if (editItem) {
      await API.put(`/found/${editItem._id}`, data);
      toast.success("Found item updated successfully");
    } else {
      await API.post('/found', data);
      toast.success("Found item added successfully");
    }
    fetchFoundItems();
    setShowModal(false);
    setEditItem(null);
  };

  // Chat modal logic (copied from LostItems)
  const ChatModal = ({ user, onClose }) => {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
      if (!message.trim()) {
        toast.error("Message cannot be empty");
        return;
      }
      setSending(true);
      try {
        await API.post("/messages", {
          to: user.ownerId || user.userId || user.owner || user.email, // adjust as needed
          itemId: user._id || user.id,
          message,
        });
        toast.success("Message sent!");
        setMessage("");
        onClose();
      } catch (err) {
        toast.error("Failed to send message");
      } finally {
        setSending(false);
      }
    };

    return user ? (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-bold mb-2">Chat with Owner</h2>
          <p className="mb-4 text-sm text-gray-500">Send a message to the owner of this item.</p>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows={4}
            placeholder="Type your message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={sending}
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} disabled={sending} className="bg-gray-300 px-4 py-2 rounded">Close</button>
            <button onClick={handleSend} disabled={sending} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <ProtectedRoute>
      <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2">Found Items</h1>
          <p className="text-muted-foreground">
            Browse through reported found items. If you lost something, see if someone has found it and help reunite it with its owner.
          </p>
        </div>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground">🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search found items..."
              className="pl-10 pr-4 py-2 border rounded w-full"
            />
          </div>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto justify-center"
          >
            <FaPlus /> <span className="hidden sm:inline">Add Found</span>
          </button>
        </div>
        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {filteredItems.length === 1 ? 'Showing 1 item' : `Showing ${filteredItems.length} items`}
          </p>
        </div>

        {/* BACK BUTTON */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            &#8592; Back
          </button>
        </div>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredItems.length ? (
            filteredItems.map(item => (
              <div
                key={item._id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative group flex flex-col h-full"
              >
                {/* Status badge */}
                {item.status && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold
                    ${item.status === 'Lost' ? 'bg-red-500 text-white'
                    : item.status === 'Found' ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-white'}`}>
                    {item.status}
                  </span>
                )}
                {/* Matched badge */}
                {item.matched && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white">
                    Matched
                  </span>
                )}

                {/* Image */}
                <div className="relative w-full">
                  <img
                    src={(() => {
                      const img = item.image;
                      if (!img) return '/placeholder.png';
                      if (img.startsWith('http') || img.startsWith('/uploads/')) return img;
                      return `/uploads/${img}`;
                    })()}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 object-cover"
                    onError={e => { e.target.onerror=null; e.target.src='/placeholder.png'; }}
                  />
                  {/* Hover Overlay Buttons */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                    <button onClick={() => { setEditItem(item); setShowModal(true); }}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-800">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-800">
                      <FaTrash />
                    </button>
                    <button onClick={() => setChatUser(item)}
                      className="bg-green-600 text-white p-2 rounded-full hover:bg-green-800">
                      💬
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1">
                  <p className="text-xs font-medium text-green-600 uppercase">{item.category}</p>
                  <h2 className="text-lg font-semibold mt-1 text-gray-800">{item.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>

                  <div className="flex items-center gap-3 mt-3 text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-gray-400 text-[0.8rem]" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400 text-[0.8rem]" /> {new Date(item.dateFound).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-400 p-6">No found items</p>
          )}
        </div>

        {/* MODAL */}
        <ItemModal
          open={showModal}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSubmit={handleSubmit}
          initialData={editItem}
        />
        <ChatModal user={chatUser} onClose={() => setChatUser(null)} />
      </div>
    </ProtectedRoute>
  );
}
