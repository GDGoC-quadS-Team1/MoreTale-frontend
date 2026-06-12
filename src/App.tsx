import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import ProfileComplete from './pages/ProfileComplete';
import HomePage from './pages/HomePage';
import IntroPage from './pages/tale/IntroPage';
import PromptPage from './pages/tale/PromptPage';
import LanguagePage from './pages/tale/LanguagePage';
import LoadingPage from './pages/tale/LoadingPage';
import CompletePage from './pages/tale/CompletePage';
import ReadPage from './pages/tale/ReadPage';
import LibraryPage from './pages/library/LibraryPage';
import VocaListPage from './pages/library/VocaListPage';
import VocabularyPage from './pages/library/VocabularyPage';
import QuizListPage from './pages/quiz/QuizListPage';
import QuizPlayPage from './pages/quiz/QuizPlayPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/profile-complete" element={<ProfileComplete />} />
        <Route path="/home" element={<HomePage />} />

        {/* TALE */}
        <Route path="/tale/intro" element={<IntroPage />} />
        <Route path="/tale/prompt" element={<PromptPage />} />
        <Route path="/tale/language" element={<LanguagePage />} />
        <Route path="/tale/loading" element={<LoadingPage />} />
        <Route path="/tale/complete" element={<CompletePage />} />
        <Route path="/tale/read/:storyId" element={<ReadPage />} />
        
        {/* LIBRARY */}
        <Route path="/lib" element={<LibraryPage />} />

        {/* VOCA */}
        <Route path="/voca" element={<VocaListPage />} />
        <Route path="/voca/detail" element={<VocabularyPage />} />

        {/* QUIZ */}
        <Route path="/quiz" element={<QuizListPage />} />
        <Route path="/quiz/play" element={<QuizPlayPage />} />

        {/* MY */}
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
