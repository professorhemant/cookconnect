import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MenuLibrary from './pages/MenuLibrary';
import FamilyProfiles from './pages/FamilyProfiles';
import DietPlan from './pages/DietPlan';
import NutritionGuide from './pages/NutritionGuide';
import Notifications from './pages/Notifications';
import AuthPage from './pages/AuthPage';

function Layout() {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/auth" replace />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuLibrary />} />
          <Route path="/family" element={<FamilyProfiles />} />
          <Route path="/plans" element={<DietPlan />} />
          <Route path="/nutrition" element={<NutritionGuide />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
