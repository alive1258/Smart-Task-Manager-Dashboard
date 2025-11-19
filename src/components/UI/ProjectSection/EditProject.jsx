"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";

import { useGetAllTeamsQuery } from "@/redux/api/teamApi";
import {
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} from "@/redux/api/projectsApi";

const EditProject = ({ id }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch all teams
  const { data: teamData, isLoading: teamLoading } = useGetAllTeamsQuery();

  // Fetch project details by ID to populate the form
  const { data: projectData, isLoading: projectLoading } =
    useGetSingleProjectQuery(id);

  // Update project mutation
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  // Populate form when projectData loads
  useEffect(() => {
    if (projectData?.data) {
      reset({
        name: projectData.data.name,
        team: projectData.data.team?._id,
      });
    }
  }, [projectData, reset]);

  // SUBMIT HANDLER
  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        team: data.team,
      };

      const res = await updateProject({ id, data: payload }).unwrap();

      if (res?.success) {
        toast.success("Project Updated Successfully!");
        router.back();
      } else {
        toast.error(res?.message || "Failed to update project");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.data?.message || error?.message || "Something went wrong"
      );
    }
  };

  if (projectLoading) return <FetchLoading />;

  return (
    <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
      <SectionTitle
        big_title={"Edit Project"}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/projects"}
        title_two={"All Projects"}
        link_three={`/projects/edit/${id}`}
        title_three={"Edit Project"}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Edit Project</h1>

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
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md flex items-center justify-between cursor-pointer"
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

          {/* SUBMIT BUTTON */}
          <div>
            <button disabled={isUpdating} className="btn" type="submit">
              {isUpdating ? <FetchLoading /> : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProject;
