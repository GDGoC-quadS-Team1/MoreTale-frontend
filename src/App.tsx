import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfileComplete from './pages/ProfileComplete';
import HomePage from './pages/HomePage';
import IntroPage from './pages/fairy-tale/IntroPage';
import PromptPage from './pages/fairy-tale/PromptPage';
import LanguagePage from './pages/fairy-tale/LanguagePage';
import LoadingPage from './pages/fairy-tale/LoadingPage';
import CompletePage from './pages/fairy-tale/CompletePage';
import ReadPage from './pages/fairy-tale/ReadPage';
import FinishPage from './pages/fairy-tale/FinishPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/profile-complete" element={<ProfileComplete />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/fairy-tale/intro" element={<IntroPage />} />
        <Route path="/fairy-tale/prompt" element={<PromptPage />} />
        <Route path="/fairy-tale/language" element={<LanguagePage />} />
        <Route path="/fairy-tale/loading" element={<LoadingPage />} />
        <Route path="/fairy-tale/complete" element={<CompletePage />} />
        <Route path="/fairy-tale/read" element={<ReadPage />} />
        <Route path="/fairy-tale/finish" element={<FinishPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
