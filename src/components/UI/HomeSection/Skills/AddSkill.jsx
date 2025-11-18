"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import { useCreateSkillsMutation } from "@/redux/api/skillsApi";
import SelectAndSearch from "@/components/common/SelectAndSearch/SelectAndSearch";
import { useGetAllSkillsCategoriesQuery } from "@/redux/api/skillsCategoryApi";

const AddSkill = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();
  const router = useRouter();

  const [createSkills, { isLoading }] = useCreateSkillsMutation();
  const propertiesToRemove = ["skills_category_title"];

  const { data: skillsCategoriesData } = useGetAllSkillsCategoriesQuery({});

  const skillsCategoryData = skillsCategoriesData?.data?.data;

  const onSubmit = async (data) => {
    console.log(data, "data");
    try {
      propertiesToRemove?.forEach((property) => {
        delete data[property];
      });
      const res = await createSkills(data).unwrap();

      if (res?.success) {
        reset();
        router.back();
        toast.success("Skills added successfully!", {
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
        big_title={"Add Skills  "}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/home-page/skills/all-skills"}
        title_two={"All Skills "}
        title_three={"Add Skills "}
        link_three={"/home-page/skills/add-skills"}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Create Skills Step by Step</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          <div className="cart-group grid grid-cols-1  items-end gap-y-2 gap-x-5">
            <SelectAndSearch
              options={skillsCategoryData?.map((type) => ({
                id: type?.id,
                name: type?.title,
              }))}
              type_id={"skills_category_id"}
              type_name={"skills_category_title"}
              label="Select skills category"
              placeholder="Select a skills category"
              register={register}
              required={true}
              setValue={setValue}
              errors={errors}
              message={"project category is required"}
            />
            <Input
              placeholder="Enter Skills  Title"
              text="skill_title"
              label="Skills  Title"
              register={register}
              errors={errors}
            />
            <Input
              placeholder="Enter Skills  Amount"
              text="skill_amount"
              label="Skills  Amount"
              register={register}
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

export default AddSkill;
