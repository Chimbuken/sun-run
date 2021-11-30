import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUp from './components/SignUp';
import RunSetup from './components/RunSetup';
import Dashboard from './components/Dashboard';
import EditRun from './components/EditRun';

function App() {
  return (
    <BrowserRouter>
      <ul className="test-menu">
        <h4>Route Setup / Testing</h4>
        <li><Link to="/">to home/sign up</Link></li>
        <li><Link to="/setup">to setup</Link></li>
        <li><Link to="/dashboard">to dashboard</Link></li>
      </ul>
      
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="*" element={<SignUp />} />
        <Route path="/setup/:userId" element={<RunSetup />} />
        <Route path="/editRun/:userId/:runId" element={<EditRun />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
