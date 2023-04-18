// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import RegisterAdmin from './Pages/RegisterAdminPage';
import RegisterStaff from './Pages/RegisterStaffPage';
import RegisterSSO from './Pages/RegisterSSOPage';
import RegisterSSOAdmin from './Pages/RegisterSSOAdminPage';
import RegisterSSOStaff from './Pages/RegisterSSOStaffPage';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Navbar />
        
        <Routes>
          <Route path='/' element={<LoginPage />}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/register/admin' element={<RegisterAdmin/>}/>
          <Route path='/register/staff' element={<RegisterStaff/>}/>
          <Route path='/register-SSO' element={<RegisterSSO/>}/>
          <Route path='/register-SSO/admin' element={<RegisterSSOAdmin/>}/>
          <Route path='/register-SSO/staff' element={<RegisterSSOStaff/>}/>
          <Route path='/home' element={<HomePage/>}/>
        </Routes>
    </div>
  );
}

export default App;
