import { InputWithLabel } from "@/components/common/InputWithLabel";

export function RegisterForm() {
  return (
    <form action="" className="w-full">
      <div className="mb-4">
        <InputWithLabel
          id="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
        />
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
        />
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
        />
      </div>
      <div className="mb-4">
        <InputWithLabel
          id="confirm-password"
          type="password"
          label="Confirm Password"
          placeholder="Enter your password"
          className="h-10 border-gray-300 focus-visible:ring-accent/40"
        />
      </div>
      <button
        type="submit"
        className="bg-accent hover:bg-accent/90 mb-4 w-full text-white py-2 px-4 rounded-md transition duration-300"
      >
        Register
      </button>
    </form>
  );
}
