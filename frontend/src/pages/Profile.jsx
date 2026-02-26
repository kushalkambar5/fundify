import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/DashboardNavbar";
import profileImg from "../assets/profile.png";

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
      toast.error("Failed to fetch profile");
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
      toast.error("Failed to update profile");
      setError(
        err.response?.data?.message || "Failed to update profile details.",
      );
    } finally {
      setIsSaving(false);
    }
  };

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

  const InputField = ({ label, name, type = "text", placeholder, options }) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {isEditing ? (
          options ? (
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
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
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/30 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
            />
          )
        ) : (
          <div className="w-full rounded-xl border border-transparent bg-slate-100/50 px-4 py-2.5 text-sm text-slate-800 font-medium">
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
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-display text-slate-900 antialiased overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/60 blur-[120px] rounded-full"></div>

      <DashboardNavbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12 md:px-10 relative z-10">
        {/* Profile Card Header */}
        <div className="mb-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-xl shadow-emerald-100/50">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative group">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg bg-emerald-50 flex items-center justify-center">
                <img
                  src={profileImg}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-2 border-4 border-white shadow-sm flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]">
                  verified
                </span>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                    {user?.name || "Member"}
                  </h1>
                  <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-1.5">
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
                      className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 shadow-sm shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 btn-hover-animate"
                    >
                      <span className="material-symbols-outlined text-sm btn-icon-animate">
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
                        className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:text-slate-900 btn-hover-animate"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 shadow-sm shadow-emerald-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed btn-hover-animate"
                      >
                        {isSaving ? (
                          <span className="material-symbols-outlined text-sm animate-spin btn-icon-animate">
                            sync
                          </span>
                        ) : (
                          <span className="material-symbols-outlined text-sm btn-icon-animate">
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
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                  <span className="material-symbols-outlined text-[14px]">
                    calendar_today
                  </span>
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 border border-green-100">
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
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Details */}
            <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-emerald-100 pb-4">
                <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">
                    person
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
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
            <section className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3 border-b border-emerald-100 pb-4">
                <div className="h-9 w-9 rounded-lg bg-teal-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-teal-600 text-lg">
                    home_pin
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
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
            <section className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-600 to-green-500 p-8 shadow-md relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full blur-[40px] pointer-events-none"></div>

              <div className="mb-6 flex items-center gap-3 border-b border-white/20 pb-4 relative z-10">
                <span className="material-symbols-outlined text-emerald-200 text-xl">
                  payments
                </span>
                <h3 className="text-xl font-bold">Financial Profile</h3>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-emerald-100">
                    Employment Type
                  </label>
                  {isEditing ? (
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/15 border border-white/25 px-4 py-2.5 text-sm text-white focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                  <label className="text-sm font-medium text-emerald-100">
                    Annual Income (₹)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/15 border border-white/25 px-4 py-2.5 text-sm text-white focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 placeholder:text-white/40"
                      placeholder="e.g. 750000"
                    />
                  ) : (
                    <div className="font-bold text-xl text-emerald-100">
                      ₹
                      {Number(formData.annualIncome).toLocaleString("en-IN") ||
                        "0"}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-emerald-100">
                    Risk Tolerance
                  </label>
                  {isEditing ? (
                    <select
                      name="riskProfile"
                      value={formData.riskProfile}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/15 border border-white/25 px-4 py-2.5 text-sm text-white focus:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
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
                    <div className="inline-flex items-center w-fit gap-1.5 rounded-full bg-white/15 px-3 py-1 text-sm font-bold uppercase tracking-wider text-emerald-100">
                      {formData.riskProfile}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Account Settings */}
            <section className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">
                Account Security
              </h3>
              <ul className="space-y-2">
                <li>
                  <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors">
                        password
                      </span>
                      <span className="font-semibold text-sm text-slate-700">
                        Change Password
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-emerald-600">
                      chevron_right
                    </span>
                  </button>
                </li>
                <li>
                  <button className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-left group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-emerald-600 transition-colors">
                        verified_user
                      </span>
                      <span className="font-semibold text-sm text-slate-700">
                        Two-Factor Authentication
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-emerald-600">
                      chevron_right
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex justify-between items-center px-4 py-3 rounded-xl hover:bg-red-50 transition-colors text-left group mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500 transition-colors">
                        logout
                      </span>
                      <span className="font-semibold text-sm text-slate-700 group-hover:text-red-600">
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
