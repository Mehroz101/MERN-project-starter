import "../styles/Auth.css";
import CustomTextInput from "../components/FormComponents/CustomTextInput";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const {
    control,
    handleSubmit,
    reset,
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
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
      setMessage(res.data.message);
      // You can store token in localStorage or context here
      reset();
      localStorage.setItem("token", res.data.token);
      navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="screen">
          <div className="screen__content flex flex-column items-center justify-center">
            <form
              className="auth"
              onSubmit={handleSubmit(onsubmit)}
            >
              <div className="auth__field">
                <i className="auth__icon fas fa-user"></i>
                <CustomTextInput
                  name="email"
                  label="Email"
                  placeHolder="Enter your email"
                  control={control}
                  rules={{ required: "Email is required" }}
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
                  rules={{ required: "Password is required" }}
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs">
                  {errors.password.message}
                </span>
              )}
              <button className="button auth__submit">
                <span className="button__text">
                  {loading ? "Logging in..." : "Log In Now"}
                </span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
              {message && (
                <div className="text-green-600 text-sm mt-2">{message}</div>
              )}
              {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </form>
            <span className="text-gray-300 text-sm mt-4 text-center  w-full  p-2 ">
              I dont have an account
              <Link to={"/signup"} className="text-green-300"> signup</Link>
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

export default Login;
