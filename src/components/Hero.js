import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 text-center text-white sm:py-28 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="hero-orb absolute -left-24 -top-20 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
        <div className="hero-orb hero-orb-delay absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-300" />
            Find your next experience
          </span>
        </div>

        <h1
          className="animate-fade-up mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl"
          style={{ "--delay": "100ms" }}
        >
          Book Events
          <span className="mt-2 block text-blue-100">Seamlessly.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8"
          style={{ "--delay": "200ms" }}
        >
          Discover exciting events, plan unforgettable experiences, and book
          your next adventure — all in one place.
        </p>

        <div
          className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ "--delay": "300ms" }}
        >
          <button
            onClick={() => navigate("/events")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-blue-600 shadow-lg shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:w-auto"
          >
            Explore Events
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>

          <span className="text-sm text-blue-100">
            Your next great experience awaits
          </span>
        </div>
      </div>
    </section>
  );
}
