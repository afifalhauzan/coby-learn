import { Route, Routes } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import FolderDetailsPage from './pages/FolderDetailsPage';
import Dashboard from './pages/Dashboard';
import LibraryPage from './pages/LibraryPage';
import TasksPage from './pages/TasksPage';
import ProgressPage from './pages/ProgressPage';
import ProjectPage from './pages/ProjectPage';
import QuizPage from './pages/QuizPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import FlashcardPage from './pages/FlashcardPage';
import DailyQuizPage from './pages/DailyQuizPage';
import QuizResultPage from './pages/QuizResultPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

import { ProtectedRoute, PublicRoute } from './components/auth/AuthMiddleware';

function App() {
  return (
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicRoute />}>
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/sign-up" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/library/:folderId" element={<FolderDetailsPage />} />
          <Route path="/project/:projectId" element={<ProjectPage />} />
          <Route path="/material/:materialId" element={<MaterialDetailPage />} />
          <Route path="/quiz/:topicId" element={<QuizPage />} />
          <Route path="/flashcards/play" element={<FlashcardPage />} />
          <Route path="/daily-quiz" element={<DailyQuizPage />} />
          <Route path="/quiz/result/:resultId" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;