import React, { useState, useEffect, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import registerImage from "../assets/login.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import type { AppDispatch, RootState } from "../redux/store";

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const { user, guestId, loading, error } = useSelector(
    (state: RootState) => state.auth
  );
  const { cart } = useSelector((state: RootState) => state.cart);

  // Redirect logic
  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Redirect after successful registration
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId && user._id) {
        dispatch(
          mergeCart({
            guestId,
            userId: user._id, // ← correct field name
          })
        )
          .unwrap()
          .then(() => {
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          })
          .catch(() => {
            // Even if merge fails, still redirect
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, dispatch, navigate, isCheckoutRedirect]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium text-gray-800">The Wind</h2>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">
            Create an account 👋
          </h2>

          {error && (
            <p className="mb-4 text-center text-red-500 text-sm bg-red-50 py-2 rounded">
              {error}
            </p>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-black transition"
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-black transition"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:border-black transition"
              placeholder="Create a strong password"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Image Section */}
      <div className="hidden md:block w-1/2 bg-gray-800">
        <img
          src={registerImage}
          alt="Register"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
