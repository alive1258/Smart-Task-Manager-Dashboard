"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCreateHomeHerosMutation } from "@/redux/api/homeHeroApi";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import Textarea from "@/components/common/Textarea/Textarea";
import FileInput from "@/components/common/FileInput/FileInput";

const AddHomeHero = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const router = useRouter();

  const [createHomeHero, { isLoading }] = useCreateHomeHerosMutation();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("class_name", data.class_name);
      formData.append("course_name", data.course_name);
      formData.append("cv_link", data.cv_link);
      formData.append("description", data.description);
      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const res = await createHomeHero(formData).unwrap();

      if (res?.success) {
        reset();
        router.back();
        toast.success("Home Hero  added successfully!", {
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
        big_title={"Add Home Hero "}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/home-page/home-hero/all-home-heros"}
        title_two={"All Home Hero"}
        title_three={"Add Home Hero"}
        link_three={"/home-page/home-hero/add-home-hero"}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Create Home Hero Step by Step</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="cart-group grid grid-cols-1 lg:grid-cols-2 items-end gap-y-2 gap-x-5">
            <Input
              placeholder="Enter Your Name"
              text="name"
              label="Your Name"
              register={register}
              errors={errors}
            />
            <Input
              placeholder="Enter Class Name"
              text="class_name"
              label="Class Name "
              register={register}
              errors={errors}
            />
            <Input
              placeholder="Enter Course Name"
              text="course_name"
              label="Course Name"
              register={register}
              errors={errors}
            />
            <Input
              placeholder="Enter Cv Link"
              text="cv_link"
              label="Cv Link"
              register={register}
              required={false}
              errors={errors}
            />
            <div className="md:col-span-2">
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
                text="photo"
                label="Upload Photo"
                register={register}
                required={false}
                setValue={setValue}
                errors={errors}
              />
            </div>
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

export default AddHomeHero;
