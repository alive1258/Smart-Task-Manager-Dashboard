"use client";

import React, { useState } from "react";
import Link from "next/link";
import NotFound from "@/components/common/NotFound/NotFound";
import TableSkeleton from "@/components/common/Loading/TableSkeleton";
import DeleteIcon from "@/components/common/DeleteIcon/DeleteIcon";
import EditIcon from "@/components/common/EditIcon/EditIcon";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import { IoSearch } from "react-icons/io5";

import {
  useDeleteProjectMutation,
  useGetAllProjectsQuery,
} from "@/redux/api/projectsApi";
import { useDebounce } from "@/hooks/useDebounce";
import Swal from "sweetalert2";

const AllProjects = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);

  const { data, isLoading, error } = useGetAllProjectsQuery({
    search: debouncedQuery,
  });

  const [deleteProject] = useDeleteProjectMutation();
  const projects = data?.data || [];

  const [openMembers, setOpenMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleSeeMore = (members) => {
    setOpenMembers(members);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setOpenMembers([]);
  };

  const handleDeleteProject = async (project) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete project "${project?.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await deleteProject(project?._id).unwrap();

        if (response?.success) {
          Swal.fire("Deleted!", "Project deleted successfully.", "success");
        } else {
          Swal.fire(
            "Error!",
            response?.message || "Failed to delete.",
            "error"
          );
        }
      }
    } catch (error) {
      Swal.fire(
        "Error!",
        error?.data?.message || error?.message || "Something went wrong",
        "error"
      );
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <div>Error loading projects...</div>;

  return (
    <div className="md:px-6 p-4 pb-4 rounded-lg">
      {/* Sticky Header */}
      <div className="bg-[#0D0E12] sticky top-[75px] md:top-[82px] z-[450] py-2 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full">
            <SectionTitle
              big_title="All Projects"
              title_one="Dashboard"
              link_one="/"
              title_two="All Projects"
              link_two="/projects"
            />
          </div>

          <div className="flex items-center w-full justify-between md:justify-end gap-4">
            {/* Search Bar */}
            <div className="relative w-full max-w-xs">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project..."
                className="text-[14px] bg-[#14151A] border border-[#26272F] rounded-md py-2 pl-10 pr-4 focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>

            {/* Add Project Button */}
            <Link href="/projects/add-project">
              <button className="btn w-[150px] md:w-64">Add Project</button>
            </Link>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mx-auto w-full pt-2 mt-6">
        <h1 className="table_header">All Projects</h1>

        <div className="overflow-x-auto w-full">
          <div className="table_section">
            <table className="w-full">
              <thead>
                <tr className="table_row">
                  <th className="table_th w-10">#</th>
                  <th>Project Name</th>
                  <th>Team Info</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr key={project._id} className="tbody_tr">
                      {/* Index */}
                      <td className="table_th">{index + 1}</td>

                      {/* Project Name */}
                      <td className="table_th">
                        <p>{project?.name}</p>
                      </td>

                      {/* Team Info */}
                      <td className="table_th ">
                        <p className="font-semibold text-blue-300">
                          {project?.team?.name || "No Team Assigned"}
                        </p>

                        {/* Team Members */}
                        {project?.team?.members?.length > 0 ? (
                          <div className="flex flex-col gap-1 mt-1">
                            {project.team.members.slice(0, 2).map((m, i) => (
                              <p key={i} className="text-sm text-gray-300">
                                <span className="font-semibold">{m.name}</span>{" "}
                                – {m.role} (Cap: {m.capacity})
                              </p>
                            ))}

                            {project.team.members.length > 2 && (
                              <button
                                onClick={() =>
                                  handleSeeMore(project.team.members)
                                }
                                className="text-blue-400 text-xs underline cursor-pointer mt-1"
                              >
                                See More +
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No Members Found
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <EditIcon
                            edit_link={`/projects/edit-project/${project?._id}`}
                          />

                          <DeleteIcon
                            handleDelete={handleDeleteProject}
                            item={project}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-6">
                      <NotFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]">
            <div className="bg-black-base p-6 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-lg font-bold mb-3 text-white">
                Team Members
              </h2>

              <div className="space-y-2">
                {openMembers.map((m, i) => (
                  <div
                    key={i}
                    className="p-2 border border-gray-700 rounded text-gray-300"
                  >
                    <p>
                      <span className="font-semibold">{m.name}</span> — {m.role}
                    </p>
                    <p className="text-sm">Capacity: {m.capacity}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-blue-600 rounded text-white w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
