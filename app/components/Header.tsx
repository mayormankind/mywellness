import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 border-b border-blue-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">MyWellness</span>
          </Link>
          <nav className="flex space-x-4">
            <Link
              href="/"
              className="text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/login"
              className="text-blue-100 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 transition-colors px-4 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
