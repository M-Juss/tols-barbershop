import { useState } from "react";
import { Mail, Phone, Award, Pencil, Plus, Trash2, X, User } from "lucide-react";

interface Barber {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  specialties: string[];
}

const initialBarbers: Barber[] = [
  {
    id: 1,
    name: "Miguel Santos",
    email: "miguel.santos@tolsbarber...",
    phone: "+63 912 345 6789",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    specialties: ["Premium Haircut", "Beard Trim"],
  },
  {
    id: 2,
    name: "Carlos Reyes",
    email: "carlos.reyes@tolsbarbers...",
    phone: "+63 923 456 7890",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    specialties: ["Hair Color", "Regular Haircut"],
  },
  {
    id: 3,
    name: "Ramon Cruz",
    email: "ramon.cruz@tolsbarbersh...",
    phone: "+63 934 567 8901",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    specialties: ["Deluxe Services", "Kids Haircut"],
  },
  {
    id: 4,
    name: "Jose Villanueva",
    email: "jose.villanueva@tolsbarber...",
    phone: "+63 945 678 9012",
    image: "https://randomuser.me/api/portraits/men/68.jpg",
    specialties: ["Hot Towel Shave", "Beard Trim"],
  },
];

const emptyForm = { name: "", email: "", phone: "", image: "", specialties: "" };

export function Barber() {
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAdd = () => {
    if (!form.name.trim()) return;
    setBarbers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        image: form.image,
        specialties: form.specialties.split(",").map((s) => s.trim()).filter(Boolean),
      },
    ]);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBarbers((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="w-full bg-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Barbers</h1>
          <p className="text-gray-500 mt-1">Manage your barbershop staff</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold rounded-xl px-5 py-3 text-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Barber
        </button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-3 gap-4">
        {barbers.map((barber) => (
          <div key={barber.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col items-center">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-200 shrink-0">
              {barber.image ? (
                <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>

            {/* Name */}
            <p className="font-bold text-gray-900 text-lg mb-3 text-center">{barber.name}</p>

            {/* Details */}
            <div className="w-full space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Mail className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span className="truncate">{barber.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Phone className="w-4 h-4 shrink-0" strokeWidth={1.8} />
                <span>{barber.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-500 text-sm">
                <Award className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.8} />
                <div className="flex flex-wrap gap-1.5">
                  {barber.specialties.map((s) => (
                    <span key={s} className="bg-blue-100 text-blue-500 text-xs font-medium px-2.5 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="w-full border-t border-gray-100 pt-3 flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <Pencil className="w-4 h-4" strokeWidth={2} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(barber.id)}
                className="bg-red-500 hover:bg-red-600 transition-colors text-white rounded-lg p-2"
              >
                <Trash2 className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Add Barber Modal */}
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

            <h2 className="text-2xl font-bold text-gray-900">Add New Barber</h2>
            <p className="text-gray-500 text-sm mt-0.5 mb-6">Fill in the barber information</p>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Contact Number</label>
                <input
                  type="text"
                  placeholder="+63 912 345 6789"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* Profile Image URL */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Profile Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1.5">Specialties (comma separated)</label>
                <input
                  type="text"
                  placeholder="Haircut, Beard Trim, Hair Color"
                  value={form.specialties}
                  onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  className="w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
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
                Add Barber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}