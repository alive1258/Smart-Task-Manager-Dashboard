"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import TableSkeleton from "@/components/common/Loading/TableSkeleton";
import {
  useGetSingleSkillsQuery,
  useUpdateSkillsMutation,
} from "@/redux/api/skillsApi";
import SelectAndSearch from "@/components/common/SelectAndSearch/SelectAndSearch";
import { useGetAllSkillsCategoriesQuery } from "@/redux/api/skillsCategoryApi";

const EditSkill = ({ id }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const {
    data: skillData,
    isLoading: fetchLoading,
    error,
    refetch,
  } = useGetSingleSkillsQuery(id, { skip: !id });
  const [updateSkills, { isLoading }] = useUpdateSkillsMutation();
  const propertiesToRemove = ["skills_category_title"];

  const { data: skillsCategoriesData } = useGetAllSkillsCategoriesQuery({});

  const skillsCategoryData = skillsCategoriesData?.data?.data;
  console.log(skillsCategoryData, "skillsCategoryData");

  const router = useRouter();

  useEffect(() => {
    if (skillData) {
      const { skillsCategory } = skillData?.data;

      if (skillsCategory) {
        setValue("skills_category_id", skillsCategory?.id);
        setValue("skills_category_title", skillsCategory?.title);
      }

      setValue("skill_title", skillData.data.skill_title || "");
    }
    if (skillData) {
      setValue("skill_amount", skillData.data.skill_amount || "");
    }
  }, [skillData, setValue]);

  const onSubmit = async (data) => {
    try {
      propertiesToRemove?.forEach((property) => {
        delete data[property];
      });
      const res = await updateSkills({ id, data }).unwrap(); // ✅ FIXED

      if (res?.success) {
        router.back();
        toast.success("Skills  updated successfully!", {
          position: toast.TOP_RIGHT,
        });
        refetch();
      } else {
        toast.error(res.message, { position: toast.TOP_RIGHT });
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred", {
        position: toast.TOP_RIGHT,
      });
    }
  };
  // Sometimes browser caches the image and doesn’t refetch it even if it's updated. To fix this, add a query param:
  // useEffect(() => {
  //   if (id) refetch();
  // }, [id]);

  if (fetchLoading) return <TableSkeleton />;
  if (error) return <div>Error: {error?.message}</div>;
  return (
    <section className="md:px-6 px-4 mt-6 rounded-lg">
      <div>
        <SectionTitle
          big_title={"Edit Skills "}
          title_one={"Home"}
          link_one={"/"}
          title_two={"All Skills "}
          link_two={"/home-page/skills/all-skills"}
          link_three={`/home-page/skills/edit-skill/${id}`}
          title_three={"Edit Skills"}
        />
      </div>

      <div className="add_form_section mt-4">
        <h1 className="add_section_title">Edit Skills Step by Step</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="my-5">
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
              placeholder="Enter Skills  title"
              text="skill_title"
              label="Skills  title"
              register={register}
              errors={errors}
            />
            <Input
              placeholder="Enter Skills  Amount"
              text="skill_amount"
              type="number"
              label="Skills  Amount"
              register={register}
              errors={errors}
            />
          </div>

          <div className="pt-4">
            <button disabled={isLoading} className="btn" type="submit">
              {isLoading ? <FetchLoading /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditSkill;
