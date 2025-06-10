import "../styles/Auth.css";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Signup = () => {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onsubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data
      );
      setMessage(res.data.message);
      reset();
      navigate("/login"); // Redirect to login after successful signup
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="screen">
          <div className="screen__content flex flex-column items-center justify-center">
            <form className="auth" onSubmit={handleSubmit(onsubmit)}>
              <div className="auth__field">
                <i className="auth__icon fas fa-user"></i>
                <CustomTextInput
                  name="email"
                  label="Email"
                  placeHolder="Enter your email"
                  control={control}
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
              <div className="auth__field">
                <i className="auth__icon fas fa-lock"></i>
                <CustomTextInput
                  name="password"
                  label="Password"
                  type="password"
                  placeHolder="Enter your password"
                  control={control}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message}
                  </span>
                )}
                <CustomTextInput
                  name="cpassword"
                  label="Confirm Password"
                  type="password"
                  placeHolder="Confirm your password"
                  control={control}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500 text-xs">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
              <button
                className="button auth__submit"
                type="submit"
                disabled={loading}
              >
                <span className="button__text">
                  {loading ? "Signing up..." : "Sign Up"}
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
              {message && (
                <div className="text-green-400 text-smtext-center  mt-2">
                  {message}
                </div>
              )}
              {error && (
                <div className="text-red-600 text-sm text-center mt-2">
                  {error}
                </div>
              )}
            </form>
            <span className="text-gray-100 text-sm text-center  w-full  p-2 ">
              I have an account
              <Link to={"/login"} className="text-green-300">
                {" "}
                Login
              </Link>
            </span>
          </div>
          <div className="screen__background">
            <span className="screen__background__shape screen__background__shape4"></span>
            <span className="screen__background__shape screen__background__shape3"></span>
            <span className="screen__background__shape screen__background__shape2"></span>
            <span className="screen__background__shape screen__background__shape1"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
