import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUpComponent'; 
import Login from './components/LoginPage';
import './App.css';
import DashboardContactForm from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardContactForm />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;