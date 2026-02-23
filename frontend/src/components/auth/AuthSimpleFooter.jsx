import React from "react";
import { Link } from "react-router-dom";

function AuthSimpleFooter() {
  return (
    <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <p>© 2024 Fundify AI Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <Link
            to="/privacy-policy"
            className="hover:text-navy dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="hover:text-navy dark:hover:text-white transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="#"
            className="hover:text-navy dark:hover:text-white transition-colors"
          >
            Security
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default AuthSimpleFooter;
