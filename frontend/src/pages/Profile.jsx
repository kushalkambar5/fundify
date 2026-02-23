import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    maritalStatus: "",
    dependents: "",
    employmentType: "",
    annualIncome: "",
    riskProfile: "",
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await axios.get("/user/me");
      if (res.data.success && res.data.user) {
        setUser(res.data.user);

        // Populate form data
        setFormData({
          name: res.data.user.name || "",
          phone: res.data.user.phone || "",
          age: res.data.user.age || "",
          gender: res.data.user.gender || "",
          address: res.data.user.address || "",
          city: res.data.user.city || "",
          state: res.data.user.state || "",
          zip: res.data.user.zip || "",
          country: res.data.user.country || "",
          maritalStatus: res.data.user.maritalStatus || "",
          dependents: res.data.user.dependents || 0,
          employmentType: res.data.user.employmentType || "",
          annualIncome: res.data.user.annualIncome || 0,
          riskProfile: res.data.user.riskProfile || "moderate",
        });
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
      setError("Failed to load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMsg(null);

      const res = await axios.put("/user/me", formData);

      if (res.data.success) {
        setUser(res.data.user);
        setSuccessMsg("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      setError(
        err.response?.data?.message || "Failed to update profile details.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const renderHeader = () => (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 md:px-10 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <span className="material-symbols-outlined text-xl">
                account_balance_wallet
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fundify
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Accounts
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Investments
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              Net Worth
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-primary bg-slate-100 dark:border-primary shadow-sm">
            <img
              alt="User Profile"
              src={
                user?.avatar?.url ||
                "https://img.sanishtech.com/u/4d4cc69635483ba63776ec075e4bbf11.png"
              }
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer className="mt-12 border-t border-slate-200 bg-white px-10 py-10 dark:bg-slate-950 dark:border-slate-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
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
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-and-conditions"
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            Terms & Conditions
          </Link>
          <a
            href="#"
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            Security
          </a>
          <a
            href="#"
            className="text-xs font-semibold text-slate-500 hover:text-primary transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-display">
        {renderHeader()}
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        {renderFooter()}
      </div>
    );
  }

  const InputField = ({ label, name, type = "text", placeholder, options }) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {isEditing ? (
          options ? (
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
            >
              <option value="">Select option</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-900"
            />
          )
        ) : (
          <div className="w-full rounded-xl border border-transparent bg-slate-100/50 dark:bg-slate-800/30 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 font-medium">
            {formData[name] || "—"}
          </div>
        )}
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Failed to logout", err);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50 dark:bg-[#0B0F19] font-display text-slate-900 dark:text-slate-100 antialiased overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="pointer-events-none absolute right-0 bottom-0 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/5 blur-[120px] rounded-full"></div>

      {renderHeader()}

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 md:px-10 relative z-10">
        {/* Profile Card Header */}
        <div className="mb-8 rounded-3xl border border-white/40 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/40 p-8 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-black/20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-slate-800 shadow-lg bg-slate-100 dark:bg-slate-800">
                <img
                  src={
                    user?.avatar?.url ||
                    "https://img.sanishtech.com/u/4d4cc69635483ba63776ec075e4bbf11.png"
                  }
                  alt="Avatar"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">
                  verified
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                    {user?.name || "Member"}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-1.5">
                    <span className="material-symbols-outlined text-sm">
                      mail
                    </span>
                    {user?.email}
                  </p>
                </div>

                <div className="flex gap-3 justify-center md:justify-end">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:hover:shadow-white/10"
                    >
                      <span className="material-symbols-outlined text-sm">
                        edit
                      </span>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // Reset fields
                        }}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <span className="material-symbols-outlined text-sm animate-spin">
                            sync
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-sm">
                            save
                          </span>
                        )}
                        Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                  <span className="material-symbols-outlined text-[14px]">
                    calendar_today
                  </span>
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50/80 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800">
                  <span className="material-symbols-outlined text-[14px]">
                    admin_panel_settings
                  </span>
                  Role: {user?.role || "User"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <span className="material-symbols-outlined">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary text-xl">
                  person
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                />
                <InputField
                  label="Age"
                  name="age"
                  type="number"
                  placeholder="30"
                />
                <InputField
                  label="Gender"
                  name="gender"
                  options={[
                    { label: "Male", value: "Male" },
                    { label: "Female", value: "Female" },
                    { label: "Other", value: "Other" },
                  ]}
                />
                <InputField
                  label="Marital Status"
                  name="maritalStatus"
                  options={[
                    { label: "Single", value: "Single" },
                    { label: "Married", value: "Married" },
                    { label: "Divorced", value: "Divorced" },
                    { label: "Widowed", value: "Widowed" },
                  ]}
                />
                <InputField
                  label="Dependents"
                  name="dependents"
                  type="number"
                  placeholder="0"
                />
              </div>
            </section>

            {/* Address Details */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary text-xl">
                  home_pin
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Address Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    name="address"
                    placeholder="123 Main St"
                  />
                </div>
                <InputField label="City" name="city" placeholder="New York" />
                <InputField
                  label="State / Province"
                  name="state"
                  placeholder="NY"
                />
                <InputField
                  label="ZIP / Postal Code"
                  name="zip"
                  placeholder="10001"
                />
                <InputField label="Country" name="country" placeholder="USA" />
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Financial Profile */}
            <section className="rounded-3xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm relative overflow-hidden text-white border-0 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-950">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full blur-[40px] pointer-events-none"></div>

              <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4 relative z-10">
                <span className="material-symbols-outlined text-blue-400 text-xl">
                  payments
                </span>
                <h3 className="text-xl font-bold">Financial Profile</h3>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Employment Type
                  </label>
                  {isEditing ? (
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    >
                      <option value="" className="text-slate-900">
                        Select...
                      </option>
                      <option value="Salaried" className="text-slate-900">
                        Salaried
                      </option>
                      <option value="Self-Employed" className="text-slate-900">
                        Self-Employed
                      </option>
                      <option value="Unemployed" className="text-slate-900">
                        Unemployed
                      </option>
                      <option value="Student" className="text-slate-900">
                        Student
                      </option>
                      <option value="Retired" className="text-slate-900">
                        Retired
                      </option>
                    </select>
                  ) : (
                    <div className="font-semibold text-lg">
                      {formData.employmentType || "—"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Annual Income ($)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 placeholder:text-white/30"
                      placeholder="e.g. 75000"
                    />
                  ) : (
                    <div className="font-bold text-xl text-blue-400">
                      ${Number(formData.annualIncome).toLocaleString() || "0"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-300">
                    Risk Tolerance
                  </label>
                  {isEditing ? (
                    <select
                      name="riskProfile"
                      value={formData.riskProfile}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                    >
                      <option value="conservative" className="text-slate-900">
                        Conservative
                      </option>
                      <option value="moderate" className="text-slate-900">
                        Moderate
                      </option>
                      <option value="aggressive" className="text-slate-900">
                        Aggressive
                      </option>
                    </select>
                  ) : (
                    <div className="inline-flex items-center w-fit gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-bold uppercase tracking-wider text-blue-300">
                      {formData.riskProfile}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Account Settings */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
                Account Security
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                        password
                      </span>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Change Password
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">
                      chevron_right
                    </span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">
                        verified_user
                      </span>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Two-Factor Authentication
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-primary">
                      chevron_right
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
                        logout
                      </span>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Log Out
                      </span>
                    </div>
                  </button>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      {renderFooter()}
    </div>
  );
}
