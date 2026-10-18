export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-900 px-6 py-8 text-center text-gray-300">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="inline-block text-lg font-bold tracking-tight text-white transition-colors duration-300 hover:text-blue-400"
        >
          Event Booking<span className="text-blue-500">.</span>
        </a>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          Discover experiences. Create memories.
        </p>

        <div className="mx-auto my-6 h-px max-w-md bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Event Booking. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
