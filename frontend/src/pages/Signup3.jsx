import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthOnboardingHeader from "../components/auth/AuthOnboardingHeader";
import SectionCard from "../components/signup/SectionCard";
import {
  updateUserProfile,
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  addAsset,
  getAssets,
  deleteAsset,
  updateAsset,
  addLiability,
  getLiabilities,
  deleteLiability,
  updateLiability,
  addInsurance,
  getInsurances,
  deleteInsurance,
  updateInsurance,
  addFinancialGoal,
  getFinancialGoals,
  deleteFinancialGoal,
  updateFinancialGoal,
  checkOnboardingStatus,
  markOnboardingStep,
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
    riskProfile: "moderate",
  });

  // Fetch all existing data if logged in
  useEffect(() => {
    let isMounted = true;
    const loadUserData = async () => {
      if (!user) return;
      try {
        setGeneralInfo((prev) => ({ ...prev, ...user }));
        setSavedGen(true);

        // Parallel fetch for speed
        const [incRes, expRes, astRes, libRes, insRes, glsRes] =
          await Promise.all([
            getIncomes(),
            getExpenses(),
            getAssets(),
            getLiabilities(),
            getInsurances(),
            getFinancialGoals(),
          ]);

        if (!isMounted) return;

        if (incRes.incomes && incRes.incomes.length > 0) {
          setIncomes(
            incRes.incomes.map((i) => ({
              _id: i._id,
              sourceType: i.sourceType,
              amount: i.monthlyAmount,
              growthRate: i.growthRate,
            })),
          );
          setSavedInc(true);
        }
        if (expRes.expenses && expRes.expenses.length > 0) {
          setExpenses(
            expRes.expenses.map((e) => ({
              _id: e._id,
              category: e.category,
              amount: e.monthlyAmount,
              type: e.type,
            })),
          );
          setSavedExp(true);
        }
        if (astRes.assets && astRes.assets.length > 0) {
          setAssets(
            astRes.assets.map((a) => ({
              _id: a._id,
              type: a.type,
              name: a.name,
              amount: a.currentValue,
              investedAmount: a.investedAmount,
              expectedReturnRate: a.expectedReturnRate,
              liquidityLevel: a.liquidityLevel,
            })),
          );
          setSavedAsset(true);
        }
        if (libRes.liabilities && libRes.liabilities.length > 0) {
          setLiabilities(
            libRes.liabilities.map((l) => ({
              _id: l._id,
              type: l.type,
              principalAmount: l.principalAmount,
              outstandingAmount: l.outstandingAmount,
              interestRate: l.interestRate,
              emiAmount: l.emiAmount,
              tenureRemaining: l.tenureRemaining,
            })),
          );
          setSavedLiab(true);
        }
        if (insRes.insurances && insRes.insurances.length > 0) {
          setInsurances(
            insRes.insurances.map((i) => ({
              _id: i._id,
              type: i.type,
              provider: i.provider,
              coverage: i.coverageAmount,
              premiumAmount: i.premiumAmount,
              maturityDate: i.maturityDate,
            })),
          );
          setSavedIns(true);
        }
        if (glsRes.financialGoals && glsRes.financialGoals.length > 0) {
          setGoals(
            glsRes.financialGoals.map((g) => ({
              _id: g._id,
              goalType: g.goalType,
              targetAmount: g.targetAmount,
              targetDate: g.targetDate,
              priorityLevel: g.priorityLevel,
              inflationRate: g.inflationRate,
              currentSavingsForGoal: g.currentSavingsForGoal,
            })),
          );
          setSavedGoal(true);
        }
      } catch (err) {
        toast.error("Error loading user financial data");
      }
    };
    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const [loadingGen, setLoadingGen] = useState(false);
  const [savedGen, setSavedGen] = useState(false);
  const [errorGen, setErrorGen] = useState("");
  const [isGenModified, setIsGenModified] = useState(false);

  const handleGenInfoChange = (e) => {
    const { name, value } = e.target;
    setGeneralInfo((prev) => ({ ...prev, [name]: value }));
    setSavedGen(false);
    setIsGenModified(true);
  };

  const setRiskProfile = (profile) => {
    setGeneralInfo((prev) => ({ ...prev, riskProfile: profile }));
    setSavedGen(false);
    setIsGenModified(true);
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
      setIsGenModified(false);
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
    { sourceType: "salary", amount: "", growthRate: "0" },
  ]);
  const [loadingInc, setLoadingInc] = useState(false);
  const [savedInc, setSavedInc] = useState(false);
  const [errorInc, setErrorInc] = useState("");
  const [isIncModified, setIsIncModified] = useState(false);

  const handleAppIncomeChange = (index, field, value) => {
    const newIncomes = [...incomes];
    newIncomes[index][field] = value;
    setIncomes(newIncomes);
    setSavedInc(false);
    setIsIncModified(true);
  };

  const addIncomeRow = () => {
    setIncomes([
      ...incomes,
      { sourceType: "investment", amount: "", growthRate: "0" },
    ]);
    setSavedInc(false);
    setIsIncModified(true);
  };

  const handleSaveIncome = async () => {
    setErrorInc("");
    setLoadingInc(true);
    try {
      const validIncomes = incomes.filter(
        (inc) => inc.amount && !isNaN(Number(inc.amount)),
      );
      if (validIncomes.length > 0) {
        await Promise.all(
          validIncomes.map((inc) => {
            const data = {
              sourceType: inc.sourceType,
              monthlyAmount: Number(inc.amount),
              growthRate: Number(inc.growthRate) || 0,
              isActive: true,
            };
            if (inc._id) {
              return updateIncome(inc._id, data);
            } else {
              return addIncome(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("incomes");
      }
      setSavedInc(true);
      setIsIncModified(false);
      // Optional: re-fetch to get new IDs
    } catch (err) {
      setErrorInc("Failed to save Income Details.");
    } finally {
      setLoadingInc(false);
    }
  };

  const handleDeleteIncome = async (index) => {
    const inc = incomes[index];
    if (inc._id) {
      try {
        await deleteIncome(inc._id);
      } catch (err) {
        toast.error("Failed to delete income");
      }
    }
    const newIncomes = [...incomes];
    newIncomes.splice(index, 1);
    setIncomes(newIncomes);
    setSavedInc(false);
    setIsIncModified(true);
  };

  // --- EXPENSES STATE --------
  const [expenses, setExpenses] = useState([
    { category: "housing", amount: "", type: "fixed" },
    { category: "food", amount: "", type: "variable" },
  ]);
  const [loadingExp, setLoadingExp] = useState(false);
  const [savedExp, setSavedExp] = useState(false);
  const [errorExp, setErrorExp] = useState("");
  const [isExpModified, setIsExpModified] = useState(false);

  const handleExpenseChange = (index, field, value) => {
    const newExp = [...expenses];
    newExp[index][field] = value;
    setExpenses(newExp);
    setSavedExp(false);
    setIsExpModified(true);
  };

  const addExpenseRow = () => {
    setExpenses([
      ...expenses,
      { category: "other", amount: "", type: "variable" },
    ]);
    setSavedExp(false);
    setIsExpModified(true);
  };

  const handleSaveExpense = async () => {
    setErrorExp("");
    setLoadingExp(true);
    try {
      const valid = expenses.filter(
        (exp) => exp.amount && !isNaN(Number(exp.amount)),
      );
      if (valid.length > 0) {
        await Promise.all(
          valid.map((exp) => {
            const data = {
              category: exp.category,
              monthlyAmount: Number(exp.amount),
              type: exp.type,
            };
            if (exp._id) {
              return updateExpense(exp._id, data);
            } else {
              return addExpense(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("expenses");
      }
      setSavedExp(true);
      setIsExpModified(false);
    } catch (err) {
      setErrorExp("Failed to save Expenses.");
    } finally {
      setLoadingExp(false);
    }
  };

  const handleDeleteExpense = async (index) => {
    const exp = expenses[index];
    if (exp._id) {
      try {
        await deleteExpense(exp._id);
      } catch (err) {
        toast.error("Failed to delete expense");
      }
    }
    const newExp = [...expenses];
    newExp.splice(index, 1);
    setExpenses(newExp);
    setSavedExp(false);
    setIsExpModified(true);
  };

  // --- ASSETS STATE --------
  const [assets, setAssets] = useState([
    {
      type: "stock",
      name: "",
      amount: "",
      investedAmount: "",
      expectedReturnRate: "12",
      liquidityLevel: "high",
    },
  ]);
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [savedAsset, setSavedAsset] = useState(false);
  const [errorAsset, setErrorAsset] = useState("");
  const [isAssetModified, setIsAssetModified] = useState(false);

  const handleAssetChange = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index][field] = value;
    setAssets(newAssets);
    setSavedAsset(false);
    setIsAssetModified(true);
  };

  const addAssetRow = () => {
    setAssets([
      ...assets,
      {
        type: "mutual_fund",
        name: "",
        amount: "",
        investedAmount: "",
        expectedReturnRate: "10",
        liquidityLevel: "medium",
      },
    ]);
    setSavedAsset(false);
    setIsAssetModified(true);
  };

  const handleSaveAssets = async () => {
    setErrorAsset("");
    setLoadingAsset(true);
    try {
      const valid = assets.filter((a) => a.amount && a.name);
      if (valid.length > 0) {
        await Promise.all(
          valid.map((a) => {
            const data = {
              type: a.type,
              name: a.name,
              currentValue: Number(a.amount),
              investedAmount: Number(a.investedAmount) || Number(a.amount),
              expectedReturnRate: Number(a.expectedReturnRate) || 0,
              liquidityLevel: a.liquidityLevel,
            };
            if (a._id) {
              return updateAsset(a._id, data);
            } else {
              return addAsset(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("assets");
      }
      setSavedAsset(true);
      setIsAssetModified(false);
    } catch (err) {
      setErrorAsset("Failed to save Assets.");
    } finally {
      setLoadingAsset(false);
    }
  };

  const handleDeleteAsset = async (index) => {
    const a = assets[index];
    if (a._id) {
      try {
        await deleteAsset(a._id);
      } catch (err) {
        toast.error("Failed to delete asset");
      }
    }
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setAssets(newAssets);
    setSavedAsset(false);
    setIsAssetModified(true);
  };

  // --- LIABILITIES STATE --------
  const [liabilities, setLiabilities] = useState([
    {
      type: "loan",
      principalAmount: "",
      outstandingAmount: "",
      interestRate: "",
      emiAmount: "",
      tenureRemaining: "",
    },
  ]);
  const [loadingLiab, setLoadingLiab] = useState(false);
  const [savedLiab, setSavedLiab] = useState(false);
  const [errorLiab, setErrorLiab] = useState("");
  const [isLiabModified, setIsLiabModified] = useState(false);

  const handleLiabilityChange = (index, field, value) => {
    const newLiab = [...liabilities];
    newLiab[index][field] = value;
    setLiabilities(newLiab);
    setSavedLiab(false);
    setIsLiabModified(true);
  };

  const addLiabilityRow = () => {
    setLiabilities([
      ...liabilities,
      {
        type: "credit_card",
        principalAmount: "",
        outstandingAmount: "",
        interestRate: "",
        emiAmount: "",
        tenureRemaining: "",
      },
    ]);
    setSavedLiab(false);
    setIsLiabModified(true);
  };

  const handleSaveLiabilities = async () => {
    setErrorLiab("");
    setLoadingLiab(true);
    try {
      const valid = liabilities.filter((l) => l.outstandingAmount);
      if (valid.length > 0) {
        await Promise.all(
          valid.map((l) => {
            const data = {
              type: l.type,
              principalAmount: Number(l.principalAmount) || 0,
              outstandingAmount: Number(l.outstandingAmount) || 0,
              interestRate: Number(l.interestRate) || 0,
              emiAmount: Number(l.emiAmount) || 0,
              tenureRemaining: Number(l.tenureRemaining) || 0,
            };
            if (l._id) {
              return updateLiability(l._id, data);
            } else {
              return addLiability(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("liabilities");
      }
      setSavedLiab(true);
      setIsLiabModified(false);
    } catch (err) {
      setErrorLiab("Failed to save Liabilities.");
    } finally {
      setLoadingLiab(false);
    }
  };

  const handleDeleteLiability = async (index) => {
    const l = liabilities[index];
    if (l._id) {
      try {
        await deleteLiability(l._id);
      } catch (err) {
        toast.error("Failed to delete liability");
      }
    }
    const newLiab = [...liabilities];
    newLiab.splice(index, 1);
    setLiabilities(newLiab);
    setSavedLiab(false);
    setIsLiabModified(true);
  };

  // --- INSURANCE STATE --------
  const [insurances, setInsurances] = useState([
    {
      type: "health",
      provider: "",
      coverage: "",
      premiumAmount: "",
      maturityDate: "",
    },
  ]);
  const [loadingIns, setLoadingIns] = useState(false);
  const [savedIns, setSavedIns] = useState(false);
  const [errorIns, setErrorIns] = useState("");
  const [isInsModified, setIsInsModified] = useState(false);

  const handleInsuranceChange = (index, field, value) => {
    const newIns = [...insurances];
    newIns[index][field] = value;
    setInsurances(newIns);
    setSavedIns(false);
    setIsInsModified(true);
  };

  const addInsuranceRow = () => {
    setInsurances([
      ...insurances,
      {
        type: "term",
        provider: "",
        coverage: "",
        premiumAmount: "",
        maturityDate: "",
      },
    ]);
    setSavedIns(false);
    setIsInsModified(true);
  };

  const handleSaveInsurance = async () => {
    setErrorIns("");
    setLoadingIns(true);
    try {
      const valid = insurances.filter((i) => i.provider);
      if (valid.length > 0) {
        await Promise.all(
          valid.map((i) => {
            const data = {
              type: i.type,
              provider: i.provider,
              coverageAmount: Number(i.coverage) || 0,
              premiumAmount: Number(i.premiumAmount) || 0,
              maturityDate:
                i.maturityDate ||
                new Date(
                  Date.now() + 10 * 365 * 24 * 60 * 60 * 1000,
                ).toISOString(),
            };
            if (i._id) {
              return updateInsurance(i._id, data);
            } else {
              return addInsurance(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("insurance");
      }
      setSavedIns(true);
      setIsInsModified(false);
    } catch (err) {
      setErrorIns("Failed to save Insurance.");
    } finally {
      setLoadingIns(false);
    }
  };

  const handleDeleteInsurance = async (index) => {
    const i = insurances[index];
    if (i._id) {
      try {
        await deleteInsurance(i._id);
      } catch (err) {
        toast.error("Failed to delete insurance");
      }
    }
    const newIns = [...insurances];
    newIns.splice(index, 1);
    setInsurances(newIns);
    setSavedIns(false);
    setIsInsModified(true);
  };

  // --- GOALS STATE --------
  const [goals, setGoals] = useState([
    {
      goalType: "retirement",
      targetAmount: "",
      targetDate: "",
      priorityLevel: "high",
      inflationRate: "6",
      currentSavingsForGoal: "0",
    },
  ]);
  const [loadingGoal, setLoadingGoal] = useState(false);
  const [savedGoal, setSavedGoal] = useState(false);
  const [errorGoal, setErrorGoal] = useState("");
  const [isGoalModified, setIsGoalModified] = useState(false);

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    newGoals[index][field] = value;
    setGoals(newGoals);
    setSavedGoal(false);
    setIsGoalModified(true);
  };

  const addGoalRow = () => {
    setGoals([
      ...goals,
      {
        goalType: "house",
        targetAmount: "",
        targetDate: "",
        priorityLevel: "medium",
        inflationRate: "6",
        currentSavingsForGoal: "0",
      },
    ]);
    setSavedGoal(false);
    setIsGoalModified(true);
  };

  const handleSaveGoals = async () => {
    setErrorGoal("");
    setLoadingGoal(true);
    try {
      const valid = goals.filter((g) => g.goalType && g.targetAmount);
      if (valid.length > 0) {
        await Promise.all(
          valid.map((g) => {
            const data = {
              goalType: g.goalType,
              targetAmount: Number(g.targetAmount),
              targetDate:
                g.targetDate ||
                new Date(
                  Date.now() + 5 * 365 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              priorityLevel: g.priorityLevel,
              inflationRate: Number(g.inflationRate) || 0,
              currentSavingsForGoal: Number(g.currentSavingsForGoal) || 0,
              status: "active",
            };
            if (g._id) {
              return updateFinancialGoal(g._id, data);
            } else {
              return addFinancialGoal(data);
            }
          }),
        );
      } else {
        await markOnboardingStep("goals");
      }
      setSavedGoal(true);
      setIsGoalModified(false);
    } catch (err) {
      setErrorGoal("Failed to save Goals.");
    } finally {
      setLoadingGoal(false);
    }
  };

  const handleDeleteGoal = async (index) => {
    const g = goals[index];
    if (g._id) {
      try {
        await deleteFinancialGoal(g._id);
      } catch (err) {
        toast.error("Failed to delete goal");
      }
    }
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    setGoals(newGoals);
    setSavedGoal(false);
    setIsGoalModified(true);
  };

  const [isDbAllSaved, setIsDbAllSaved] = useState(false);

  useEffect(() => {
    const targetEmail = emailId || user?.email;
    if (!targetEmail || isDbAllSaved) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await checkOnboardingStatus(targetEmail);
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
  }, [emailId, user?.email, isDbAllSaved]);

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
                <span className="text-xs font-bold text-emerald-600">100%</span>
              </div>
              <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full rounded-full shadow-sm shadow-emerald-200"></div>
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
                className={`relative overflow-hidden w-full group rounded-2xl font-bold px-8 py-4 transition-all duration-300 flex items-center justify-center gap-3 ${
                  isDbAllSaved
                    ? "bg-emerald-700 text-white shadow-emerald-700/20 btn-hover-animate"
                    : "bg-emerald-500 text-white shadow-emerald-500/20 btn-hover-animate"
                } disabled:opacity-75 disabled:cursor-not-allowed`}
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
                isModified={isGenModified}
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
                        onClick={() => setRiskProfile("conservative")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "conservative" ? "font-bold bg-white shadow-sm border border-slate-100 text-emerald-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
                      >
                        Conservative
                      </button>
                      <button
                        type="button"
                        onClick={() => setRiskProfile("moderate")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "moderate" ? "font-bold bg-white shadow-sm border border-slate-100 text-emerald-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
                      >
                        Moderate
                      </button>
                      <button
                        type="button"
                        onClick={() => setRiskProfile("aggressive")}
                        className={`flex-1 text-sm py-2.5 rounded-lg transition-colors ${generalInfo.riskProfile === "aggressive" ? "font-bold bg-white shadow-sm border border-slate-100 text-emerald-600" : "font-medium text-slate-500 hover:text-slate-700"}`}
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
                saveBtnText={
                  incomes.filter(
                    (inc) => inc.amount && !isNaN(Number(inc.amount)),
                  ).length > 0
                    ? "Save Income Details"
                    : "I don't have an Income"
                }
                isModified={isIncModified}
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
                          placeholder="Amount"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <div className="relative w-1/4">
                        <span className="absolute right-4 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                          %
                        </span>
                        <input
                          type="number"
                          value={inc.growthRate}
                          onChange={(e) =>
                            handleAppIncomeChange(
                              index,
                              "growthRate",
                              e.target.value,
                            )
                          }
                          placeholder="Growth"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-4 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteIncome(index)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                        title="Delete Income"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIncomeRow}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors flex items-center gap-1 mt-4"
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
                saveBtnText={
                  expenses.filter(
                    (exp) => exp.amount && !isNaN(Number(exp.amount)),
                  ).length > 0
                    ? "Save Monthly Expenses"
                    : "I don't have Expenses"
                }
                isModified={isExpModified}
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
                      <div className="relative w-1/4">
                        <select
                          value={exp.type}
                          onChange={(e) =>
                            handleExpenseChange(index, "type", e.target.value)
                          }
                          className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="variable">Variable</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none">
                          expand_more
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(index)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                        title="Delete Expense"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addExpenseRow}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors flex items-center gap-1 mt-4"
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
                saveBtnText={
                  assets.filter((a) => a.amount && a.name).length > 0
                    ? "Save Assets & Investments"
                    : "I don't have Assets"
                }
                isModified={isAssetModified}
              >
                <div className="space-y-4">
                  {assets.map((asset, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="relative w-1/3">
                          <select
                            value={asset.type}
                            onChange={(e) =>
                              handleAssetChange(index, "type", e.target.value)
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="stock">Stock</option>
                            <option value="mutual_fund">Mutual Fund</option>
                            <option value="crypto">Crypto</option>
                            <option value="fd">Fixed Deposit (FD)</option>
                            <option value="real_estate">Real Estate</option>
                            <option value="gold">Gold</option>
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
                      </div>
                      <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                        <div className="relative flex-1 min-w-[110px]">
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
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative flex-1 min-w-[110px]">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={asset.investedAmount}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "investedAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Invested"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-full sm:w-1/4 min-w-[80px]">
                          <span className="absolute right-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            %
                          </span>
                          <input
                            type="number"
                            value={asset.expectedReturnRate}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "expectedReturnRate",
                                e.target.value,
                              )
                            }
                            placeholder="Ret %"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/3">
                          <select
                            value={asset.liquidityLevel}
                            onChange={(e) =>
                              handleAssetChange(
                                index,
                                "liquidityLevel",
                                e.target.value,
                              )
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="high">High Liquidity</option>
                            <option value="medium">Medium Liquidity</option>
                            <option value="low">Low Liquidity</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                            expand_more
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteAsset(index)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ml-2"
                          title="Delete Asset"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAssetRow}
                    className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all font-semibold text-sm"
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
                saveBtnText={
                  liabilities.filter((l) => l.outstandingAmount).length > 0
                    ? "Save Liabilities"
                    : "I don't have Liabilities"
                }
                isModified={isLiabModified}
              >
                <div className="space-y-4">
                  {liabilities.map((liab, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                    >
                      <div className="flex gap-2">
                        <div className="relative w-1/3">
                          <select
                            value={liab.type}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "type",
                                e.target.value,
                              )
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="loan">Loan</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="mortgage">Mortgage</option>
                            <option value="other">Other</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                            expand_more
                          </span>
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={liab.principalAmount}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "principalAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Principal Amount"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={liab.outstandingAmount}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "outstandingAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Outstanding Balance"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={liab.emiAmount}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "emiAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Monthly EMI"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/4">
                          <span className="absolute right-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            %
                          </span>
                          <input
                            type="number"
                            value={liab.interestRate}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "interestRate",
                                e.target.value,
                              )
                            }
                            placeholder="Iterest %"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/3">
                          <input
                            type="number"
                            value={liab.tenureRemaining}
                            onChange={(e) =>
                              handleLiabilityChange(
                                index,
                                "tenureRemaining",
                                e.target.value,
                              )
                            }
                            placeholder="Months Left"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteLiability(index)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ml-2"
                          title="Delete Liability"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLiabilityRow}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors flex items-center gap-1"
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
                saveBtnText={
                  insurances.filter((i) => i.provider).length > 0
                    ? "Save Insurance Policies"
                    : "I don't have Insurance"
                }
                isModified={isInsModified}
              >
                <div className="space-y-4">
                  {insurances.map((ins, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="relative w-1/3">
                          <select
                            value={ins.type}
                            onChange={(e) =>
                              handleInsuranceChange(
                                index,
                                "type",
                                e.target.value,
                              )
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="health">Health</option>
                            <option value="term">Term Life</option>
                            <option value="life">Whole Life</option>
                            <option value="vehicle">Vehicle</option>
                            <option value="property">Property</option>
                            <option value="other">Other</option>
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
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
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
                            placeholder="Coverage Amount"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={ins.premiumAmount}
                            onChange={(e) =>
                              handleInsuranceChange(
                                index,
                                "premiumAmount",
                                e.target.value,
                              )
                            }
                            placeholder="Annual Premium"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/3">
                          <input
                            type="date"
                            value={
                              ins.maturityDate
                                ? ins.maturityDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const dateVal = e.target.value
                                ? new Date(e.target.value).toISOString()
                                : "";
                              handleInsuranceChange(
                                index,
                                "maturityDate",
                                dateVal,
                              );
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteInsurance(index)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ml-2"
                          title="Delete Insurance"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addInsuranceRow}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors flex items-center gap-1"
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
                saveBtnText={
                  goals.filter((g) => g.goalType && g.targetAmount).length > 0
                    ? "Save Financial Goals"
                    : "I don't have Goals"
                }
                isModified={isGoalModified}
              >
                <div className="space-y-4">
                  {goals.map((goal, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm"
                    >
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <select
                            value={goal.goalType}
                            onChange={(e) =>
                              handleGoalChange(
                                index,
                                "goalType",
                                e.target.value,
                              )
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="retirement">Retirement</option>
                            <option value="house">House Downpayment</option>
                            <option value="car">Car Purchase</option>
                            <option value="education">Education</option>
                            <option value="travel">Travel</option>
                            <option value="emergency_fund">
                              Emergency Fund
                            </option>
                            <option value="other">Other</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                            expand_more
                          </span>
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
                            placeholder="Target Amount"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/4">
                          <input
                            type="date"
                            value={
                              goal.targetDate
                                ? goal.targetDate.split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const dateVal = e.target.value
                                ? new Date(e.target.value).toISOString()
                                : "";
                              handleGoalChange(index, "targetDate", dateVal);
                            }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-500 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <select
                            value={goal.priorityLevel}
                            onChange={(e) =>
                              handleGoalChange(
                                index,
                                "priorityLevel",
                                e.target.value,
                              )
                            }
                            className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium cursor-pointer"
                          >
                            <option value="high">High Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-[10px] text-slate-400 pointer-events-none text-lg">
                            expand_more
                          </span>
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={goal.currentSavingsForGoal}
                            onChange={(e) =>
                              handleGoalChange(
                                index,
                                "currentSavingsForGoal",
                                e.target.value,
                              )
                            }
                            placeholder="Saved So Far"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-7 pr-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <div className="relative w-1/4">
                          <span className="absolute right-3 top-[10px] text-slate-400 text-sm font-medium pointer-events-none">
                            %
                          </span>
                          <input
                            type="number"
                            value={goal.inflationRate}
                            onChange={(e) =>
                              handleGoalChange(
                                index,
                                "inflationRate",
                                e.target.value,
                              )
                            }
                            placeholder="Req Return"
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg pl-3 pr-7 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors font-medium placeholder:text-slate-400"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteGoal(index)}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center ml-2"
                          title="Delete Goal"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGoalRow}
                    className="text-emerald-600 font-semibold text-sm hover:text-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>{" "}
                    Add Goal
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-6 border-t border-slate-200 mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (user) completeOnboarding();
                  navigate("/dashboard");
                }}
                disabled={!allSaved}
                className={`relative overflow-hidden w-full group rounded-2xl font-bold py-3 px-8 text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${
                  allSaved
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 ring-4 ring-blue-600/10 btn-hover-animate"
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                Get Results
                <span className="material-symbols-outlined text-[20px] btn-icon-animate">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Signup3;
