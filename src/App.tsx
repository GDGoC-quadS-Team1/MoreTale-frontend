import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfileComplete from './pages/ProfileComplete';
import HomePage from './pages/HomePage';
import IntroPage from './pages/tale/IntroPage';
import PromptPage from './pages/tale/PromptPage';
import LanguagePage from './pages/tale/LanguagePage';
import LoadingPage from './pages/tale/LoadingPage';
import CompletePage from './pages/tale/CompletePage';
import ReadPage from './pages/tale/ReadPage';
import FinishPage from './pages/tale/FinishPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile-complete" element={<ProfileComplete />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/tale/intro" element={<IntroPage />} />
        <Route path="/tale/prompt" element={<PromptPage />} />
        <Route path="/tale/language" element={<LanguagePage />} />
        <Route path="/tale/loading" element={<LoadingPage />} />
        <Route path="/tale/complete" element={<CompletePage />} />
        <Route path="/tale/read" element={<ReadPage />} />
        <Route path="/tale/finish" element={<FinishPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
