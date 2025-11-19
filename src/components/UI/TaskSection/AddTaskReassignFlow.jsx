"use client";
import React, { useEffect, useState } from "react";

import { useGetAllProjectsQuery } from "@/redux/api/projectsApi";
import {
  useCreateTaskMutation,
  useGetAllTasksQuery,
} from "@/redux/api/tasksApi";
import { toast } from "react-toastify";

const AddTaskReassignFlow = () => {
  const [selectedProject, setSelectedProject] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [overCapacityWarning, setOverCapacityWarning] = useState(null);
  const [autoAssignFlag, setAutoAssignFlag] = useState(false);

  const { data: projects } = useGetAllProjectsQuery();
  const { data: tasks, refetch } = useGetAllTasksQuery();
  const [createTask, { isLoading }] = useCreateTaskMutation();

  // Load team members when project changes
  useEffect(() => {
    if (!selectedProject) return;

    const project = projects?.data?.find((p) => p._id === selectedProject);
    if (project?.team?.members) {
      setTeamMembers(
        project?.team?.members?.map((m) => {
          // Count current tasks for this member
          const memberTasks = tasks?.data?.filter(
            (t) => t.assignedMember?.userId === m._id && t.status !== "Done"
          ).length;
          return { ...m, currentTasks: memberTasks };
        })
      );
    }
    setSelectedMember(null);
    setOverCapacityWarning(null);
  }, [selectedProject, projects, tasks]);

  const handleAssignMember = (member) => {
    if (member.currentTasks >= member.capacity) {
      setOverCapacityWarning({
        member,
        message: `${member.name} has ${member.currentTasks} tasks but capacity is ${member.capacity}. Assign anyway?`,
      });
    } else {
      setSelectedMember(member);
      setOverCapacityWarning(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProject) return toast.error("Select a project");
    if (!selectedMember && !autoAssignFlag)
      return toast.error("Select a member or auto-assign");

    const payload = {
      title: taskTitle,
      project: selectedProject,
      autoAssign: autoAssignFlag,
      forceAssign: overCapacityWarning ? true : false,
      ...(selectedMember && !autoAssignFlag
        ? {
            assignedMember: {
              userId: selectedMember._id,
              name: selectedMember.name,
              role: selectedMember.role,
            },
          }
        : {}),
    };

    try {
      await createTask(payload).unwrap();
      toast.success("Task created successfully");
      setTaskTitle("");
      setSelectedMember(null);
      setOverCapacityWarning(null);
      setAutoAssignFlag(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Add Task</h2>

      {/* Task Title */}
      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Project Selection */}
      <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Project</option>
        {projects?.data?.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Team Members */}
      {teamMembers.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold">Assign Member:</label>
          <ul className="mt-2">
            {teamMembers.map((m) => (
              <li
                key={m._id}
                className={`p-2 border rounded mb-2 cursor-pointer ${
                  selectedMember?._id === m._id
                    ? "bg-blue-100 border-blue-400"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleAssignMember(m)}
              >
                {m.name} ({m.currentTasks}/{m.capacity})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Over Capacity Warning */}
      {overCapacityWarning && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 rounded">
          <p>{overCapacityWarning.message}</p>
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => {
                setSelectedMember(overCapacityWarning.member);
                setOverCapacityWarning(null);
              }}
            >
              Assign Anyway
            </button>
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => setOverCapacityWarning(null)}
            >
              Choose Another
            </button>
          </div>
        </div>
      )}

      {/* Auto Assign */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          checked={autoAssignFlag}
          onChange={(e) => setAutoAssignFlag(e.target.checked)}
        />
        <span>Auto-assign to member with least load</span>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Task"}
      </button>
    </div>
  );
};

export default AddTaskReassignFlow;
