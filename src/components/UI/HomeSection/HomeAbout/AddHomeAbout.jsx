"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import Textarea from "@/components/common/Textarea/Textarea";
import FileInput from "@/components/common/FileInput/FileInput";
import { useCreateHomeAboutsMutation } from "@/redux/api/homeAboutApi";

const AddHomeAbout = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const router = useRouter();

  const [createProducts, { isLoading }] = useCreateHomeAboutsMutation();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("video_link", data.video_link);
      formData.append("description", data.description);
      if (data.thumbnail_image) {
        formData.append("thumbnail_image", data.thumbnail_image);
      }

      const res = await createProducts(formData).unwrap();

      if (res?.success) {
        reset();
        router.back();

        toast.success("Home About  added successfully!", {
          position: toast.TOP_RIGHT,
        });
      } else {
        toast.error(res.message, { position: toast.TOP_RIGHT });
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred", {
        position: toast.TOP_RIGHT,
      });
    }
  };

  return (
    <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
      <SectionTitle
        big_title={"Add Home About "}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/home-page/home-about/all-home-abouts"}
        title_two={"All Home About"}
        title_three={"Add Home About"}
        link_three={"/home-page/home-about/add-home-about"}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Create Home About Step by Step</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="cart-group grid grid-cols-1 items-end gap-y-2 gap-x-5">
            <Input
              placeholder="Enter Video Link"
              text="video_link"
              label="Video Link"
              register={register}
              required={false}
              errors={errors}
            />

            <Textarea
              placeholder="Enter Description"
              text="description"
              label="Description"
              required={false}
              register={register}
              errors={errors}
            />
            <FileInput
              placeholder="Choose File"
              text="thumbnail_image"
              label="Upload Thumbnail Image"
              register={register}
              required={false}
              setValue={setValue}
              errors={errors}
            />
          </div>

          <div>
            <button disabled={isLoading} className="btn" type="submit">
              {isLoading ? <FetchLoading /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddHomeAbout;
