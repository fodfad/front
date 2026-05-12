import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChildrenPage from './pages/ChildrenPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import PlanPersonnalisePage from './pages/PlanPersonnalisePage';
import TrackingPage from './pages/TrackingPage';
import ResourcesPage from './pages/ResourcesPage';
import AdminPage from './pages/AdminPage';

import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ParentsManagementPage from './pages/admin/ParentsManagementPage';
import ChildrenManagementPage from './pages/admin/ChildrenManagementPage';
import QuestionnairesPage from './pages/admin/QuestionnairesPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminResourcesPage from './pages/admin/ResourcesPage';
import PlansPage from './pages/admin/PlansPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Register */}
        <Route path="/register" element={<RegisterPage />} />

        {/* ================= PARENT ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRole="parent">
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/children"
          element={
            <ProtectedRoute allowedRole="parent">
              <ChildrenPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/questionnaire"
          element={
            <ProtectedRoute allowedRole="parent">
              <QuestionnairePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRole="parent">
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/plan"
          element={
            <ProtectedRoute allowedRole="parent">
              <PlanPersonnalisePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tracking"
          element={
            <ProtectedRoute allowedRole="parent">
              <TrackingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resources"
          element={
            <ProtectedRoute allowedRole="parent">
              <ResourcesPage />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/parents"
          element={
            <ProtectedRoute allowedRole="admin">
              <ParentsManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/children"
          element={
            <ProtectedRoute allowedRole="admin">
              <ChildrenManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/questionnaires"
          element={
            <ProtectedRoute allowedRole="admin">
              <QuestionnairesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRole="admin">
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/resources"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminResourcesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/plans"
          element={
            <ProtectedRoute allowedRole="admin">
              <PlansPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}