// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import RegisterPage from './Pages/RegisterPage';
import RegisterAdmin from './Pages/RegisterAdminPage';
import RegisterStaff from './Pages/RegisterStaffPage';
import RegisterGoogle from './Pages/RegisterGooglePage';
import RegisterGoogleAdmin from './Pages/RegisterGoogleAdminPage';
import RegisterGoogleStaff from './Pages/RegisterGoogleStaffPage';
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
          <Route path='/gmail/register' element={<RegisterGoogle/>}/>
          <Route path='/gmail/register/admin' element={<RegisterGoogleAdmin/>}/>
          <Route path='/gmail/register/staff' element={<RegisterGoogleStaff/>}/>
          <Route path='/Home' element={<HomePage/>}/>
        </Routes>
    </div>
  );
}

export default App;
