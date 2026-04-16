import Image from "next/image";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center px-12 py-8 bg-white rounded-lg shadow-md ">
        <div className="flex space-x-2 items-center">
          <Image src="/logo.svg" alt="Logo" height={40} width={40} />
          <h1 className="font-bold text-primary text-xl ">Tols Barbershop</h1>
        </div>
        <h2 className="text-2xl font-semibold mt-2 text-center">
          Login to Your Account
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your credentials to access your account.
        </p>

        <form action="" className="w-full">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 w-full rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-300 w-full rounded-md py-2 px-4 mb-2 focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="bg-accent hover:bg-accent/90 mb-4 w-full text-white py-2 px-4 rounded-md transition duration-300"
          >
            Login
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <a href="/register" className="text-accent hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
