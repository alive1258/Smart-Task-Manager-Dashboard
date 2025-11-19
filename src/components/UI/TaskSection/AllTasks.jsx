"use client";

import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import TableSkeleton from "@/components/common/Loading/TableSkeleton";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import EditIcon from "@/components/common/EditIcon/EditIcon";
import DeleteIcon from "@/components/common/DeleteIcon/DeleteIcon";
import NotFound from "@/components/common/NotFound/NotFound";
import AccountPagination from "@/components/common/AccountPagination/AccountPagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useDeleteTaskMutation,
  useGetAllTasksQuery,
} from "@/redux/api/tasksApi";

const AllTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState({});

  const { data, error, isLoading, refetch } = useGetAllTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks = data?.data || [];
  console.log(tasks, "    tasks");

  // DELETE HANDLER
  const handleDeleteTask = async (task) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete task "${task?.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await deleteTask(task?._id).unwrap();
        if (response?.success) {
          Swal.fire("Deleted!", "Task deleted successfully.", "success");
          refetch();
        } else {
          Swal.fire("Error!", response?.message, "error");
        }
      }
    } catch (error) {
      Swal.fire("Error!", error?.message || "Something went wrong", "error");
    }
  };

  if (isLoading) return <TableSkeleton />;

  if (error) {
    return (
      <div className="flex h-[85vh] w-full items-center justify-center">
        <h1>Error: {error?.message}</h1>
      </div>
    );
  }

  return (
    <div className="md:px-6 p-4 pb-4 rounded-lg">
      <div className="bg-[#0D0E12] sticky top-[75px] md:top-[82px] z-[450] py-2 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <SectionTitle
              big_title="All Tasks"
              title_one="Tasks"
              link_one="/"
              title_two="All Tasks"
              link_two="/tasks"
            />
          </div>

          <div className="flex items-center w-full justify-between md:justify-end gap-4">
            <div className="relative w-full max-w-xs">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="text-[14px] bg-[#14151A] border border-[#26272F] rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
            <Link href="/tasks/add-task">
              <button className="btn w-[150px] md:w-64">Add Task</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full pt-2 mt-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full">
            <thead>
              <tr className="table_row">
                <th className="table_th w-10">#</th>
                <th className="table_th">Title</th>
                <th className="table_th">Project</th>
                <th className="table_th">Assigned Member</th>
                <th className="table_th">Priority</th>
                <th className="table_th">Status</th>
                <th className="table_th text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks?.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task._id} className="tbody_tr">
                    <td className="table_th">{index + 1}</td>
                    <td className="table_th">{task.title}</td>
                    <td className="table_th">{task.project?.name}</td>
                    <td className="table_th">
                      {task.project?.team?.members?.length > 0
                        ? task.project.team.members
                            .map((m) => m.name)
                            .join(", ")
                        : "Unassigned"}
                    </td>

                    <td className="table_th">{task.priority}</td>
                    <td className="table_th">{task.status}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <EditIcon edit_link={`/tasks/edit/${task._id}`} />
                        <DeleteIcon
                          handleDelete={handleDeleteTask}
                          item={task}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="bg-black-base text-center py-6 text-red-600 text-2xl font-bold"
                  >
                    <NotFound />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.data?.meta?.totalPages > 0 && (
          <AccountPagination
            refetch={refetch}
            total={data?.data?.meta?.total}
            setSearchValue={setSearchValue}
            searchValue={searchValue}
            totalPage={data?.data?.meta?.totalPages}
            limit={data?.data?.meta?.limit}
            page={data?.data?.meta?.page}
          />
        )}
      </div>
    </div>
  );
};

export default AllTasks;
