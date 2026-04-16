import { CalendarDays, Lock, Mail, Pencil, Trash2, User } from "lucide-react";

export function Profile() {
  return (
    <div className="w-full max-h-screen bg-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Account Information</h2>
            <p className="text-gray-500 text-sm mt-0.5">Your personal details</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
            <Pencil className="w-4 h-4" strokeWidth={2} />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Full Name</label>
            <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm">
              <User className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>John Dela Cruz</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Email</label>
            <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm">
              <Mail className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>john.delacruz@email.com</span>
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Contact Number</label>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm">
              <span>+63 912 345 6789</span>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1.5">Member Since</label>
            <div className="flex items-center gap-2.5 bg-gray-100 rounded-lg px-3 py-2.5 text-gray-400 text-sm">
              <CalendarDays className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>January 15, 2024</span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Control */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-900">Account Control</h2>
        <p className="text-gray-500 text-sm mt-0.5 mb-6">Manage your account settings and security</p>

        {/* Email Notifications */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Email Notifications</p>
            <p className="text-gray-500 text-sm mt-0.5">Receive email confirmations when booking an appointment</p>
          </div>
          {/* Toggle — ON state */}
          <div className="relative inline-flex items-center cursor-pointer">
            <div className="w-12 h-6 bg-gray-900 rounded-full flex items-center px-0.5">
              <div className="w-5 h-5 bg-white rounded-full shadow ml-auto" />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between py-5 border-b border-gray-100">
          <div>
            <p className="text-sm font-bold text-gray-900">Password</p>
            <p className="text-gray-500 text-sm mt-0.5">Update your password to keep your account secure</p>
          </div>
          <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors whitespace-nowrap">
            <Lock className="w-4 h-4" strokeWidth={2} />
            Change Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="text-sm font-bold text-red-500">Delete Account</p>
            <p className="text-gray-500 text-sm mt-0.5">Permanently delete your account and all associated data</p>
          </div>
          <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-colors text-white rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap">
            <Trash2 className="w-4 h-4" strokeWidth={2} />
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
}