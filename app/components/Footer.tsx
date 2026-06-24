import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-900 border-t border-blue-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">MyWellness</h3>
            <p className="text-blue-100">
              A mental well-being monitoring system for FUTA students.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-blue-100 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-blue-100 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  FUTA Counseling Services
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-100 hover:text-white transition-colors">
                  Emergency Contacts
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-8 text-center">
          <p className="text-blue-200">
            © {new Date().getFullYear()} MyWellness. For educational purposes only. Not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
