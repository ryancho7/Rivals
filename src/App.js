import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReportFeed from './pages/ReportFeed';
import Thanks from './pages/Thanks';
import Welcome from './pages/Welcome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/welcome' element={<Welcome/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/reportfeed' element={<ReportFeed/>}/>
        <Route path='/thanks' element={<Thanks/>}/>
      </Routes>
    </Router>
  );
}

export default App;
