"use client";

import { AiOutlineExclamationCircle } from "react-icons/ai";

const Textarea = ({
  label,
  text,
  placeholder,
  register,
  errors,
  required = true,
  height = "150px",
}) => {
  return (
    <div className="space-y-1">
      <label className="text-[15px] text-[#b5b7c8] ">
        <span>{label}</span>
        <abbr
          className={`${
            required ? "" : " opacity-0"
          } pl-1 text-lg  text-[#FF4234]`}
        >
          *
        </abbr>
      </label>
      <textarea
        style={{ minHeight: height }}
        className={`input_style sidebarScroll`}
        placeholder={placeholder}
        {...register(text, {
          required: required ? `${label} is required` : false,
        })}
      />
      {/* Error message */}
      <div>
        {errors?.[text] && (
          <div className="flex gap-1 items-center text-[#d3493f] text-xs">
            <AiOutlineExclamationCircle />
            <p role="alert">{errors[text]?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Textarea;
