// import './App.css';
import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <div className="RegisterPage">

      <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
        <section className="flex md:w-[30rem] sm:w-[85%] flex-col space-y-10">
          <div className="text-center text-4xl font-medium">Select account type</div>

          <Link className='transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400' to="/Register/Admin">Adminstrator</Link>
          <Link className='transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400' to="/Register/Staff">Staff</Link>

        </section>
      </main>
    </div>
  );
}

export default RegisterPage;
