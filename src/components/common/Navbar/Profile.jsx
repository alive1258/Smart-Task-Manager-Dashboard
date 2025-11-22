"use client";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignOutMutation } from "@/redux/api/authApi";

const Profile = ({ user }) => {
  const router = useRouter();
  const [signOut] = useSignOutMutation();
  const [activeModal, setActiveModal] = useState(false);

  const handleProfileModal = () => {
    setActiveModal(!activeModal);
  };

  // Simple cookie deletion function
  const deleteCookie = (name) => {
    if (typeof document === "undefined") return;
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Confirm Sign Out",
        text: "Are you sure you want to sign out of your account?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Sign Out",
      });

      if (result.isConfirmed) {
        const refreshToken = localStorage.getItem("refreshToken");
        console.log(refreshToken, "refreshToken");

        if (refreshToken) {
          // Remove from localStorage
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");

          // Remove cookies
          deleteCookie("refreshToken");
          deleteCookie("accessToken");

          router.push("/login");
          Swal.fire({
            title: "Signed Out",
            text: "You have successfully signed out of your account.",
            icon: "success",
          });
        } else {
          // If no refreshToken found, still clear everything
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("accessToken");
          deleteCookie("refreshToken");
          deleteCookie("accessToken");

          router.push("/login");
          Swal.fire({
            title: "Signed Out",
            text: "You have been signed out.",
            icon: "info",
          });
        }
      }
    } catch (error) {
      // Even if there's an error, clear all authentication data
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("accessToken");

      router.push("/login");
      Swal.fire({
        title: "Signed Out",
        text: "You have been signed out.",
        icon: "info",
      });
    }
  };

  return (
    <div className="relative w-full min-w-[180px]">
      <div
        onClick={handleProfileModal}
        className="w-full min-w-[180px] cursor-pointer  relative   group flex items-center gap-2 justify-between"
      >
        <div className="flex items-center space-x-2">
          {/* user?.photo  */}

          <div className="">
            <h6 className="text-[15px] font-semibold text-primary-muted">
              {user?.name}
            </h6>
            <span className="text-[13px] text-primary-muted">
              {" "}
              {user?.role}
            </span>
          </div>
        </div>
        {activeModal ? (
          <IoIosArrowUp className="text-[19px] text-white/70" />
        ) : (
          <IoIosArrowDown className="text-[19px] text-white/70" />
        )}
      </div>
      <ul
        className={`absolute right-0 top-[65px] w-full bg-[#19191F] rounded-md p-2 shadow-lg transition-all duration-300 ease-in-out ${
          activeModal
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <li className="text-[14px] text-white p-2 cursor-pointer hover:bg-[#222230]">
          Profile
        </li>
        <li className="text-[14px] text-white p-2 cursor-pointer hover:bg-[#222230]">
          Settings
        </li>

        <li
          onClick={handleLogout}
          className="text-[14px] text-white p-2 cursor-pointer hover:bg-[#222230]"
        >
          Logout
        </li>
      </ul>
    </div>
  );
};

export default Profile;
