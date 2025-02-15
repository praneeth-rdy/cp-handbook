import { Link } from "react-router";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="text-center max-w-3xl mx-auto backdrop-blur-sm bg-white/10 p-12 rounded-xl shadow-xl">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-blue-300 mb-8 leading-tight">
          Competitive Programming Practice
        </h1>
        <p className="text-xl text-slate-300 mb-12 font-light">
          Master algorithms and data structures through carefully curated problem sets
        </p>
        <Link 
          to="/az/chapters"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 ease-in-out rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <span className="relative">Start Your Journey</span>
          <svg 
            className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 ease-in-out group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
