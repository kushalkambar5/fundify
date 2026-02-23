import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";
import logo from "../assets/logo.png";

export default function DashboardNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "ChatBot", path: "/chatbot" },
    { label: "Account Info", path: "/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo + Name */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl overflow-hidden bg-white shadow-md shadow-emerald-200 border border-emerald-100 flex items-center justify-center p-1 group-hover:shadow-lg group-hover:shadow-emerald-300 transition-all duration-300">
            <img
              src={logo}
              alt="Fundify Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-slate-900 text-2xl font-black tracking-tight group-hover:text-emerald-600 transition-colors duration-200">
            Fundify
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-emerald-50 rounded-full p-1 border border-emerald-100">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-100"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Profile Icon */}
        <Link to="/profile" className="group relative" title="Go to Profile">
          <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all duration-200 group-hover:scale-105 flex items-center justify-center bg-emerald-50">
            <CircleUserRound
              className="h-6 w-6 text-emerald-600"
              strokeWidth={1.5}
            />
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
        </Link>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-center gap-2 px-4 pb-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                px-4 py-1.5 rounded-lg text-xs font-semibold transition-all
                ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
