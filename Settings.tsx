import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StudentDashboard } from "../components/StudentDashboard";
import { RecruiterDashboard } from "../components/RecruiterDashboard";
import { AdminDashboard } from "../components/AdminDashboard";

export const Dashboard: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // Route guarding: anonymous users redirected back to login
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-mono font-bold">SECURING WORKSPACE REDIRECT...</p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[calc(100vh-64px)]">
      {user.role === "student" && <StudentDashboard />}
      {user.role === "recruiter" && <RecruiterDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </main>
  );
};

export default Dashboard;
