"use client";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoSearch } from "react-icons/io5";
import TableSkeleton from "@/components/common/Loading/TableSkeleton";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import EditIcon from "@/components/common/EditIcon/EditIcon";
import DeleteIcon from "@/components/common/DeleteIcon/DeleteIcon";
import AccountPagination from "@/components/common/AccountPagination/AccountPagination";
import NotFound from "@/components/common/NotFound/NotFound";
import { useDebounce } from "@/hooks/useDebounce";

import {
  useDeleteTeamMutation,
  useGetAllTeamsQuery,
} from "@/redux/api/teamApi";

const AllTeamMembers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchValue, setSearchValue] = useState({});
  const debouncedQuery = useDebounce(searchQuery);

  const query = {
    search: debouncedQuery,
    ...searchValue,
  };

  const { data, error, isLoading, refetch } = useGetAllTeamsQuery(query);
  const [deleteTeam] = useDeleteTeamMutation();

  const teams = data?.data || [];

  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleSeeMore = (members) => {
    setSelectedTeamMembers(members);
    setOpenModal(true);
  };

  // DELETE HANDLER
  const handleDeleteTeam = async (team) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Delete team "${team?.name}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await deleteTeam(team?._id).unwrap();

        if (response?.success) {
          Swal.fire("Deleted!", "Team deleted successfully.", "success");
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
    <div className="md:px-6  p-4 pb-4 rounded-lg">
      <div className="bg-[#0D0E12] sticky top-[75px] md:top-[82px] z-[450] py-2 md:py-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
          <div className="w-full">
            <SectionTitle
              big_title="All Teams"
              title_one="Teams"
              link_one="/"
              title_two="All Teams"
              link_two="/teams"
            />
          </div>
          {/* Search input with icon */}
          <div className="flex items-center w-full justify-between md:justify-end gap-4">
            <div className="relative w-full max-w-xs">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for..."
                className="text-[14px] bg-[#14151A]  border border-[#26272F] rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
              />
            </div>
            {/* Link to create a new company */}
            <Link href="/team/add-team-member">
              <button className="btn w-[150px] md:w-64">Add Team</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full pt-2 mt-6">
        <h1 className="table_header">All Home Abouts</h1>
        <div className="overflow-x-auto w-full">
          <div className="table_section">
            <table className="w-full">
              <thead>
                <tr className="table_row">
                  <th className="table_th w-10">#</th>
                  <th className="table_th">Team Name</th>

                  <th className="table_th">Members</th>
                  <th className="table_th text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {teams?.length > 0 ? (
                  teams.map((team, index) => (
                    <tr key={index} className="tbody_tr">
                      <td className="table_th">{index + 1}</td>

                      <td className="table_th ">
                        <p>{team?.name}</p>
                      </td>

                      <td className="table_th">
                        {team?.members?.length > 0 ? (
                          <div className="flex flex-col  gap-1">
                            {team.members.slice(0, 2).map((m, i) => (
                              <p key={i} className="text-sm text-gray-300">
                                <span className="font-semibold">{m.name}</span>{" "}
                                - Role:{" "}
                                <span className="text-gray-300">{m.role}</span>
                                {" ("}
                                <span className="text-gray-300">
                                  Capacity:{" "}
                                  <span className="text-gray-300">
                                    {m.capacity}
                                  </span>
                                </span>
                                {")"}
                              </p>
                            ))}

                            {team?.members?.length > 2 && (
                              <button
                                onClick={() => handleSeeMore(team.members)}
                                className="text-blue-400 text-sm underline mt-1 cursor-pointer"
                              >
                                See More +
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500">No Members</span>
                        )}
                      </td>

                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <EditIcon
                            edit_link={`/team/edit-team-member/${team?._id}`}
                          />

                          <DeleteIcon
                            handleDelete={handleDeleteTeam}
                            item={team}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Display message when no companies match the search criteria
                  <tr>
                    <td
                      colSpan="10"
                      className="bg-black-base text-center py-6 text-red-600 text-2xl font-bold"
                    >
                      <NotFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
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
        {openModal && (
          <div className="fixed inset-0  flex items-center justify-center z-[9999]">
            <div className="bg-[#0D0E12] border border-[#1F2025] rounded-lg p-6 w-[90%] max-w-md">
              <h2 className="text-xl font-semibold text-white mb-4 text-center">
                Team Members
              </h2>

              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-scroll pr-2">
                {selectedTeamMembers.map((m, i) => (
                  <div
                    key={i}
                    className="border border-[#26272F] rounded-md p-3 bg-[#14151A]"
                  >
                    <p className="text-[15px] font-semibold text-white">
                      {m.name}
                    </p>

                    <p className="text-[13px] text-gray-400">
                      Role: <span className="text-gray-300">{m.role}</span>
                    </p>

                    <p className="text-[13px] text-gray-400">
                      Capacity:{" "}
                      <span className="text-gray-300">{m.capacity}</span>
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="btn w-full mt-4"
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

export default AllTeamMembers;
