"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import { useCreateProjectMutation } from "@/redux/api/projectsApi";
import { useGetAllTeamsQuery } from "@/redux/api/teamApi";

const CreateProject = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch all teams
  const { data: teamData, isLoading: teamLoading } = useGetAllTeamsQuery();

  // Create project mutation
  const [createProject, { isLoading }] = useCreateProjectMutation();

  // SUBMIT HANDLER
  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        team: formData.team,
      };

      const res = await createProject(payload).unwrap();

      if (res?.success) {
        toast.success("Project Created Successfully!");
        reset();
        router.push("/projects/all-projects");
      } else {
        toast.error(res?.message || "Failed to create project");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
      <SectionTitle
        big_title={"Create Project"}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/projects"}
        title_two={"All Projects"}
        title_three={"Create Project"}
        link_three={"/projects/create"}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Create Project</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
          {/* PROJECT NAME */}
          <Input
            placeholder="Enter Project Name"
            text="name"
            label="Project Name"
            register={register}
            required={true}
            errors={errors}
          />
          {/* TEAM DROPDOWN */}
          <div>
            <label className="label">Select Team</label>
            <select
              {...register("team", { required: true })}
              className="input w-full  px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md flex items-center justify-between cursor-pointer"
            >
              <option value="">Select a Team</option>

              {!teamLoading &&
                teamData?.data?.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
            </select>

            {errors.team && (
              <p className="text-red-500 text-sm mt-1">Team is required</p>
            )}
          </div>

          {/* DESCRIPTION */}

          {/* SUBMIT BUTTON */}
          <div>
            <button disabled={isLoading} className="btn" type="submit">
              {isLoading ? <FetchLoading /> : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateProject;
