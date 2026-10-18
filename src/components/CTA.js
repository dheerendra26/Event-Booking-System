import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden bg-blue-600 px-6 py-20 text-center text-white sm:py-24">
      <div className="cta-glow pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />

      <div className="cta-glow pointer-events-none absolute -bottom-32 -left-16 -z-10 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="animate-fade-up mx-auto max-w-3xl">
        <span className="mb-5 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
          Your next experience starts here
        </span>

        <h2 className="mb-5 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Ready to Book Your Next Event?
        </h2>

        <p className="mx-auto mb-8 max-w-xl text-base leading-7 text-blue-100 sm:text-lg">
          Discover exciting experiences, find your next favorite event, and make
          every moment memorable.
        </p>

        <button
          className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
          onClick={() => navigate("/events")}
        >
          Explore Events
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>
    </section>
  );
}
