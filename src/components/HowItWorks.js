const steps = [
  {
    number: "01",
    title: "Browse Events",
    description: "Explore upcoming events and find something you love.",
  },
  {
    number: "02",
    title: "Book Tickets",
    description: "Choose your event and make your booking with ease.",
  },
  {
    number: "03",
    title: "Enjoy the Experience",
    description: "Show up, enjoy the moment, and create lasting memories.",
  },
];

export default function HowItWorks() {
  return (
    <section className="overflow-hidden bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="animate-fade-up mb-12 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Simple by design
          </span>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>

          <p className="mt-4 text-gray-600">
            Three simple steps to your next unforgettable experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.number}
              style={{ "--delay": `${index * 150}ms` }}
              className="animate-fade-up group relative rounded-2xl border border-gray-200 bg-gray-50 p-7 transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-xl hover:shadow-blue-600/10 sm:p-8"
            >
              <span className="text-sm font-bold tracking-widest text-blue-600">
                STEP {step.number}
              </span>

              <div className="my-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20 transition-transform duration-300 group-hover:scale-110">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-600">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
