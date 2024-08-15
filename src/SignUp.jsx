import React, { useState } from "react";
import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider } from "./config/firebase";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // You can add more user data to Firestore or update the profile here
      alert("Sign up successful!");
      navigate("/sign-in");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Sign up with Google successful!");
      navigate("/sign-in");
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="flex items-center justify-center px-5 py-5 md:p-0 min-h-screen bg-bg2 font-lora">
      <div className="bg-[#FFF9E6] p-8 rounded-tl-3xl rounded-br-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <hr className="flex justify-normal my-4  w-full bg-slate-300"></hr>
        <div className="flex justify-around text-center">
          <i>
            <h2 className="p-2 mb-5 font-montserat font-bold text-3xl text-bg2">
              Pantry<span className="text-bg3">Pal</span>
            </h2>
          </i>
        </div>

        <form className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <button
            onClick={handleSignUp}
            className="w-full p-3 bg-btn2 text-white rounded-md font-semibold transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <hr className="w-full border-gray-300" />
          <span className="px-4 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full p-3 bg-[#FF6B6B] text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <i className="fa-brands text-lg mr-5 fa-google"></i>
            Sign up with Google
          </button>
          <button className="flex items-center justify-center w-full p-3 bg-[#333333] text-white rounded-md hover:bg-gray-900 transition-colors">
            <i className="fa-brands text-lg mr-5 fa-github"></i>
            Sign up with GitHub
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-bg3 font-semibold hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
