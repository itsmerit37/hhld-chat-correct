'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Auth = () => {
  const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');

   const signUpFunc = async (event) => {
       event.preventDefault();


       try {
           const res = await axios.post('http://localhost:8080/auth/signup', {
               username: username,
               password: password
           })
           if(res.data.message === "Username already exists") {
               alert('Username already exists');
           } 
       } catch (error) {
           console.log("Error in signup function : ", error.message);
       }
   }


   const loginFunc = async (event) => {
       event.preventDefault();


       try {
           const res = await axios.post('http://localhost:8080/auth/login', {
               username: username,
               password: password
           })
          
           router.push('/chat')


       } catch (error) {
           console.log("Error in login function : ", error.message);
       }
   }


  return (
      <div className="mt-90 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
          <button
            onClick={signUpFunc}
            type="submit"
            className="m-3 w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign up
          </button>
          <button
          onClick={loginFunc}
            type="submit"
            className="m-3 w-1/2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
            </div>
        </form>
      </div>
  );
};

export default Auth;
