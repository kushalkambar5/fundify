import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axiosInstance";
import DashboardNavbar from "../components/DashboardNavbar";

export default function Dashboard() {
  const [scoreData, setScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  const fetchScore = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get("/user/financial-health-score");
      if (res.data.success && res.data.score) {
        setScoreData(res.data.score);
      } else {
        setScoreData(null);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch initial score.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateScore = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      const res = await axios.post("/score/financial-health");
      if (res.data) {
        setScoreData({
          score: res.data.score,
          breakdown: {
            savingsRate:
              res.data.breakdown?.savings_rate ||
              res.data.breakdown?.savingsRate ||
              0,
            emergencyFund:
              res.data.breakdown?.emergency_fund ||
              res.data.breakdown?.emergencyFund ||
              0,
            debtRatio:
              res.data.breakdown?.debt_ratio ||
              res.data.breakdown?.debtRatio ||
              0,
            diversification: res.data.breakdown?.diversification || 0,
            insuranceCoverage:
              res.data.breakdown?.insurance_coverage ||
              res.data.breakdown?.insuranceCoverage ||
              0,
          },
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        "Failed to calculate financial health score. Please ensure you have completed all onboarding steps.",
      );
    } finally {
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    fetchScore();
  }, []);

  const scoreValue = scoreData?.score || 0;
  const progressStyle = { "--progress": `${scoreValue}%` };

  const renderFooter = () => (
    <footer className="mt-12 border-t border-emerald-100 bg-emerald-50 px-10 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 text-emerald-600">
            <span className="material-symbols-outlined text-sm">
              account_balance_wallet
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © 2026 Fundify AI. Member FDIC.
          </p>
        </div>
        <div className="flex gap-8">
          <Link
            to="/privacy-policy"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Terms & Conditions
          </Link>
          <a
            href="#"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Security
          </a>
          <a
            href="#"
            className="text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900">
        <DashboardNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </main>
        {renderFooter()}
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/60 blur-[120px] rounded-full"></div>

        <DashboardNavbar />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 md:px-10 text-center relative z-10">
          <div className="max-w-lg w-full p-10 md:p-12 border border-emerald-100 rounded-[2rem] bg-white backdrop-blur-xl shadow-xl shadow-emerald-100/50 relative overflow-hidden group">
            {/* Inner subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 to-transparent pointer-events-none rounded-[2rem]"></div>

            <div className="relative">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-100 to-green-50 shadow-inner">
                <span className="material-symbols-outlined text-[40px] text-emerald-600">
                  analytics
                </span>
              </div>

              <h2 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-700">
                Unlock Your Financial Insights
              </h2>

              <p className="text-slate-500 mb-10 text-lg leading-relaxed max-w-sm mx-auto">
                We need to calculate your initial financial health score to
                populate your dashboard. This generates a tailored AI profile.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100">
                  <p className="text-red-600 text-sm font-semibold flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-base">
                      error
                    </span>
                    {error}
                  </p>
                </div>
              )}

              <button
                onClick={calculateScore}
                disabled={isCalculating}
                className="relative overflow-hidden w-full group rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-gradient"></div>
                <div className="relative flex items-center justify-center gap-3">
                  {isCalculating ? (
                    <>
                      <span className="animate-spin material-symbols-outlined text-[20px]">
                        refresh
                      </span>
                      <span>Analyzing Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Calculate Financial Health Score</span>
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </main>
        {renderFooter()}
      </div>
    );
  }

  // Once scoreData is present, map breakdown appropriately
  const bd = scoreData.breakdown || {};
  const sr = bd.savingsRate || 22;
  const ef = bd.emergencyFund || 5;
  const dr = bd.debtRatio || 15;
  const div = bd.diversification || 90;

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased">
      <DashboardNavbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 md:px-10">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Financial Health Dashboard
            </h1>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
              <p className="text-slate-500 text-sm">
                AI-powered fiscal analysis updated just now
              </p>
              <button
                onClick={calculateScore}
                disabled={isCalculating}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors text-xs font-semibold disabled:opacity-50"
              >
                <span
                  className={`material-symbols-outlined text-sm ${isCalculating ? "animate-spin" : ""}`}
                >
                  refresh
                </span>
                Recalculate
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          </div>
        </div>

        <div className="mb-12">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-10 shadow-md">
            <div className="absolute left-10 top-10 hidden md:block">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Main Analysis
              </span>
            </div>
            <div className="absolute right-10 top-10 hidden md:block">
              <button
                onClick={calculateScore}
                disabled={isCalculating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all text-xs font-bold uppercase tracking-wide"
              >
                <span
                  className={`material-symbols-outlined text-sm ${isCalculating ? "animate-spin" : ""}`}
                >
                  sync
                </span>
                Update Score
              </button>
            </div>

            <div className="flex flex-col items-center md:flex-row md:gap-16">
              <div
                className="circular-progress relative flex h-56 w-56 items-center justify-center rounded-full shadow-inner"
                style={progressStyle}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-7xl font-black text-slate-900 tracking-tighter">
                    {scoreValue}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Score
                  </span>
                </div>
              </div>
              <div className="mt-10 text-center md:mt-0 md:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-bold text-emerald-700">
                  <span className="material-symbols-outlined text-base">
                    check_circle
                  </span>
                  Good Standing
                </div>
                <h3 className="mt-4 text-3xl font-bold text-slate-900">
                  Your Financial Health
                </h3>
                <p className="mt-3 max-w-md text-slate-500 leading-relaxed text-lg">
                  You're in the{" "}
                  <span className="font-semibold text-slate-900">top 15%</span>{" "}
                  of peers. Your score is based on a holistic AI review of your
                  profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-bold text-slate-900">
              Metric Breakdown
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Savings Rate */}
            <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Savings Rate
                    </p>
                    <p className="text-xl font-bold text-slate-900">{sr}%</p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(sr, 100)}%` }}
                ></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Target: 20%
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Suggestions{" "}
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Emergency Fund */}
            <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <span className="material-symbols-outlined">shield</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Emergency Fund
                    </p>
                    <p className="text-xl font-bold text-slate-900">{ef} mo.</p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-amber-100">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min((ef / 6) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Target 6 mo.
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Suggestions{" "}
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Debt Ratio */}
            <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                    <span className="material-symbols-outlined">
                      credit_score
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Debt Ratio
                    </p>
                    <p className="text-xl font-bold text-slate-900">{dr}%</p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-teal-100">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(dr, 100)}%` }}
                ></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Healthy range
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Suggestions{" "}
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Diversification */}
            <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Diversification
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {div > 70 ? "High" : div > 40 ? "Medium" : "Low"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-green-100">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(div, 100)}%` }}
                ></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Quality Index
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Suggestions{" "}
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Net Cash Flow */}
            <div className="group rounded-xl border border-emerald-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                      Net Cash Flow
                    </p>
                    <p className="text-xl font-bold text-slate-900">Positive</p>
                  </div>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <div className="mt-5 flex justify-between items-center">
                <span className="text-xs font-medium text-slate-400">
                  Stable income
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                >
                  Suggestions{" "}
                  <span className="material-symbols-outlined text-xs">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <span className="material-symbols-outlined text-2xl">
                  psychology
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Improve Your Score: AI Recommendations
              </h3>
            </div>
            <ul className="space-y-6">
              <li className="flex items-start gap-5 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="material-symbols-outlined text-lg">
                    bolt
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Consolidate high-interest debt
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Merging your 18% APR credit cards into a single 9% personal
                    loan could boost your score by{" "}
                    <span className="text-emerald-600 font-semibold">
                      +4 points
                    </span>
                    .
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-5 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="material-symbols-outlined text-lg">
                    trending_up
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Increase 401(k) contribution by 1%
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    You are currently below the employer match threshold.
                    Optimizing this will improve your long-term savings score
                    significantly.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-5 p-4 rounded-xl hover:bg-emerald-50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <span className="material-symbols-outlined text-lg">
                    calendar_month
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Review monthly subscriptions
                  </p>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Our AI identified $42/mo in recurring charges that haven't
                    been utilized in 90 days. Canceling these will boost net
                    cash flow.
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-8 pt-8 border-t border-emerald-100">
              <button
                onClick={calculateScore}
                disabled={isCalculating}
                className="w-full rounded-xl flex items-center justify-center gap-2 bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-600 transition-all disabled:opacity-75 disabled:cursor-not-allowed shadow-md shadow-emerald-100"
              >
                {isCalculating ? (
                  <>
                    <span className="animate-spin material-symbols-outlined text-sm">
                      progress_activity
                    </span>
                    Refreshing Analysis...
                  </>
                ) : (
                  "Refresh Analysis"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {renderFooter()}
    </div>
  );
}
