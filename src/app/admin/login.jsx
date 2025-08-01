export default function AdminLogin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      {/* Add your login form here */}
      <form className="space-y-4 w-full max-w-sm">
        <input type="text" placeholder="Username" className="w-full px-4 py-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full px-4 py-2 border rounded" />
        <button type="submit" className="w-full bg-[#8300FF] text-white py-2 rounded font-semibold">Login</button>
      </form>
    </div>
  );
}
