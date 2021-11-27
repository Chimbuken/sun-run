import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import SignUp from './components/SignUp';
import RunSetup from './components/RunSetup';
import SetupComplete from './components/SetupComplete';

function App() {
  return (
    <BrowserRouter>
      <ul>
        <h4>Route Setup / Testing</h4>
        <li><Link to="/">to home/sign up</Link></li>
        <li><Link to="/setup">to setup</Link></li>
        <li><Link to="/results">to results</Link></li>
      </ul>
      
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/setup" element={<RunSetup />} />
        <Route path="/setup/:userId" element={<RunSetup />} />
        <Route path="/results/" element={<SetupComplete />} />
        <Route path="/results/:userId" element={<SetupComplete />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;
