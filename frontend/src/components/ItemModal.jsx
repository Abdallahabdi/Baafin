import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { UserContext } from '../utils/UserContext';

export default function ItemModal({ open, onClose, onSubmit, initialData }) {
  const { user } = useContext(UserContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#000000');
  const [location, setLocation] = useState('');
  const [dateFound, setDateFound] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || '');
      setColor(initialData.color || '#000000');
      setLocation(initialData.location || '');
      setDateFound(initialData.dateFound?.split('T')[0] || '');
      setPreview(initialData.imageUrl || null);
      setContact(initialData.contact || '');
      setImage(null);
    } else {
      setTitle('');
      setDescription('');
      setCategory('');
      setColor('#000000');
      setLocation('');
      setDateFound('');
      setContact('');
      setPreview(null);
      setImage(null);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !category || !location || !dateFound || !contact) {
      alert('Fadlan dhammaan xogta buuxi');
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('category', category);
    fd.append('color', color);
    fd.append('location', location);
    fd.append('dateFound', dateFound);
    fd.append('contact', contact);
    fd.append('username', user?.username || 'Guest');

    if (image) fd.append('image', image);
    //else if (initialData?.imageUrl) fd.append('imageUrl', initialData.imageUrl);

    onSubmit(fd);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-3 sm:px-6">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <FaTimes size={22} />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-blue-700 text-center mb-6">
          {initialData ? 'Edit Lost Item' : 'Add Lost Item'}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Item Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input col-span-1 sm:col-span-2"
          />

          <textarea
            placeholder="Item Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input col-span-1 sm:col-span-2 resize-none"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            <option value="">Select Category</option>
            <option>Electronics</option>
            <option>Documents</option>
            <option>Clothing</option>
            <option>Accessories</option>
            <option>Other</option>
          </select>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input"
          />

          <input
            type="date"
            value={dateFound}
            onChange={(e) => setDateFound(e.target.value)}
            className="input"
          />

          <input
            type="text"
            placeholder="Phone or Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="input"
          />

          {/* Color */}
          <div className="flex items-center gap-2">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="input flex-1"
            />
          </div>

          {/* Image */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center col-span-1 sm:col-span-2">
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 col-span-1 sm:col-span-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {initialData ? 'Update Item' : 'Save Item'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
