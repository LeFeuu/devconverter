import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">DevConverter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/converter" className="text-gray-700 hover:text-blue-600">
                Converter
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">
                Pricing
              </Link>
              <Link 
                href="/converter" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Try Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Convert Your Data <span className="text-blue-600">Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Free online converter for developers. Transform JSON, CSV, YAML, and XML 
            in seconds. No signup required.
          </p>
          <Link 
            href="/converter"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Converting →
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Convert your files instantly in your browser. No server uploads needed.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
            <p className="text-gray-600">
              All conversions happen locally. Your data never leaves your computer.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-3xl mb-4">🆓</div>
            <h3 className="text-xl font-semibold mb-2">Free Forever</h3>
            <p className="text-gray-600">
              5 conversions per day free. Upgrade to Pro for unlimited access.
            </p>
          </div>
        </div>

        {/* Supported Formats */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-8">Supported Formats</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {['JSON', 'CSV', 'YAML', 'XML'].map(format => (
              <div key={format} className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-semibold">
                {format}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600">
          <p>© 2025 DevConverter. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  )
}
