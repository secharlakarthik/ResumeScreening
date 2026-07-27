import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { ToastContainer } from "./components/ToastContainer";
import { CommandPalette } from "./components/CommandPalette";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from "./pages/Dashboard";
import { ProfileWizard } from "./pages/ProfileWizard";
import { JobsFeed } from "./pages/JobsFeed";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-150 transition-colors duration-200 flex flex-col font-sans antialiased">
          
          {/* Header Navigation panel */}
          <Navbar />

          {/* Router Content Outlet */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<ProfileWizard />} />
              <Route path="/jobs" element={<JobsFeed />} />
              <Route path="/settings" element={<Settings />} />
              
              {/* Pointing secondary admin/candidate pathways straight to dashboard */}
              <Route path="/applications" element={<Dashboard />} />
              <Route path="/admin/users" element={<Dashboard />} />
              <Route path="/admin/logs" element={<Dashboard />} />

              {/* Catch-all redirect back home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global UI Overlays */}
          <ToastContainer />
          <CommandPalette />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
