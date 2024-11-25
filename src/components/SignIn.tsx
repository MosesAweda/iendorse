import React, { useState, FormEvent } from 'react';
import logo from './svg/logo.svg';
import google from './svg/google.svg';
import { baseURL } from './URL';
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { LineWave } from 'react-loader-spinner';
import { account } from '../appwrite';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    console.log('google sigin started', account);
    try {
      const redirectUrl = `${window.location.origin}/auth-callback`; // URL to redirect after successful login
      await account.createOAuth2Session('google' as any, redirectUrl, `${redirectUrl}/fail`,);
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      toast.error('Google Sign-In failed');
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = `${baseURL}/Auth/LoginForUser`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.succeeded) {
        window.localStorage.setItem("userData", JSON.stringify(data.data));
        window.localStorage.setItem("token", data?.data.jwtToken);
        window.localStorage.setItem("walletUnits", data?.data.walletUnits);

        navigate('/');
        toast('Welcome ' + data.data.fullName + '!');
      } else {
        toast.error(data.message || 'An error occurred while signing in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An error occurred while signing in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start sm:items-center justify-center sm:justify-start md:pl-10 bg-cover bg-center" style={{ backgroundImage: 'url(images/formbanner.png)' }}>
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:border p-6 space-y-4 md:space-y-6 mx-5 mt-10 sm:mt-0">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" />
        </div>
        <div className="flex justify-center text-lg font-medium leading-tight tracking-tight text-gray-900 md:text-xl">
          Sign In
        </div>
        <div className="flex justify-center text-sm leading-tight tracking-tight text-gray-900">
          Your impact matters, we’re excited to have you back.
        </div>
        <form className="space-y-4 md:space-y-3" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <p className="px-4">
              Forgot your password?{' '}
              <Link to="/ResetPassword" className="text-customBlue hover:text-blue-500 font-medium">
                Reset
              </Link>
            </p>
          </div>
          <div>
            <button disabled={loading} type="submit" className="bg-customBlue text-white p-2.5 rounded-md w-full flex items-center justify-center space-x-2">
              <span>{loading ? 'Signing In' : 'Sign In'}</span>
              {loading && (
                <LineWave
                  visible={true}
                  height="40"
                  width="40"
                  color="#fff"
                  ariaLabel="line-wave-loading"
                />
              )}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <p className="px-4">Or Sign in with</p>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center space-x-4">
          <button onClick={handleGoogleSignIn} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-100">
            <img src={google} alt="google" width={24} height={24} />
            <span>Google</span>
          </button>
        </div>
        <div className="flex items-center justify-center">
          <p className="px-4">
            Are you new here?{' '}
            <Link to="/SignUp" className="text-customBlue hover:text-blue-500">
              Create An Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
