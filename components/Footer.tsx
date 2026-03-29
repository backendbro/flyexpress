import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8 mb-12 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold italic mb-4">
              <span className="text-red-500">First</span> Fly Express
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading logistics and courier solution partners committed to
              delivering value and building long term customer relationships.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 inline-block pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-red-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="hover:text-red-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/#services"
                  className="hover:text-red-500 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-red-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4 border-b border-gray-700 inline-block pb-2">
              Connect With Us
            </h4>
            <div className="flex justify-center md:justify-start gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <i className="fab fa-facebook-f" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-colors"
              >
                <i className="fab fa-twitter" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <i className="fab fa-google-plus-g" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} First Fly Express. All Rights Reserved.</p>
          <Link
            href="/#home"
            className="mt-4 md:mt-0 bg-gray-800 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors text-xs"
          >
            <i className="fas fa-arrow-up mr-2" /> Back to Top
          </Link>
        </div>
      </div>
    </footer>
  );
}
