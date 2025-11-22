"use client";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Input from "../common/Forms/Input";
import { useCreateUserMutation } from "@/redux/api/userApi";
import { ImSpinner10 } from "react-icons/im";
import { storeOTPData } from "@/redux/features/otpSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Strong password pattern
  const pattern = {
    value:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character",
  };

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [createUser, { isLoading }] = useCreateUserMutation();

  const onSubmit = async (data) => {
    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender, // Add gender field
    };

    try {
      const res = await createUser(user).unwrap();
      console.log(res, "API Response");

      if (res?.success) {
        // Store OTP data if needed
        if (res?.data) {
          dispatch(storeOTPData(res.data));
        }

        reset();
        toast.success(
          res?.message ||
            "Your account has been successfully created! Please verify your email.",
          {
            position: toast.TOP_RIGHT,
          }
        );

        router.push("/login");
      } else {
        toast.error(
          res?.message ||
            "We couldn't process your registration. Please try again.",
          {
            position: toast.TOP_RIGHT,
          }
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Something went wrong! Please check your details and try again.",
        {
          position: toast.TOP_RIGHT,
        }
      );
    }
  };

  return (
    <div
      className="text-white h-screen w-full flex items-center justify-center bg-[#0D0E12]"
      style={{
        backgroundImage: "url('/assets/images/signinBg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        height: "100vh",
      }}
    >
      <div
        className="absolute bottom-48 flex-shrink-0"
        style={{
          width: "922.908px",
          height: "922.908px",
          borderRadius: "922.908px",
          opacity: 0.3,
          backgroundColor: "#8AB8FB",
          filter: "blur(250px)",
        }}
      ></div>

      <div className="w-full max-w-md mx-4 bg-info-base border border-[#26272F] px-6 py-7 relative rounded-xl overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-full h-[4px] animated-gradient"></div>

        <h1 className="text-gradient text-xl font-semibold border-0 border-b border-b-[#26272F] pb-2 text-gradient">
          Sign Up
        </h1>

        <form className="w-full pt-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Input */}
          <Input
            placeholder="Enter your Name"
            text="name"
            label="Your Name"
            register={register}
            errors={errors}
            required={true}
          />

          {/* Email Input */}
          <Input
            placeholder="Enter your email"
            text="email"
            type="email"
            label="Email"
            register={register}
            errors={errors}
            required={true}
          />

          {/* Gender Select Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Gender
            </label>
            <select
              {...register("gender", {
                required: "Gender is required",
              })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-400 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <Input
            placeholder="Enter your password"
            text="password"
            type="password"
            label="Password"
            register={register}
            pattern={pattern}
            errors={errors}
            required={true}
          />

          {/* Confirm Password Input */}
          <Input
            placeholder="Enter your confirm password"
            text="confirmPassword"
            type="password"
            label="Confirm Password"
            register={register}
            errors={errors}
            validate={(value) =>
              value === watch("password") || "Passwords do not match"
            }
            required={true}
          />

          <button
            className="mt-4 btn w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <ImSpinner10 className="mx-auto w-5 h-5 animate-spin" />
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Login redirect link */}
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
