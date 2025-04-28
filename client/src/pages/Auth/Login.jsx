import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/Inputs/Input";
import axoisInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";

function Login() {
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!(PhoneNumber)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!Password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axoisInstance.post(API_PATHS.AUTH.LOGIN, {
        PhoneNumber,
        Password,
      });

      const { token, Role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (Role === "Admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="w-[100%] w h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={PhoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            label={"Phone Number"}
            placeholder={"+213"}
            type={"text"}
          />
          <Input
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            label={"Password"}
            placeholder={"Min 8 Characters"}
            type={"password"}
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
