import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUp from './components/SignUp';
// import RunSetup from './components/RunSetup';
import Dashboard from './components/Dashboard';
import EditRun from './components/EditRun';
import Settings from './components/Settings';
import SettingUpRun from './components/SettingUpRun';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="*" element={<SignUp />} />
        {/* <Route path="/setup/:userId" element={<RunSetup />} /> */}
        <Route path="/settingUpRun/:userId" element={<SettingUpRun />} />
        <Route path="/settingUpRun/:userId/:selectedDate" element={<SettingUpRun />} />
        <Route path="/settings/:userId" element={<Settings />} />
        <Route path="/editRun/:userId/:runId" element={<EditRun />} />
        <Route path="/dashboard/:userId" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
