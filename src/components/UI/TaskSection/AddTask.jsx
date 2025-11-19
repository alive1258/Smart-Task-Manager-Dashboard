// "use client";

// import React, { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
// import Input from "@/components/common/Forms/Input";
// import FetchLoading from "@/components/common/Loading/FetchLoading";
// import { useGetAllProjectsQuery } from "@/redux/api/projectsApi";
// import { useCreateTaskMutation } from "@/redux/api/tasksApi";

// const AddTask = () => {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const [assignedMembers, setAssignedMembers] = useState([]);

//   // Fetch all projects
//   const { data: projectData, isLoading: projectLoading } =
//     useGetAllProjectsQuery();

//   // Mutation to create task
//   const [createTask, { isLoading }] = useCreateTaskMutation();

//   // Watch selected project and autoAssign checkbox
//   const selectedProjectId = watch("project");
//   const autoAssign = watch("autoAssign");

//   // Update assigned members when project changes
//   useEffect(() => {
//     if (selectedProjectId && projectData?.data) {
//       const project = projectData.data.find((p) => p._id === selectedProjectId);
//       const membersWithId = (project?.team?.members || []).map((m, idx) => ({
//         ...m,
//         _id: m._id || idx, // fallback to index if no _id
//       }));
//       console.log("Assigned members:", membersWithId);
//       setAssignedMembers(membersWithId);
//     } else {
//       setAssignedMembers([]);
//     }
//   }, [selectedProjectId, projectData]);

//   // Submit handler
//   const onSubmit = async (formData) => {
//     try {
//       const payload = {
//         title: formData.title,
//         description: formData.description,
//         project: formData.project,
//         assignedTo:
//           formData.autoAssign && assignedMembers.length > 0
//             ? assignedMembers[0]._id
//             : formData.assignedTo || undefined,
//         priority: formData.priority,
//         status: formData.status,
//       };
//       console.log(payload, "payload");

//       const res = await createTask(payload).unwrap();
//       console.log(res, "res");
//       return;

//       if (res?.success) {
//         toast.success("Task Created Successfully!");
//         reset();
//         router.back();
//       } else {
//         toast.error(res?.message || "Failed to create task");
//       }
//     } catch (error) {
//       toast.error(error?.data?.message || "Something went wrong");
//     }
//   };

//   return (
//     <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
//       <SectionTitle
//         big_title={"Create Task"}
//         link_one={"/"}
//         title_one={"Home"}
//         link_two={"/tasks"}
//         title_two={"All Tasks"}
//         title_three={"Create Task"}
//         link_three={"/tasks/create"}
//       />

//       <div className="add_form_section mt-2">
//         <h1 className="add_section_title">Create Task</h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
//           {/* Task Title */}
//           <Input
//             placeholder="Enter Task Title"
//             text="title"
//             label="Task Title"
//             register={register}
//             required={true}
//             errors={errors}
//           />

//           {/* Task Description */}
//           <div>
//             <label className="label">Description</label>
//             <textarea
//               {...register("description", { required: true })}
//               placeholder="Enter task description"
//               className="input w-full px-4 h-[100px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
//             />
//             {errors.description && (
//               <p className="text-red-500 text-sm mt-1">
//                 Description is required
//               </p>
//             )}
//           </div>

//           {/* Project Dropdown */}
//           <div>
//             <label className="label">Select Project</label>
//             <select
//               {...register("project", { required: true })}
//               className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
//             >
//               <option value="">Select a Project</option>
//               {!projectLoading &&
//                 projectData?.data?.map((project) => (
//                   <option key={project._id} value={project._id}>
//                     {project.name}
//                   </option>
//                 ))}
//             </select>
//             {errors.project && (
//               <p className="text-red-500 text-sm mt-1">Project is required</p>
//             )}
//           </div>

//           {/* Assigned Member Dropdown */}
//           <div>
//             <label className="label">Assign to Member</label>
//             <select
//               {...register("assignedTo")}
//               className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
//               disabled={autoAssign || assignedMembers.length === 0}
//             >
//               <option value="">Unassigned</option>
//               {assignedMembers.map((member) => (
//                 <option key={member._id} value={member._id}>
//                   {member.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Auto Assign Checkbox */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               {...register("autoAssign")}
//               id="autoAssign"
//             />
//             <label htmlFor="autoAssign">Auto Assign to first member</label>
//           </div>

//           {/* Priority Dropdown */}
//           <div>
//             <label className="label">Priority</label>
//             <select
//               {...register("priority", { required: true })}
//               className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
//             >
//               <option value="">Select Priority</option>
//               <option value="Low">Low</option>
//               <option value="Medium">Medium</option>
//               <option value="High">High</option>
//             </select>
//             {errors.priority && (
//               <p className="text-red-500 text-sm mt-1">Priority is required</p>
//             )}
//           </div>

//           {/* Status Dropdown */}
//           <div>
//             <label className="label">Status</label>
//             <select
//               {...register("status", { required: true })}
//               className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
//             >
//               <option value="">Select Status</option>
//               <option value="Pending">Pending</option>
//               <option value="In Progress">In Progress</option>
//               <option value="Done">Done</option>
//             </select>
//             {errors.status && (
//               <p className="text-red-500 text-sm mt-1">Status is required</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button disabled={isLoading} className="btn" type="submit">
//               {isLoading ? <FetchLoading /> : "Create Task"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default AddTask;

"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import Input from "@/components/common/Forms/Input";
import FetchLoading from "@/components/common/Loading/FetchLoading";
import { useGetAllProjectsQuery } from "@/redux/api/projectsApi";
import { useCreateTaskMutation } from "@/redux/api/tasksApi";

const AddTask = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [assignedMembers, setAssignedMembers] = useState([]);

  // Fetch all projects
  const { data: projectData, isLoading: projectLoading } =
    useGetAllProjectsQuery();

  // Mutation to create task
  const [createTask, { isLoading }] = useCreateTaskMutation();

  // Watch selected project and autoAssign checkbox
  const selectedProjectId = watch("project");
  const autoAssign = watch("autoAssign");

  // Update assigned members when project changes
  useEffect(() => {
    if (selectedProjectId && projectData?.data) {
      const project = projectData.data.find((p) => p._id === selectedProjectId);
      const membersWithId = (project?.team?.members || []).map((m, idx) => ({
        ...m,
        _id: m._id || idx, // fallback to index if no _id
      }));
      setAssignedMembers(membersWithId);
    } else {
      setAssignedMembers([]);
    }
  }, [selectedProjectId, projectData]);

  // Submit handler
  const onSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        project: formData.project,
        priority: formData.priority,
        status: formData.status,
      };

      // Assign member
      if (autoAssign && assignedMembers.length > 0) {
        payload.assignedTo = assignedMembers[0]._id;
      } else if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }
      console.log(payload, "payload");

      const res = await createTask(payload).unwrap();
      console.log(res, "res");
      return;

      if (res?.success) {
        toast.success("Task created successfully!");
        reset();
        router.back();
      } else {
        toast.error(res?.message || "Failed to create task");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="md:px-6 px-4 mt-6 pb-4 rounded-lg">
      <SectionTitle
        big_title="Create Task"
        link_one="/"
        title_one="Home"
        link_two="/tasks"
        title_two="All Tasks"
        title_three="Create Task"
        link_three="/tasks/create"
      />

      <div className="add_form_section mt-2">
        <h1 className="add_section_title">Create Task</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-6">
          {/* Task Title */}
          <Input
            placeholder="Enter Task Title"
            text="title"
            label="Task Title"
            register={register}
            required
            errors={errors}
          />

          {/* Task Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              {...register("description", { required: true })}
              placeholder="Enter task description"
              className="input w-full px-4 h-[100px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                Description is required
              </p>
            )}
          </div>

          {/* Project Dropdown */}
          <div>
            <label className="label">Select Project</label>
            <select
              {...register("project", { required: true })}
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
            >
              <option value="">Select a Project</option>
              {!projectLoading &&
                projectData?.data?.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
            </select>
            {errors.project && (
              <p className="text-red-500 text-sm mt-1">Project is required</p>
            )}
          </div>

          {/* Assigned Member Dropdown */}
          <div>
            <label className="label">Assign to Member</label>
            <select
              {...register("assignedTo")}
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
              disabled={autoAssign || assignedMembers.length === 0}
            >
              <option value="">Unassigned</option>
              {assignedMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Auto Assign Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register("autoAssign")}
              id="autoAssign"
            />
            <label htmlFor="autoAssign">Auto Assign to first member</label>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="label">Priority</label>
            <select
              {...register("priority", { required: true })}
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
            >
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">Priority is required</p>
            )}
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="label">Status</label>
            <select
              {...register("status", { required: true })}
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">Status is required</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button disabled={isLoading} className="btn" type="submit">
              {isLoading ? <FetchLoading /> : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddTask;
