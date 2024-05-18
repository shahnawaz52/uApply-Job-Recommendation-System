import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ThemeToggler from './components/ThemeToggler';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/Register';
import HomePage from './components/HomePage';
import RecommendationPage from './components/Recommendation';
import SavedJobsPage from './components/SavedJobs';
import Layout from './components/Layout';
import AccountInfoForm from './components/AccountInfo';
import JobsPage from './components/JobsPage';


function App() {
  return (
    <div className="App">
      <ChakraProvider>
        <ThemeToggler />
        {/* <VerticalNavbar /> */}
        {/* <AuthenticationPage /> */}
        {/* <RegisterPage /> */}
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/get-saved-jobs" element={<SavedJobsPage />} />
              <Route path="/user/account" element={<AccountInfoForm />} />
              <Route path="/jobs" element={<JobsPage />} />
            </Routes>
          </Layout>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
