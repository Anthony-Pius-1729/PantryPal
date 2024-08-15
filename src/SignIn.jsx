import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to home page after successful sign-in
      toast.success("Sign In successful");
      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.error("Error signing in. Please check your credentials.");
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Navigate to home page after successful Google sign-in
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error signing in with Google.");
    }
  };

  return (
    <div className="flex items-center justify-center px-5 py-5 md:p-0 min-h-screen bg-bg2 font-lora">
      <div className="bg-[#FFF9E6] p-8 rounded-tl-3xl rounded-br-3xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
        <hr className="flex justify-normal my-4 w-full bg-slate-400"></hr>
        <div className="flex justify-around text-center">
          <i>
            <h2 className="p-2 mb-5 font-montserat font-bold text-3xl text-bg2">
              Pantry<span className="text-bg3">Pal</span>
            </h2>
          </i>
        </div>

        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              value={email}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              value={password}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-bg3"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-btn2 text-white rounded-md font-semibold transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <hr className="w-full border-gray-300" />
          <span className="px-4 text-gray-500">or</span>
          <hr className="w-full border-gray-300" />
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleSignInWithGoogle}
            className="flex items-center justify-center w-full p-3 bg-[#FF6B6B] text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <i className="fa-brands text-lg mr-5 fa-google"></i>
            Sign in with Google
          </button>
          <button className="flex items-center justify-center w-full p-3 bg-[#333333] text-white rounded-md hover:bg-gray-900 transition-colors">
            <i className="fa-brands text-lg  mr-5 fa-github"></i>
            Sign in with GitHub
          </button>
          <button className="flex items-center justify-center w-full p-3 bg-[#0077B5] text-white rounded-md hover:bg-blue-800 transition-colors">
            <i className="fa-brands text-lg mr-5 fa-linkedin"></i>
            Sign in with LinkedIn
          </button>
          <button className="flex items-center justify-center w-full p-3 bg-[#4267B2] text-white rounded-md hover:bg-blue-700 transition-colors">
            <i className="fa-brands text-lg mr-5 fa-facebook"></i>
            Sign in with Facebook
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-bg3 font-semibold hover:underline"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
