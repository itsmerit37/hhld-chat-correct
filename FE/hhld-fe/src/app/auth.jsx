
'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ✅ Signup function
  const signUpFunc = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:8080/auth/signup',
        { username, password },
        { withCredentials: true }
      );

      console.log(res.data);

      // ✅ Corrected message check and alerts
      if (res.data.message === "User already exists") {
        alert("Username already exists. Please choose another one.");
      } else if (res.data.message === "User signed up successfully") {
        alert("Signup successful! You can now log in.");
        router.replace('/chat');
      }
    } catch (error) {
      console.error("Error in signup function:", error.message);
      alert("Something went wrong during signup. Try again later.");
    }
  };

  // ✅ Login function
  const loginFunc = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:8080/auth/login',
        { username, password },
        { withCredentials: true }
      );

      console.log(res.data);

      if (res.data.message === "Login successful") {
        router.replace('/chat');
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Error in login function:", error.message);
      alert("Something went wrong during login. Try again later.");
    }
  };

  return (
          <div className="mt-90 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Welcome
        </h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              onClick={signUpFunc}
              className="flex-1 m-1 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Sign Up
            </button>
            <button
              type="submit"
              onClick={loginFunc}
              className="flex-1 m-1 justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth
