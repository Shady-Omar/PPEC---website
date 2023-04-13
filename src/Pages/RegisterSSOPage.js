// import './App.css';
import { Link } from 'react-router-dom';

function RegisterSSO() {
  return (
    <div className="RegisterSSO">

      <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
        <section className="flex w-[30rem] flex-col space-y-10">
          <div className="text-center text-4xl font-medium">Select account type</div>

          <Link className='transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400' to="/SSO/register/admin">Adminstrator</Link>
          <Link className='transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400' to="/SSO/register/staff">Staff</Link>
        
        </section>
      </main>
    </div>
  );
}

export default RegisterSSO;
