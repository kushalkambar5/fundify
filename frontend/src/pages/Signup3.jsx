import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthOnboardingHeader from "../components/auth/AuthOnboardingHeader";
import SectionCard from "../components/signup/SectionCard";
import {
  updateUserProfile,
  addIncome,
  addExpense,
  addAsset,
  addLiability,
  addInsurance,
  addFinancialGoal,
  checkOnboardingStatus,
} from "../services/userServices";
import { registerUser } from "../services/authServices";
import { useAuth } from "../context/AuthContext";

function Signup3({ emailId, password }) {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();

  // --- REFS FOR SCROLLING --------
  const refs = {
    general: useRef(null),
    income: useRef(null),
    expenses: useRef(null),
    assets: useRef(null),
    liabilities: useRef(null),
    insurance: useRef(null),
    goals: useRef(null),
  };

  const scrollToSection = (refName) => {
    // Add an offset for the sticky header
    const element = refs[refName].current;
    if (element) {
      const headerOffset = 100; // Header height + some padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };
  // --- GENERAL INFO STATE --------
  const [generalInfo, setGeneralInfo] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "Male",
    maritalStatus: "Married",
    dependents: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    employmentType: "Full-time Professional",
    annualIncome: "",
    riskProfile: "Moderate",
  });

  // Prefill if the user is already logged in and context contains user data
  useEffect(() => {
    if (user) {
      setGeneralInfo((prev) => ({
        ...prev,
        ...user,
      }));
    }
  }, [user]);

  const [loadingGen, setLoadingGen] = useState(false);
  const [savedGen, setSavedGen] = useState(false);
  const [errorGen, setErrorGen] = useState("");

  const handleGenInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
  };

  const setRiskProfile = (profile) => {
    setGeneralInfo((prev) => ({ ...prev, riskProfile: profile }));
  };

  const handleSaveGeneralInfo = async () => {
    // Basic validation
    if (!generalInfo.name || !generalInfo.age || !generalInfo.annualIncome) {
      setErrorGen(
        "Please fill out required fields (Name, Age, Annual Income).",
      );
      return;
    }
    setErrorGen("");
    setLoadingGen(true);
    try {
      if (user) {
        // Already authenticated user filling missing general info
        await updateUserProfile(generalInfo);
      } else {
        // Initial registration flow
        const userData = {
          ...generalInfo,
          email: emailId,
          password: password,
        };
        await registerUser(userData);
      }
      setSavedGen(true);
    } catch (err) {
      setErrorGen(
        err.response?.data?.message || "Failed to save General Information.",
      );
    } finally {
      setLoadingGen(false);
    }
  };

  // --- INCOMES STATE --------
  const [incomes, setIncomes] = useState([
    { sourceType: "salary", amount: "" },
  ]);
  const [loadingInc, setLoadingInc] = useState(false);
  const [savedInc, setSavedInc] = useState(false);
  const [errorInc, setErrorInc] = useState("");

  const handleAppIncomeChange = (index, field, value) => {
    const newIncomes = [...incomes];
    newIncomes[index][field] = value;
    setIncomes(newIncomes);
  };

  const addIncomeRow = () => {
    setIncomes([...incomes, { sourceType: "investment", amount: "" }]);
  };

  const handleSaveIncome = async () => {
    setErrorInc("");
    setLoadingInc(true);
    try {
      // Create valid incomes only
      const validIncomes = incomes.filter((inc) => inc.amount);
      await Promise.all(
        validIncomes.map((inc) =>
          addIncome({
            sourceType: inc.sourceType,
            monthlyAmount: Number(inc.amount),
            growthRate: 0,
          }),
        ),
      );
      setSavedInc(true);
    } catch (err) {
      setErrorInc("Failed to save Income Details.");
    } finally {
      setLoadingInc(false);
    }
  };

  // --- EXPENSES STATE --------
  const [expenses, setExpenses] = useState([
    { category: "housing", amount: "" },
    { category: "food", amount: "" },
  ]);
  const [loadingExp, setLoadingExp] = useState(false);
  const [savedExp, setSavedExp] = useState(false);
  const [errorExp, setErrorExp] = useState("");

  const handleExpenseChange = (index, field, value) => {
    const newExp = [...expenses];
    newExp[index][field] = value;
    setExpenses(newExp);
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { category: "other", amount: "" }]);
  };

  const handleSaveExpense = async () => {
    setErrorExp("");
    setLoadingExp(true);
    try {
      const valid = expenses.filter((exp) => exp.amount);
      await Promise.all(
        valid.map((exp) =>
          addExpense({
            category: exp.category,
            monthlyAmount: Number(exp.amount),
            type: "variable",
          }),
        ),
      );
      setSavedExp(true);
    } catch (err) {
      setErrorExp("Failed to save Expenses.");
    } finally {
      setLoadingExp(false);
    }
  };

  // --- ASSETS STATE --------
  const [assets, setAssets] = useState([
    { type: "Brokerage", name: "", amount: "" },
  ]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [savedAsset, setSavedAsset] = useState(false);
  const [errorAsset, setErrorAsset] = useState("");

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
  };

  const addAssetRow = () => {
    setAssets([...assets, { type: "Real Estate", name: "", amount: "" }]);
  };

  const handleSaveAssets = async () => {
    setErrorAsset("");
    setLoadingAsset(true);
    try {
      const valid = assets.filter((a) => a.amount && a.name);
      await Promise.all(valid.map((a) => addAsset(a)));
      setSavedAsset(true);
    } catch (err) {
      setErrorAsset("Failed to save Assets.");
    } finally {
      setLoadingAsset(false);
    }
  };

  // --- LIABILITIES STATE --------
  const [liabilities, setLiabilities] = useState([
    { type: "Student Loans", amount: "" },
  ]);
  const [loadingLiab, setLoadingLiab] = useState(false);
  const [savedLiab, setSavedLiab] = useState(false);
  const [errorLiab, setErrorLiab] = useState("");

  const handleLiabilityChange = (index, field, value) => {
    const newLiab = [...liabilities];
    newLiab[index][field] = value;
    setLiabilities(newLiab);
  };

  const addLiabilityRow = () => {
    setLiabilities([...liabilities, { type: "Credit Card", amount: "" }]);
  };

  const handleSaveLiabilities = async () => {
    setErrorLiab("");
    setLoadingLiab(true);
    try {
      const valid = liabilities.filter((l) => l.amount);
      await Promise.all(valid.map((l) => addLiability(l)));
      setSavedLiab(true);
    } catch (err) {
      setErrorLiab("Failed to save Liabilities.");
    } finally {
      setLoadingLiab(false);
    }
  };

  // --- INSURANCE STATE --------
  const [insurances, setInsurances] = useState([
    { type: "Health", provider: "", coverage: "" },
  ]);
  const [loadingIns, setLoadingIns] = useState(false);
  const [savedIns, setSavedIns] = useState(false);
  const [errorIns, setErrorIns] = useState("");

  const handleInsuranceChange = (index, field, value) => {
    const newIns = [...insurances];
    newIns[index][field] = value;
    setInsurances(newIns);
  };

  const addInsuranceRow = () => {
    setInsurances([
      ...insurances,
      { type: "Life", provider: "", coverage: "" },
    ]);
  };

  const handleSaveInsurance = async () => {
    setErrorIns("");
    setLoadingIns(true);
    try {
      const valid = insurances.filter((i) => i.provider);
      await Promise.all(valid.map((i) => addInsurance(i)));
      setSavedIns(true);
    } catch (err) {
      setErrorIns("Failed to save Insurance.");
    } finally {
      setLoadingIns(false);
    }
  };

  // --- GOALS STATE --------
  const [goals, setGoals] = useState([
    { name: "Retirement", targetAmount: "", targetYear: "" },
  ]);
  const [loadingGoal, setLoadingGoal] = useState(false);
  const [savedGoal, setSavedGoal] = useState(false);
  const [errorGoal, setErrorGoal] = useState("");

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
  };

  const addGoalRow = () => {
    setGoals([
      ...goals,
      { name: "Home Purchase", targetAmount: "", targetYear: "" },
    ]);
  };

  const handleSaveGoals = async () => {
    setErrorGoal("");
    setLoadingGoal(true);
    try {
      const valid = goals.filter((g) => g.name && g.targetAmount);
      await Promise.all(valid.map((g) => addFinancialGoal(g)));
      setSavedGoal(true);
    } catch (err) {
      setErrorGoal("Failed to save Goals.");
    } finally {
      setLoadingGoal(false);
    }
  };

  const [isDbAllSaved, setIsDbAllSaved] = useState(false);

  useEffect(() => {
    if (!emailId || isDbAllSaved) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await checkOnboardingStatus(emailId);
        if (res.allSaved && isMounted) {
          setIsDbAllSaved(true);
        }
      } catch (err) {
        // silently ignore error on polling
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [emailId, isDbAllSaved]);

  const allSaved = isDbAllSaved;
  return (
    <div className="font-display bg-[#F8FAFC] min-h-screen flex flex-col antialiased text-slate-800">
      <AuthOnboardingHeader />

      <div className="flex-1 max-w-[1440px] mx-auto w-full flex relative">
        {/* Left Sidebar Menu */}
        <aside
          className="hidden lg:block w-[260px] border-r border-slate-200 bg-[#F8FAFC] flex-shrink-0 sticky top-16"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="p-6">
            <div className="mb-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Onboarding Progress
              </p>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  Step 3 of 3
                </span>
                <span className="text-xs font-bold text-blue-600">100%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-full rounded-full"></div>
              </div>
            </div>

            <nav
              className="space-y-1.5 overflow-y-auto"
              style={{ maxHeight: "50vh" }}
            >
              <div
                onClick={() => scrollToSection("general")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  person
                </span>
                <span className="text-sm font-semibold">
                  General Information
                </span>
              </div>
              <div
                onClick={() => scrollToSection("income")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  payments
                </span>
                <span className="text-sm font-medium">Income Details</span>
              </div>
              <div
                onClick={() => scrollToSection("expenses")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  receipt_long
                </span>
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <div
                onClick={() => scrollToSection("assets")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_balance
                </span>
                <span className="text-sm font-medium">
                  Assets & Investments
                </span>
              </div>
              <div
                onClick={() => scrollToSection("liabilities")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  credit_card
                </span>
                <span className="text-sm font-medium">Liabilities</span>
              </div>
              <div
                onClick={() => scrollToSection("insurance")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  health_and_safety
                </span>
                <span className="text-sm font-medium">Insurance</span>
              </div>
              <div
                onClick={() => scrollToSection("goals")}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  flag
                </span>
                <span className="text-sm font-medium">Financial Goals</span>
              </div>
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-4">
              <div className="flex items-center gap-1.5 text-blue-700 mb-1.5">
                <span className="material-symbols-outlined text-[14px]">
                  shield
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Bank-Grade Security
                </span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Your financial data is encrypted with 256-bit AES, and never
                shared with third parties.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-8 lg:px-16 py-8 pb-32 max-w-[800px] mx-auto w-full">
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#1A202C] mb-3 tracking-tight">
              Complete Your Financial Profile
            </h1>
            <p className="text-slate-500 leading-relaxed">
              This data powers our proprietary AI financial health engine. The
              more accurate your data, the better our recommendations for your
              net worth growth.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => {
                  if (user) completeOnboarding();
                  navigate("/dashboard");
                }}
                disabled={!allSaved}
                className={`font-bold py-2.5 px-6 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  allSaved
                    ? "bg-blue-700 hover:bg-blue-800 text-white shadow-blue-700/20"
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                Finish Onboarding
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Card 1: General Information */}
            <div ref={refs.general}>
              <SectionCard
                icon="person"
                title="General Information"
                subtitle="Tell us about yourself to personalize your financial insights."
                saved={savedGen}
                loading={loadingGen}
                error={errorGen}
                onSave={handleSaveGeneralInfo}
              >
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <span className="material-symbols-outlined text-[16px]">
                      badge
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Personal Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Full Name *
                      </label>
                      <input
                        name="name"
                        value={generalInfo.name}
                        onChange={handleGenInfoChange}
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={generalInfo.phone}
                        onChange={handleGenInfoChange}
                        type="text"
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          Age *
                        </label>
                        <input
                          name="age"
                          value={generalInfo.age}
                          onChange={handleGenInfoChange}
                          type="number"
                          placeholder="30"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                        />
                      </div>
                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={generalInfo.gender}
                          onChange={handleGenInfoChange}
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[34px] text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 relative">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          Marital Status
                        </label>
                        <select
                          name="maritalStatus"
                          value={generalInfo.maritalStatus}
                          onChange={handleGenInfoChange}
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="Married">Married</option>
                          <option value="Single">Single</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[34px] text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          Dependents
                        </label>
                        <input
                          name="dependents"
                          value={generalInfo.dependents}
                          onChange={handleGenInfoChange}
                          type="number"
                          placeholder="0"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <span className="material-symbols-outlined text-[16px]">
                      location_on
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Address Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                    <div className="space-y-1.5 md:col-span-1">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Address
                      </label>
                      <input
                        name="address"
                        value={generalInfo.address}
                        onChange={handleGenInfoChange}
                        type="text"
                        placeholder="123 Street"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        City
                      </label>
                      <input
                        name="city"
                        value={generalInfo.city}
                        onChange={handleGenInfoChange}
                        type="text"
                        placeholder="City"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          State
                        </label>
                        <input
                          name="state"
                          value={generalInfo.state}
                          onChange={handleGenInfoChange}
                          type="text"
                          placeholder="State"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-600 px-1">
                          ZIP
                        </label>
                        <input
                          name="zip"
                          value={generalInfo.zip}
                          onChange={handleGenInfoChange}
                          type="text"
                          placeholder="00000"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Country
                      </label>
                      <input
                        name="country"
                        value={generalInfo.country}
                        readOnly
                        type="text"
                        className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional */}
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 text-slate-400 mb-4">
                    <span className="material-symbols-outlined text-[16px]">
                      work
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      Professional Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-6">
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Employment Type
                      </label>
                      <select
                        name="employmentType"
                        value={generalInfo.employmentType}
                        onChange={handleGenInfoChange}
                        className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                      >
                        <option value="Full-time Professional">
                          Full-time Professional
                        </option>
                        <option value="Part-time">Part-time</option>
                        <option value="Self-employed">Self-employed</option>
                        <option value="Unemployed">Unemployed</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-[34px] text-slate-400 pointer-events-none">
                        expand_more
                      </span>
                    </div>
                    <div className="space-y-1.5 relative">
                      <label className="text-xs font-medium text-slate-600 px-1">
                        Annual Income *
                      </label>
                      <span className="absolute left-4 top-[34px] text-slate-400 text-sm font-medium pointer-events-none">
                        ₹
                      </span>
                      <input
                        name="annualIncome"
                        value={generalInfo.annualIncome}
                        onChange={handleGenInfoChange}
                        type="number"
                        placeholder="100000"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-medium text-slate-600 px-1 flex items-center gap-1">
                      Investment Risk Profile
                      <span
                        className="material-symbols-outlined text-[14px] text-slate-400 cursor-help"
                        title="Determines portfolio aggression level"
                      >
                        help
                      </span>
                    </label>
                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setRiskProfile("Conservative")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "Conservative" ? "font-bold bg-white shadow-sm border border-slate-100 text-blue-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
                      >
                        Conservative
                      </button>
                      <button
                        type="button"
                        onClick={() => setRiskProfile("Moderate")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "Moderate" ? "font-bold bg-white shadow-sm border border-slate-100 text-blue-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
                      >
                        Moderate
                      </button>
                      <button
                        type="button"
                        onClick={() => setRiskProfile("Aggressive")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "Aggressive" ? "font-bold bg-white shadow-sm border border-slate-100 text-blue-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
                      >
                        Aggressive
                      </button>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Card 2: Income Details */}
            <div ref={refs.income}>
              <SectionCard
                icon="payments"
                title="Income Details"
                saved={savedInc}
                loading={loadingInc}
                error={errorInc}
                onSave={handleSaveIncome}
              >
                <div className="space-y-4">
                  {incomes.map((inc, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative w-1/3">
                        <select
                          value={inc.sourceType}
                          onChange={(e) =>
                            handleAppIncomeChange(
                              index,
                              "sourceType",
                              e.target.value,
                            )
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="salary">Salary</option>
                          <option value="freelance">Freelance</option>
                          <option value="investment">Investment</option>
                          <option value="rental">Rental</option>
                          <option value="business">Business</option>
                          <option value="other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={inc.amount}
                          onChange={(e) =>
                            handleAppIncomeChange(
                              index,
                              "amount",
                              e.target.value,
                            )
                          }
                          placeholder="Amount per year/month"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIncomeRow}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Income Source
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Card 3: Monthly Expenses */}
            <div ref={refs.expenses}>
              <SectionCard
                icon="receipt_long"
                title="Monthly Expenses"
                iconBg="bg-red-50"
                iconColor="text-red-500"
                saved={savedExp}
                loading={loadingExp}
                error={errorExp}
                onSave={handleSaveExpense}
              >
                <div className="space-y-4">
                  {expenses.map((exp, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative w-1/3">
                        <select
                          value={exp.category}
                          onChange={(e) =>
                            handleExpenseChange(
                              index,
                              "category",
                              e.target.value,
                            )
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="housing">Housing</option>
                          <option value="transportation">Transportation</option>
                          <option value="food">Food</option>
                          <option value="utilities">Utilities</option>
                          <option value="insurance">Insurance</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="debt">Debt</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="rent">Rent</option>
                          <option value="emi">EMI</option>
                          <option value="other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={exp.amount}
                          onChange={(e) =>
                            handleExpenseChange(index, "amount", e.target.value)
                          }
                          placeholder="Monthly cost"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExpenseRow}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Expense Category
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Card 4: Assets & Investments */}
            <div ref={refs.assets}>
              <SectionCard
                icon="account_balance"
                title="Assets & Investments"
                saved={savedAsset}
                loading={loadingAsset}
                error={errorAsset}
                onSave={handleSaveAssets}
              >
                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="relative w-1/3">
                        <select
                          value={asset.type}
                          onChange={(e) =>
                            handleAssetChange(index, "type", e.target.value)
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="Brokerage">Brokerage</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Crypto">Crypto</option>
                          <option value="Cash">Cash</option>
                          <option value="Other">Other</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={asset.name}
                          onChange={(e) =>
                            handleAssetChange(index, "name", e.target.value)
                          }
                          placeholder="Account/Asset Name"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative w-1/3">
                        <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={asset.amount}
                          onChange={(e) =>
                            handleAssetChange(index, "amount", e.target.value)
                          }
                          placeholder="Value"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAssetRow}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add_circle
                    </span>{" "}
                    Add Asset manually
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Card 5: Liabilities */}
            <div ref={refs.liabilities}>
              <SectionCard
                icon="credit_card"
                title="Liabilities"
                iconBg="bg-orange-50"
                iconColor="text-orange-500"
                saved={savedLiab}
                loading={loadingLiab}
                error={errorLiab}
                onSave={handleSaveLiabilities}
              >
                <div className="space-y-4">
                  {liabilities.map((liab, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative w-1/2">
                        <select
                          value={liab.type}
                          onChange={(e) =>
                            handleLiabilityChange(index, "type", e.target.value)
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="Student Loans">Student Loans</option>
                          <option value="Credit Card">Credit Card</option>
                          <option value="Mortgage">Mortgage</option>
                          <option value="Personal Loan">Personal Loan</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>
                      <div className="relative w-1/2">
                        <span className="absolute left-4 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={liab.amount}
                          onChange={(e) =>
                            handleLiabilityChange(
                              index,
                              "amount",
                              e.target.value,
                            )
                          }
                          placeholder="Total Dept"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLiabilityRow}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Liability Group
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Card 6: Insurance */}
            <div ref={refs.insurance}>
              <SectionCard
                icon="health_and_safety"
                title="Insurance Policies"
                iconBg="bg-teal-50"
                iconColor="text-teal-600"
                saved={savedIns}
                loading={loadingIns}
                error={errorIns}
                onSave={handleSaveInsurance}
              >
                <div className="space-y-4">
                  {insurances.map((ins, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="relative w-1/3">
                        <select
                          value={ins.type}
                          onChange={(e) =>
                            handleInsuranceChange(index, "type", e.target.value)
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="Health">Health</option>
                          <option value="Life">Life</option>
                          <option value="Home">Home</option>
                          <option value="Auto">Auto</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={ins.provider}
                          onChange={(e) =>
                            handleInsuranceChange(
                              index,
                              "provider",
                              e.target.value,
                            )
                          }
                          placeholder="Provider Name"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative w-1/4">
                        <input
                          type="number"
                          value={ins.coverage}
                          onChange={(e) =>
                            handleInsuranceChange(
                              index,
                              "coverage",
                              e.target.value,
                            )
                          }
                          placeholder="Coverage"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInsuranceRow}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Policy
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Card 7: Financial Goals */}
            <div ref={refs.goals}>
              <SectionCard
                icon="flag"
                title="Financial Goals"
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                saved={savedGoal}
                loading={loadingGoal}
                error={errorGoal}
                onSave={handleSaveGoals}
              >
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={goal.name}
                          onChange={(e) =>
                            handleGoalChange(index, "name", e.target.value)
                          }
                          placeholder="Goal Name (e.g., House Downpayment)"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative w-1/3">
                        <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={goal.targetAmount}
                          onChange={(e) =>
                            handleGoalChange(
                              index,
                              "targetAmount",
                              e.target.value,
                            )
                          }
                          placeholder="Target"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative w-1/4">
                        <input
                          type="number"
                          value={goal.targetYear}
                          onChange={(e) =>
                            handleGoalChange(
                              index,
                              "targetYear",
                              e.target.value,
                            )
                          }
                          placeholder="Year"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGoalRow}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Goal
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup3;
