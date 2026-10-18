const events = [
  {
    name: "Music Fest 2025",
    date: "July 20",
    location: "Delhi",
    category: "Music",
  },
  {
    name: "Tech Conference",
    date: "Aug 5",
    location: "Bengaluru",
    category: "Technology",
  },
  {
    name: "Startup Pitch Night",
    date: "Aug 12",
    location: "Mumbai",
    category: "Networking",
  },
];

export default function PopularEvents() {
  return (
    <section className="bg-gray-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Handpicked for you
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Popular Events
          </h2>

          <p className="mt-4 text-gray-600">
            Discover experiences worth looking forward to.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {events.map((event, index) => (
            <article
              key={event.name}
              style={{ "--delay": `${index * 120}ms` }}
              className="animate-fade-up group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/10"
            >
              <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" />

                <span className="relative text-5xl font-light text-white/90 transition-transform duration-500 group-hover:scale-125">
                  ✦
                </span>

                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {event.category}
                </span>

                <span className="absolute bottom-4 right-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                  {event.date}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                  {event.name}
                </h3>

                <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <span className="text-blue-600">⌖</span>
                  {event.location}
                </p>

                <div className="mt-5 border-t border-gray-100 pt-4">
                  <span className="text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700">
                    Discover this event{" "}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
