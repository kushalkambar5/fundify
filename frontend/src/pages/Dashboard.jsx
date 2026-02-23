import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../services/axiosInstance";
import {
  calculateHealthScore,
  getNetWorth,
  getGoalFeasibility,
  getPortfolioAlignment,
  getStressTest,
} from "../services/modelServices";
import DashboardNavbar from "../components/DashboardNavbar";

/* ─── Helpers ──────────────────────────────────────────────────────────── */
const fmt = (n) =>
  n == null
    ? "—"
    : Number(n).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });

const pct = (n) => (n == null ? "—" : `${Number(n).toFixed(1)}%`);

const scoreLabel = (s) =>
  s >= 80 ? "Excellent" : s >= 60 ? "Good" : s >= 40 ? "Fair" : "Needs Work";

const scoreLabelColor = (s) =>
  s >= 80
    ? "bg-emerald-100 text-emerald-700"
    : s >= 60
      ? "bg-green-100 text-green-700"
      : s >= 40
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

/* ─── Small reusable section wrapper ───────────────────────────────────── */
function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  );
}

function SectionError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
        <span className="material-symbols-outlined text-base">error</span>
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-bold text-emerald-600 hover:underline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   DASHBOARD
   ──────────────────────────────────────────────────────────────────────── */
export default function Dashboard() {
  // ── Health Score ──
  const [scoreData, setScoreData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  // ── Analytics ──
  const [netWorth, setNetWorth] = useState(null);
  const [netWorthLoading, setNetWorthLoading] = useState(false);
  const [netWorthError, setNetWorthError] = useState(null);

  const [goals, setGoals] = useState(null);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState(null);

  const [portfolio, setPortfolio] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);

  const [stress, setStress] = useState(null);
  const [stressLoading, setStressLoading] = useState(false);
  const [stressError, setStressError] = useState(null);

  /* ── Fetch existing score ── */
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
    } catch {
      setError("Failed to fetch initial score.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Calculate new score ── */
  const doCalculateScore = async () => {
    try {
      setIsCalculating(true);
      setError(null);
      const data = await calculateHealthScore();
      if (data?.financial_health_score) {
        const fhs = data.financial_health_score;
        setScoreData({
          score: fhs.score,
          breakdown: {
            savingsRate: fhs.breakdown.savings_rate,
            emergencyFund: fhs.breakdown.emergency_fund,
            debtRatio: fhs.breakdown.debt_ratio,
            diversification: fhs.breakdown.diversification,
            insuranceCoverage: fhs.breakdown.insurance_coverage,
          },
        });
      }
    } catch {
      setError("Failed to calculate score. Please complete onboarding first.");
    } finally {
      setIsCalculating(false);
    }
  };

  /* ── Analytics loaders ── */
  const fetchNetWorth = async () => {
    try {
      setNetWorthLoading(true);
      setNetWorthError(null);
      const data = await getNetWorth();
      setNetWorth(data.net_worth_analysis || data);
    } catch {
      setNetWorthError("Failed to load net worth analysis.");
    } finally {
      setNetWorthLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      setGoalsError(null);
      const data = await getGoalFeasibility();
      setGoals(data.goal_feasibility || data);
    } catch {
      setGoalsError("Failed to load goal analysis.");
    } finally {
      setGoalsLoading(false);
    }
  };

  const fetchPortfolio = async () => {
    try {
      setPortfolioLoading(true);
      setPortfolioError(null);
      const data = await getPortfolioAlignment();
      setPortfolio(data.portfolio_alignment || data);
    } catch {
      setPortfolioError("Failed to load portfolio analysis.");
    } finally {
      setPortfolioLoading(false);
    }
  };

  const fetchStress = async () => {
    try {
      setStressLoading(true);
      setStressError(null);
      const data = await getStressTest();
      setStress(data.stress_test || data);
    } catch {
      setStressError("Failed to load stress test.");
    } finally {
      setStressLoading(false);
    }
  };

  /* ── Initial load ── */
  useEffect(() => {
    fetchScore();
  }, []);

  /* ── Load analytics once score is available ── */
  useEffect(() => {
    if (scoreData) {
      fetchNetWorth();
      fetchGoals();
      fetchPortfolio();
      fetchStress();
    }
  }, [scoreData]);

  /* ── Derived ── */
  const scoreValue = scoreData?.score || 0;
  const progressStyle = { "--progress": `${scoreValue}%` };
  const bd = scoreData?.breakdown || {};

  /* ── Breakdown metric cards config ── */
  const metrics = [
    {
      label: "Savings Rate",
      value: bd.savingsRate ?? 0,
      max: 25,
      icon: "savings",
      color: "emerald",
      suffix: "/25",
    },
    {
      label: "Emergency Fund",
      value: bd.emergencyFund ?? 0,
      max: 20,
      icon: "shield",
      color: "amber",
      suffix: "/20",
    },
    {
      label: "Debt Ratio",
      value: bd.debtRatio ?? 0,
      max: 20,
      icon: "credit_score",
      color: "teal",
      suffix: "/20",
    },
    {
      label: "Diversification",
      value: bd.diversification ?? 0,
      max: 15,
      icon: "analytics",
      color: "green",
      suffix: "/15",
    },
    {
      label: "Insurance Coverage",
      value: bd.insuranceCoverage ?? 0,
      max: 20,
      icon: "health_and_safety",
      color: "cyan",
      suffix: "/20",
    },
  ];

  /* ───────────────────────────────────────────────────────────────────── */
  /* RENDER: Footer                                                       */
  /* ───────────────────────────────────────────────────────────────────── */
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
        </div>
      </div>
    </footer>
  );

  /* ───────────────────────────────────────────────────────────────────── */
  /* RENDER: Initial Load                                                  */
  /* ───────────────────────────────────────────────────────────────────── */
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

  /* ───────────────────────────────────────────────────────────────────── */
  /* RENDER: No Score — Onboarding CTA                                     */
  /* ───────────────────────────────────────────────────────────────────── */
  if (!scoreData) {
    return (
      <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/60 blur-[120px] rounded-full"></div>
        <DashboardNavbar />
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-12 md:px-10 text-center relative z-10">
          <div className="max-w-lg w-full p-10 md:p-12 border border-emerald-100 rounded-[2rem] bg-white backdrop-blur-xl shadow-xl shadow-emerald-100/50 relative overflow-hidden group">
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
                Calculate your initial financial health score to populate your
                full AI-powered dashboard.
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
                onClick={doCalculateScore}
                disabled={isCalculating}
                className="relative overflow-hidden w-full group rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-4 transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-75 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
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

  /* ───────────────────────────────────────────────────────────────────── */
  /* RENDER: Full Dynamic Dashboard                                        */
  /* ───────────────────────────────────────────────────────────────────── */
  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased">
      <DashboardNavbar />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-10">
        {/* ── Page Header ── */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Financial Health Dashboard
            </h1>
            <div className="mt-2 flex items-center justify-center md:justify-start gap-3">
              <p className="text-slate-500 text-sm">
                AI-powered fiscal analysis
              </p>
              <button
                onClick={doCalculateScore}
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
          <div className="flex gap-3">
            <Link
              to="/onboarding"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-emerald-300 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">
                post_add
              </span>
              Add more Info
            </Link>
            <Link
              to="/chatbot"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-400 text-white font-bold text-sm shadow-md shadow-emerald-200 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">
                smart_toy
              </span>
              Ask AI Advisor
            </Link>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 1: Health Score Hero                                   */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="relative flex flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-10 shadow-md">
            <div className="flex flex-col items-center md:flex-row md:gap-16">
              <div
                className="circular-progress relative flex h-52 w-52 items-center justify-center rounded-full shadow-inner"
                style={progressStyle}
              >
                <div className="flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">
                    {scoreValue}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    / 100
                  </span>
                </div>
              </div>
              <div className="mt-8 text-center md:mt-0 md:text-left">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${scoreLabelColor(scoreValue)}`}
                >
                  <span className="material-symbols-outlined text-base">
                    {scoreValue >= 60 ? "check_circle" : "info"}
                  </span>
                  {scoreLabel(scoreValue)}
                </div>
                <h3 className="mt-4 text-2xl font-bold text-slate-900">
                  Your Financial Health Score
                </h3>
                <p className="mt-3 max-w-md text-slate-500 leading-relaxed">
                  Calculated from 5 components: Savings Rate, Emergency Fund,
                  Debt Ratio, Diversification, and Insurance Coverage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 2: Score Breakdown                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5 px-1">
            Score Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="group rounded-xl border border-emerald-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-${m.color}-100 text-${m.color}-600`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {m.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      {m.label}
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {m.value}
                      <span className="text-xs text-slate-400 font-medium">
                        {m.suffix}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 3: Net Worth Analysis                                  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 text-lg">
                account_balance
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Net Worth Analysis
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            {netWorthLoading ? (
              <SectionLoader />
            ) : netWorthError ? (
              <SectionError message={netWorthError} onRetry={fetchNetWorth} />
            ) : netWorth ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-emerald-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Net Worth
                  </p>
                  <p className="text-2xl font-black text-emerald-700">
                    {fmt(netWorth.net_worth)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-blue-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Total Assets
                  </p>
                  <p className="text-2xl font-black text-blue-700">
                    {fmt(netWorth.total_assets)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-red-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Total Liabilities
                  </p>
                  <p className="text-2xl font-black text-red-600">
                    {fmt(netWorth.total_liabilities)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-xl bg-amber-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Liquidity Ratio
                  </p>
                  <p className="text-2xl font-black text-amber-700">
                    {pct(netWorth.liquidity_ratio)}
                  </p>
                </div>
                {netWorth.asset_allocation &&
                  Object.keys(netWorth.asset_allocation).length > 0 && (
                    <div className="col-span-full">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                        Asset Allocation
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(netWorth.asset_allocation).map(
                          ([type, val]) => (
                            <span
                              key={type}
                              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                            >
                              {type.replace(/_/g, " ")}:{" "}
                              <span className="text-emerald-600">
                                {pct(val)}
                              </span>
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                No data available
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 4: Goal Feasibility                                    */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-600 text-lg">
                flag
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Goal Feasibility
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            {goalsLoading ? (
              <SectionLoader />
            ) : goalsError ? (
              <SectionError message={goalsError} onRetry={fetchGoals} />
            ) : goals && Array.isArray(goals) && goals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((g, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-900 capitalize">
                        {(g.goal_type || "Goal").replace(/_/g, " ")}
                      </h4>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          g.feasible
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {g.feasible ? "Feasible" : "At Risk"}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-500">
                      {g.target_amount != null && (
                        <p>
                          Target:{" "}
                          <span className="text-slate-800 font-semibold">
                            {fmt(g.target_amount)}
                          </span>
                        </p>
                      )}
                      {g.required_monthly_sip != null && (
                        <p>
                          Required SIP:{" "}
                          <span className="text-slate-800 font-semibold">
                            {fmt(g.required_monthly_sip)}/mo
                          </span>
                        </p>
                      )}
                      {g.funding_gap != null && (
                        <p>
                          Funding Gap:{" "}
                          <span
                            className={`font-semibold ${g.funding_gap > 0 ? "text-red-600" : "text-emerald-600"}`}
                          >
                            {fmt(g.funding_gap)}
                          </span>
                        </p>
                      )}
                      {g.risk_level && (
                        <p>
                          Risk:{" "}
                          <span className="text-slate-800 font-semibold capitalize">
                            {g.risk_level}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                No financial goals yet. Add goals in your profile to see
                feasibility analysis.
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 5: Portfolio Alignment                                 */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-lg">
                pie_chart
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Portfolio Alignment
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            {portfolioLoading ? (
              <SectionLoader />
            ) : portfolioError ? (
              <SectionError message={portfolioError} onRetry={fetchPortfolio} />
            ) : portfolio ? (
              <div>
                {portfolio.risk_profile && (
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Risk Profile:
                    </span>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold capitalize">
                      {portfolio.risk_profile}
                    </span>
                    {portfolio.alignment_status && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          portfolio.alignment_status === "aligned"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {portfolio.alignment_status === "aligned"
                          ? "✓ Aligned"
                          : "⚠ Misaligned"}
                      </span>
                    )}
                  </div>
                )}
                {portfolio.actual_allocation && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                      Actual Allocation
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(portfolio.actual_allocation).map(
                        ([type, val]) => (
                          <span
                            key={type}
                            className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                          >
                            {type.replace(/_/g, " ")}:{" "}
                            <span className="text-indigo-600">{pct(val)}</span>
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
                {portfolio.recommendations &&
                  portfolio.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                        Recommendations
                      </p>
                      <ul className="space-y-2">
                        {portfolio.recommendations.map((rec, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-600"
                          >
                            <span className="material-symbols-outlined text-indigo-400 text-sm mt-0.5">
                              lightbulb
                            </span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                No portfolio data available
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/*  SECTION 6: Stress Test Simulation                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5 px-1">
            <div className="h-9 w-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600 text-lg">
                warning
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Stress Test Simulation
            </h2>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            {stressLoading ? (
              <SectionLoader />
            ) : stressError ? (
              <SectionError message={stressError} onRetry={fetchStress} />
            ) : stress && typeof stress === "object" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stress).map(([scenario, details]) => {
                  const icons = {
                    recession: "trending_down",
                    job_loss: "work_off",
                    rate_hike: "trending_up",
                  };
                  const colors = {
                    recession: "red",
                    job_loss: "orange",
                    rate_hike: "amber",
                  };
                  const c = colors[scenario] || "slate";
                  return (
                    <div
                      key={scenario}
                      className={`p-5 rounded-xl border border-${c}-100 bg-${c}-50/30`}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`material-symbols-outlined text-${c}-600`}
                        >
                          {icons[scenario] || "science"}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 capitalize">
                          {scenario.replace(/_/g, " ")}
                        </h4>
                      </div>
                      {typeof details === "object" &&
                      details !== null &&
                      !Array.isArray(details) ? (
                        <div className="space-y-2 text-xs text-slate-600">
                          {Object.entries(details).map(([key, val]) => (
                            <div
                              key={key}
                              className="flex justify-between items-center"
                            >
                              <span className="text-slate-500 capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="font-bold text-slate-800">
                                {typeof val === "number"
                                  ? val > 1000
                                    ? fmt(val)
                                    : pct(val)
                                  : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500">
                          {JSON.stringify(details)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                No stress test data available
              </p>
            )}
          </div>
        </div>

        {/* ── CTA: Ask AI ── */}
        <div className="mb-6">
          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-8 shadow-sm text-center">
            <span className="material-symbols-outlined text-4xl text-emerald-500 mb-3">
              smart_toy
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Have Questions About Your Finances?
            </h3>
            <p className="text-slate-500 text-sm mb-5 max-w-md mx-auto">
              Our AI advisor has access to your complete financial profile and
              can provide personalized insights and recommendations.
            </p>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-200 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Start a Conversation
            </Link>
          </div>
        </div>
      </main>

      {renderFooter()}
    </div>
  );
}
