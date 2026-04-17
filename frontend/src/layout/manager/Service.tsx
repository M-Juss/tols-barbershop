import { useState } from "react";
import { Clock, DollarSign, Pencil, Plus, Trash2, X } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

const initialServices: Service[] = [
  { id: 1, name: "Regular Haircut", description: "Classic haircut with basic styling", duration: 30, price: 200 },
  { id: 2, name: "Premium Haircut", description: "Premium haircut with wash and styling", duration: 45, price: 250 },
  { id: 3, name: "Premium Haircut + Beard Trim", description: "Complete grooming package with haircut and beard styling", duration: 60, price: 350 },
  { id: 4, name: "Deluxe Haircut + Hot Towel", description: "Luxury haircut experience with hot towel treatment", duration: 60, price: 450 },
  { id: 5, name: "Beard Trim", description: "Professional beard trimming and shaping", duration: 20, price: 150 },
  { id: 6, name: "Hair Color", description: "Professional hair coloring service", duration: 120, price: 800 },
];

export function Service() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", duration: 30, price: 200 });

  const openModal = () => {
    setForm({ name: "", description: "", duration: 30, price: 200 });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setServices((prev) => [
      ...prev,
      { id: Date.now(), name: form.name, description: form.description, duration: form.duration, price: form.price },
    ]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="w-full bg-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 mt-1">Manage your barbershop services</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl px-5 py-3 text-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-900 text-base">{service.name}</p>
              <p className="text-gray-500 text-sm mt-1">{service.description}</p>
            </div>
            <div>
              <div className="flex items-center justify-between mt-4 mb-3">
                <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" strokeWidth={1.8} />
                  {service.duration} mins
                </span>
                <span className="flex items-center gap-1 font-bold text-gray-900 text-lg">
                  <DollarSign className="w-4 h-4 text-gray-500" strokeWidth={1.8} />
                  ₱{service.price}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                  <Pencil className="w-4 h-4" strokeWidth={2} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-lg p-2"
                >
                  <Trash2 className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* Add Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-lg shadow-xl relative">
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900">Add New Service</h2>
            <p className="text-gray-500 text-sm mt-0.5 mb-6">Fill in the service information</p>

            {/* Service Name */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Service Name</label>
              <input
                type="text"
                placeholder="e.g., Premium Haircut"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-900 mb-1.5">Description</label>
              <textarea
                placeholder="Describe the service..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none resize-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Duration & Price */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Duration (minutes)</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Price (₱)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="border border-gray-200 rounded-xl px-6 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl px-6 py-2.5 text-sm"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}