"use client";

import React from "react";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import Link from "next/link";

const WorkingModule = () => {
  return (
    <div className="space-y-4">
      <Link
        href={"/"}
        className={`px-3 py-2 flex items-center text-[#ADB5BD] gap-2 rounded text-sm capitalize active-sidebar  hover:bg-[#111217]  duration-200  cursor-pointer `}
      >
        <MdOutlineDashboardCustomize className="text-lg md:text-[22px]" />
        <span className="text-[16px] capitalize whitespace-nowrap">
          {" "}
          Dashboard{" "}
        </span>
      </Link>
    </div>
  );
};

export default WorkingModule;
