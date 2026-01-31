import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ProtectedRoute from '../components/ProtectedRoute';
import API from '../api/api';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import ItemModal from '../components/ItemModal';

// Fallbacks for Button, Input, Badge, Select if shadcn/ui is not installed
const Button = (props) => (
  <button
    {...props}
    className={
      "bg-blue-600 text-white px-4 py-2 rounded " + (props.className || "")
    }
  >
    {props.children}
  </button>
);
const Input = (props) => (
  <input
    {...props}
    className={"border rounded px-3 py-2 " + (props.className || "")}
  />
);
const Badge = (props) => (
  <span
    className={
      "inline-block px-2 py-0.5 rounded text-xs font-semibold " +
      (props.className || "")
    }
  >
    {props.children}
  </span>
);
const Select = ({ value, onValueChange = () => {}, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="border rounded px-3 py-2"
  >
    {children}
  </select>
);
const SelectTrigger = ({ children, ...rest }) => <>{children}</>;
const SelectValue = ({ placeholder }) => <>{placeholder}</>;
const SelectContent = ({ children }) => <>{children}</>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const Navbar = () => null; // Replace with your Navbar import/component
const Footer = () => null; // Replace with your Footer import/component

const categories = [
  "All Categories",
  "Electronics",
  "Personal Items",
  "Keys",
  "Bags",
  "Documents",
  "Jewelry",
  "Clothing",
  "Other",
];

const LostItems = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [chatUser, setChatUser] = useState(null); // For chat modal
  const [lostItems, setLostItems] = useState([]);
  const [error, setError] = useState(null);

  const fetchLostItems = async () => {
    try {
      const res = await API.get('/lost');
      setLostItems(res.data || []);
    } catch (err) {
      setError(err.message || "Error loading items");
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  const filteredItems = lostItems.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Simple chat modal (demo)
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
        // Replace with your real API endpoint and payload structure
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
            <Button onClick={onClose} disabled={sending}>Close</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSend} disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    ) : null;
  };

  // Icon fallbacks
  const SearchIcon = () => <span role="img" aria-label="search">🔍</span>;
  const MapPinIcon = () => <span role="img" aria-label="location">📍</span>;
  const CalendarIcon = () => <span role="img" aria-label="calendar">📅</span>;
  const GridIcon = () => <span role="img" aria-label="grid">🔲</span>;
  const ListIcon = () => <span role="img" aria-label="list">📋</span>;

  // Helper to get correct image URL
  const getImageUrl = (item) => {
    if (!item.imageUrl && !item.image) return "/placeholder.png";
    const filename = item.imageUrl || item.image;
    if (filename.startsWith("/uploads/")) return filename;
    return `/uploads/${filename}`;
  };

  // Add dummy handlers for grid/list buttons to confirm connection
  const handleGridView = () => {
    setViewMode("grid");
    toast.success("Grid view activated");
  };
  const handleListView = () => {
    setViewMode("list");
    toast.success("List view activated");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-14 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">Lost Items</h1>
            <p className="text-muted-foreground">
              Browse through reported lost items. If you found something, help reunite it with its owner.
            </p>
          </div>
          {/* Filters */}
          <div className="bg-card rounded-xl shadow-md p-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"><SearchIcon /></span>
                <Input
                  placeholder="Search lost items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto items-stretch sm:items-center">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex border border-border rounded-lg self-center">
                  <button
                    onClick={handleGridView}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    } rounded-l-lg transition-colors`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    onClick={handleListView}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    } rounded-r-lg transition-colors`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Results */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-0">
            <p className="text-muted-foreground">
              {error ? (
                <span className="text-red-500">{error}</span>
              ) : (
                <>
                  Showing <span className="font-medium text-foreground">{filteredItems.length}</span> items
                </>
              )}
            </p>
            <button
              onClick={() => { setEditItem(null); setShowModal(true); }}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto justify-center"
            >
              <FaPlus /> <span className="hidden sm:inline">Report Lost Item</span>
            </button>
          </div>
          {/* Items Grid/List */}
          {error ? (
            <div className="text-center py-10 text-red-500">{error}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No lost items found.</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredItems.map((item) => {
                const imageUrl = getImageUrl(item);
                return (
                  <div key={item._id || item.id} className="card-interactive overflow-hidden relative group flex flex-col h-full">
                    <Link to={`/items/${item._id || item.id}`}>
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.onerror=null; e.target.src='/placeholder.png'; }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-destructive text-destructive-foreground">
                            Lost
                          </Badge>
                        </div>
                        {item.status === "matched" && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-secondary text-secondary-foreground">
                              Matched
                            </Badge>
                          </div>
                        )}
                        {item.status === "resolved" && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-success text-success-foreground">
                              Resolved
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-primary font-medium uppercase tracking-wide">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPinIcon />
                            {item.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon />
                            {item.date ? new Date(item.date).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <Button className="bg-blue-600 hover:bg-blue-800 p-2 rounded-full" onClick={() => {/* TODO: Edit logic */}} title="Edit">
                        <FaEdit />
                      </Button>
                      <Button className="bg-red-600 hover:bg-red-800 p-2 rounded-full" onClick={() => {/* TODO: Delete logic */}} title="Delete">
                        <FaTrash />
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-800 p-2 rounded-full" onClick={() => setChatUser(item)} title="Message Owner">
                        💬
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item._id || item.id} className="card-interactive flex flex-col sm:flex-row gap-4 p-4 relative group">
                  <Link to={`/items/${item._id || item.id}`} className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.onerror=null; e.target.src='/placeholder.png'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-destructive text-destructive-foreground text-xs">
                              Lost
                            </Badge>
                            <span className="text-xs text-primary font-medium">
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {item.title}
                          </h3>
                        </div>
                        {item.status === "matched" && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            Matched
                          </Badge>
                        )}
                        {item.status === "resolved" && (
                          <Badge className="bg-success text-success-foreground">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <MapPinIcon />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <CalendarIcon />
                          {item.date ? new Date(item.date).toLocaleDateString() : ""}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <Button className="bg-blue-600 hover:bg-blue-800 p-2 rounded-full" onClick={() => {/* TODO: Edit logic */}} title="Edit">
                      <FaEdit />
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-800 p-2 rounded-full" onClick={() => {/* TODO: Delete logic */}} title="Delete">
                      <FaTrash />
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-800 p-2 rounded-full" onClick={() => setChatUser(item)} title="Message Owner">
                      💬
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <ChatModal user={chatUser} onClose={() => setChatUser(null)} />
      <Footer />
    </div>
  );
};

export default LostItems;