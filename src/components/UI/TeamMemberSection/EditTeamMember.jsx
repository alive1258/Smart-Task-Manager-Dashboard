"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import {
  useGetSingleTeamQuery,
  useUpdateTeamMutation,
} from "@/redux/api/teamApi";

const EditTeamMember = ({ id }) => {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      members: [{ name: "", role: "", capacity: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const {
    data: teamData,
    isLoading: fetchLoading,
    error,
  } = useGetSingleTeamQuery(id, { skip: !id });

  const [updateTeam, { isLoading }] = useUpdateTeamMutation();

  // Load existing team data
  useEffect(() => {
    if (teamData?.data) {
      const team = teamData.data;
      setValue("name", team.name || "");
      setValue("members", team.members || []);
    }
  }, [teamData, setValue]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      members: data.members.map((m) => ({
        ...m,
        capacity: Number(m.capacity),
      })),
    };

    try {
      const res = await updateTeam({ id, data: formattedData }).unwrap();

      if (res?.success) {
        toast.success("Team Updated Successfully!");
        router.back();
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (fetchLoading)
    return (
      <div className="py-20">
        <FetchLoading />
      </div>
    );
  if (error) return <div>Error loading team.</div>;

  return (
    <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
      <SectionTitle
        big_title={"Edit Team"}
        link_one={"/"}
        title_one={"Home"}
        link_two={"/teams"}
        title_two={"All Teams"}
        title_three={"Edit Team"}
        link_three={`/teams/edit/${id}`}
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Edit Team Information</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
          {/* TEAM NAME */}
          <Input
            placeholder="Enter Team Name"
            text="name"
            label="Team Name"
            register={register}
            required={true}
            errors={errors}
          />

          {/* MEMBERS LIST */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Team Members</h2>

            {fields.map((member, index) => (
              <div
                key={member.id}
                className="border border-[#26272F] rounded-lg p-4 bg-[#14151A] space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Member Name"
                    placeholder="Enter Member Name"
                    text={`members.${index}.name`}
                    register={register}
                    required={true}
                    errors={errors}
                  />

                  <Input
                    label="Role"
                    placeholder="Ex: UX Engineer"
                    text={`members.${index}.role`}
                    register={register}
                    required={true}
                    errors={errors}
                  />

                  <div>
                    <label className="label">Capacity (0–5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      placeholder="0–5"
                      {...register(`members.${index}.capacity`, {
                        required: true,
                        min: 0,
                        max: 5,
                        valueAsNumber: true,
                      })}
                      className="input"
                    />

                    {errors.members?.[index]?.capacity && (
                      <p className="text-red-500 text-sm">
                        Capacity must be between 0–5
                      </p>
                    )}
                  </div>
                </div>

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="btn bg-red-600 hover:bg-red-700 w-full md:w-auto"
                  >
                    Remove Member
                  </button>
                )}
              </div>
            ))}

            {/* ADD NEW MEMBER */}
            <button
              type="button"
              className="btn bg-green-600 hover:bg-green-700"
              onClick={() => append({ name: "", role: "", capacity: 0 })}
            >
              + Add Another Member
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <div>
            <button disabled={isLoading} className="btn" type="submit">
              {isLoading ? <FetchLoading /> : "Update Team"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditTeamMember;
