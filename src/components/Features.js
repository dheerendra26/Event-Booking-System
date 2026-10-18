const features = [
  {
    icon: "✦",
    title: "Easy Booking",
    description:
      "Book your favorite events in just a few clicks with a simple, seamless experience.",
  },
  {
    icon: "⌕",
    title: "Discover Great Events",
    description:
      "Explore concerts, conferences, and exciting experiences all in one place.",
  },
  {
    icon: "✓",
    title: "Verified Listings",
    description:
      "Browse clear, reliable event information to help you plan with confidence.",
  },
];

export default function Features() {
  return (
    <section className="bg-gray-50 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            The better way to explore
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose Us?
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Everything you need to find and book your next great experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              style={{ "--delay": `${index * 120}ms` }}
              className="animate-fade-up group rounded-2xl border border-gray-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-600/10"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-semibold text-blue-600 transition-all duration-300 group-hover:rotate-6 group-hover:bg-blue-600 group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="leading-7 text-gray-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
