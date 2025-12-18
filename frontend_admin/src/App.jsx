import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MockPage from './pages/MockPage';
import BankList from './pages/Banks';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/banks" element={<BankList />} />
            <Route path="/gallery" element={<MockPage />} />
            <Route path="/schools" element={<MockPage />} />
            <Route path="/sponsors" element={<MockPage />} />
            <Route path="/testimonials" element={<MockPage />} />
            <Route path="/volunteers" element={<MockPage />} />
            <Route path="/socials" element={<MockPage />} />
            <Route path="/alerts" element={<MockPage />} />
            <Route path="/communities" element={<MockPage />} />
            <Route path="/profile" element={<MockPage />} />
            <Route path="/settings" element={<MockPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
};

export default App;