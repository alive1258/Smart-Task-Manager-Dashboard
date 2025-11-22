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
import { useGetTasksByProjectQuery } from "@/redux/api/tasksApi";

const AddTask = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [assignedMembers, setAssignedMembers] = useState([]);
  const [memberWorkload, setMemberWorkload] = useState({});
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);
  const [warningMember, setWarningMember] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  // Fetch all projects
  const { data: projectData, isLoading: projectLoading } =
    useGetAllProjectsQuery();

  // Mutation to create task
  const [createTask, { isLoading }] = useCreateTaskMutation();

  // Watch selected project and autoAssign checkbox
  const selectedProjectId = watch("project");
  const autoAssign = watch("autoAssign");

  // Fetch tasks for the selected project to calculate workload
  const { data: tasksData } = useGetTasksByProjectQuery(selectedProjectId, {
    skip: !selectedProjectId,
  });

  // Update assigned members and calculate workload when project changes
  useEffect(() => {
    if (selectedProjectId && projectData?.data) {
      const project = projectData.data.find((p) => p._id === selectedProjectId);
      const membersWithId = (project?.team?.members || []).map((m, idx) => ({
        ...m,
        _id: m._id || `member-${idx}`,
      }));
      setAssignedMembers(membersWithId);

      // Calculate current workload for each member
      if (tasksData?.data) {
        const workload = {};
        membersWithId.forEach((member) => {
          const memberTasks = tasksData.data.filter(
            (task) =>
              task.assignedTo?._id === member._id ||
              task.assignedTo?._id === member._id
          );
          workload[member._id] = memberTasks.length;
        });
        setMemberWorkload(workload);
      }
    } else {
      setAssignedMembers([]);
      setMemberWorkload({});
    }
  }, [selectedProjectId, projectData, tasksData]);

  // Handle auto-assign
  const handleAutoAssign = () => {
    if (assignedMembers.length === 0) return;

    // Find member with least load who has capacity
    const availableMembers = assignedMembers
      .map((member) => ({
        ...member,
        currentTasks: memberWorkload[member._id] || 0,
      }))
      .filter((member) => member.currentTasks < member.capacity)
      .sort((a, b) => a.currentTasks - b.currentTasks);

    if (availableMembers.length > 0) {
      const bestMember = availableMembers[0];
      setValue("assignedTo", bestMember._id);
      setSelectedMemberId(bestMember._id);
      toast.success(`Auto-assigned to ${bestMember.name}`);
    } else {
      // If all members are at capacity, pick the one with least overload
      const leastLoadedMember = assignedMembers
        .map((member) => ({
          ...member,
          currentTasks: memberWorkload[member._id] || 0,
        }))
        .sort((a, b) => a.currentTasks - b.currentTasks)[0];

      if (leastLoadedMember) {
        setValue("assignedTo", leastLoadedMember._id);
        setSelectedMemberId(leastLoadedMember._id);
        showCapacityWarningModal(leastLoadedMember);
      }
    }
  };

  // Handle member selection with capacity check
  const handleMemberSelect = (memberId) => {
    setSelectedMemberId(memberId);

    if (memberId) {
      const member = assignedMembers.find((m) => m._id === memberId);
      if (member) {
        const currentTasks = memberWorkload[member._id] || 0;

        if (currentTasks >= member.capacity) {
          showCapacityWarningModal({
            ...member,
            currentTasks: currentTasks,
          });
          return;
        }
      }
    }
  };

  // Show capacity warning modal
  const showCapacityWarningModal = (member) => {
    setWarningMember(member);
    setShowCapacityWarning(true);
  };

  // Handle capacity warning response
  const handleCapacityWarningResponse = (assignAnyway) => {
    if (assignAnyway) {
      // Continue with assignment
      setShowCapacityWarning(false);
      setWarningMember(null);
    } else {
      // Clear selection and let user choose another
      setValue("assignedTo", "");
      setSelectedMemberId("");
      setShowCapacityWarning(false);
      setWarningMember(null);
    }
  };

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

      // Assign member based on selection or auto-assign
      if (autoAssign) {
        // Auto-assign logic runs on submit to ensure latest data
        const availableMembers = assignedMembers
          .map((member) => ({
            ...member,
            currentTasks: memberWorkload[member._id] || 0,
          }))
          .filter((member) => member.currentTasks < member.capacity)
          .sort((a, b) => a.currentTasks - b.currentTasks);

        if (availableMembers.length > 0) {
          payload.assignedTo = availableMembers[0]._id;
        } else if (assignedMembers.length > 0) {
          // If no available capacity, assign to least loaded
          const leastLoaded = assignedMembers
            .map((member) => ({
              ...member,
              currentTasks: memberWorkload[member._id] || 0,
            }))
            .sort((a, b) => a.currentTasks - b.currentTasks)[0];
          payload.assignedTo = leastLoaded._id;
        }
      } else if (formData.assignedTo) {
        payload.assignedTo = formData.assignedTo;
      }

      console.log("Creating task with payload:", payload);

      const res = await createTask(payload).unwrap();

      if (res?.success) {
        toast.success("Task created successfully!");
        reset();
        router.back();
      } else {
        toast.error(res?.message || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // Get workload display for a member
  const getWorkloadDisplay = (memberId) => {
    const currentTasks = memberWorkload[memberId] || 0;
    const member = assignedMembers.find((m) => m._id === memberId);
    const capacity = member?.capacity || 0;

    return `${currentTasks}/${capacity}`;
  };

  // Check if member is over capacity
  const isMemberOverCapacity = (memberId) => {
    const currentTasks = memberWorkload[memberId] || 0;
    const member = assignedMembers.find((m) => m._id === memberId);
    return member && currentTasks >= member.capacity;
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

          {/* Assigned Member Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="label">Assign to Member</label>
              <button
                type="button"
                onClick={handleAutoAssign}
                disabled={assignedMembers.length === 0}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Auto-assign
              </button>
            </div>

            <select
              {...register("assignedTo")}
              onChange={(e) => handleMemberSelect(e.target.value)}
              className="input w-full px-4 h-[46px] bg-[#19191F] text-[#787F90] border border-[#26272F] rounded-md"
              disabled={autoAssign || assignedMembers.length === 0}
            >
              <option value="">Unassigned</option>
              {assignedMembers.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                  className={
                    isMemberOverCapacity(member._id) ? "text-red-400" : ""
                  }
                >
                  {member.name} ({getWorkloadDisplay(member._id)}){" "}
                  {isMemberOverCapacity(member._id) && "⚠️"}
                </option>
              ))}
            </select>

            {/* Member capacity info */}
            {selectedMemberId &&
              assignedMembers.find((m) => m._id === selectedMemberId) && (
                <div
                  className={`p-2 rounded text-sm ${
                    isMemberOverCapacity(selectedMemberId)
                      ? "bg-red-900/20 text-red-400 border border-red-800"
                      : "bg-green-900/20 text-green-400 border border-green-800"
                  }`}
                >
                  {assignedMembers.find((m) => m._id === selectedMemberId).name}{" "}
                  is currently at {getWorkloadDisplay(selectedMemberId)} tasks
                  {isMemberOverCapacity(selectedMemberId) &&
                    " - Over capacity!"}
                </div>
              )}
          </div>

          {/* Auto Assign Checkbox */}
          <div className="flex items-center gap-2 p-3 bg-gray-800 rounded">
            <input
              type="checkbox"
              {...register("autoAssign")}
              id="autoAssign"
              className="w-4 h-4"
            />
            <label htmlFor="autoAssign" className="text-sm">
              Auto-assign to member with most available capacity
            </label>
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
            <button
              disabled={isLoading}
              className="btn w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
              type="submit"
            >
              {isLoading ? <FetchLoading /> : "Create Task"}
            </button>
          </div>
        </form>
      </div>

      {/* Capacity Warning Modal */}
      {showCapacityWarning && warningMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E28] p-6 rounded-lg max-w-md w-full mx-4 border border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-red-500 text-xl">⚠️</div>
              <h3 className="text-lg font-semibold text-red-400">
                Capacity Warning
              </h3>
            </div>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold">{warningMember.name}</span> has{" "}
              {warningMember.currentTasks} tasks but capacity is{" "}
              {warningMember.capacity}.
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Assigning this task will overload {warningMember.name}.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => handleCapacityWarningResponse(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Choose Another
              </button>
              <button
                onClick={() => handleCapacityWarningResponse(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Assign Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AddTask;
