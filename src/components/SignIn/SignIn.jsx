"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ImSpinner10 } from "react-icons/im";
import { useSignInMutation } from "@/redux/api/authApi";
import Input from "../common/Forms/Input";
import { instance } from "@/helpers/axiosInstance";

const setCookie = (name, value, days) => {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  const secure = process.env.NODE_ENV === "production" ? ";Secure" : "";
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict${secure}`;
};

const SignIn = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [signIn, { isLoading }] = useSignInMutation();

  const onSubmit = async (data) => {
    try {
      const res = await signIn(data).unwrap();
      if (res?.success && res?.data?.accessToken) {
        // Save accessToken in memory or localStorage
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // Set cookie
        setCookie("refreshToken", res.data.refreshToken, 7);

        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
        toast.success(res.message);
        reset();
        router.push("/"); // Redirect to home page
      }
    } catch (error) {
      console.log(error, "error.............");
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className=" flex items-center justify-center h-screen bg-[#0D0E12]"
      style={{
        backgroundImage: "url('/assets/images/signinBg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        width: "100%",
        height: "60vh",
      }}
    >
      {/* Background Blur Circle */}
      <div
        className="absolute bottom-48  flex-shrink-0"
        style={{
          width: "922.908px",
          height: "922.908px",
          borderRadius: "922.908px",
          opacity: 0.3,
          backgroundColor: "#8AB8FB", // You can customize this color if needed
          filter: "blur(250px)",
        }}
      ></div>

      <div className="md:px-6 relative z-10">
        <div className="md:w-[556px] w-[350px] top-20 md:top-48 mx-auto bg-info-base border border-[#26272F] px-6 py-12 relative rounded-xl overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 w-full h-[4px] animated-gradient"></div>
          <div>
            <h4 className="text-xl font-semibold border-0 border-b border-b-[#26272F] pb-2 text-gradient">
              Login Now
            </h4>

            <form onSubmit={handleSubmit(onSubmit)} className="pt-4 space-y-2">
              <Input
                placeholder="Enter your email"
                text="email"
                type="email"
                label="Email"
                register={register}
                errors={errors}
              />
              <Input
                type="password"
                placeholder="Enter your password"
                text="password"
                label="Password"
                register={register}
                errors={errors}
              />
              <div className="flex items-center justify-end mt-3 px-[1px]">
                <Link
                  className="text-[16px] text-blue-base font-semibold"
                  href="/forget-password"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="text-center">
                <button
                  className="mt-4 btn w-full cursor-pointer"
                  type="submit"
                >
                  {isLoading ? (
                    <ImSpinner10 className="mx-auto w-5 h-5 animate-spin" />
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="pt-6">
            <p className="text-primary-muted">
              <span className="text-blue-base text-[16px] font-semibold">
                {/* <Link href="/reset-password">Reset Password</Link> */}
                <Link href="/sign-up">Sign up here</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
