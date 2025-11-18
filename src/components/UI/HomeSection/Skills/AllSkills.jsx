"use client";

import Link from "next/link";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import Swal from "sweetalert2";
import NotFound from "@/components/common/NotFound/NotFound";
import AccountPagination from "@/components/common/AccountPagination/AccountPagination";
import TableSkeleton from "@/components/common/Loading/TableSkeleton";
import SectionTitle from "@/components/common/SectionTitle/SectionTitle";
import EditIcon from "@/components/common/EditIcon/EditIcon";
import DeleteIcon from "@/components/common/DeleteIcon/DeleteIcon";
import { truncateCharacters } from "@/utils/descriptionTextCounter";
import {
  useDeleteSkillsMutation,
  useGetAllSkillsQuery,
} from "@/redux/api/skillsApi";

const AllSkills = () => {
  const [searchValue, setSearchValue] = useState({
    search: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, isLoading, refetch } = useGetAllSkillsQuery(searchValue);
  const [deleteSkills] = useDeleteSkillsMutation();

  // Handler to update search query as user types
  const handleSearchChange = (e) => {
    setSearchValue({
      ...searchValue,
      search: e.target.value,
    });
    setSearchQuery(e.target.value);
  };

  // Filters companies based on the search query
  const filteredData = data?.data?.data;

  const handleDeleteSkills = async (faq) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Are you sure you want to delete the All Skills"${faq?.skill_title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const response = await deleteSkills(faq?.id).unwrap();
        if (response?.success) {
          Swal.fire({
            title: "Deleted!",
            text: `The AllSkills "${faq?.skill_title}" has been successfully deleted.`,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: `${response?.message}`,
            icon: "error",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: `An error occurred: ${error.data || error.message}`,
        icon: "error",
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return <TableSkeleton />;
  }

  // Render error state if there was an error fetching data
  // if (error) {
  //   return (
  //     <div className="flex h-[85vh] w-full items-center justify-center">
  //       <h1>Error: {error.message}</h1>
  //     </div>
  //   );
  // }

  return (
    <section className="md:px-6 px-4 mt-6 rounded-lg">
      {/* Table header */}
      <div className="flex items-center justify-between space-x-4">
        <div>
          <SectionTitle
            big_title={"All Skills"}
            link_one={"/"}
            title_one={"Home"}
            link_two={"/home-page/skills/all-skills"}
            title_two={"All Skills"}
            title_three={"Add Skills"}
            link_three={"/home-page/skills/add-skill"}
          />
        </div>
        {/* Search input with icon */}
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for..."
              className="bg-[#14151A]  border border-[#26272F] rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
          </div>
          {/* Link to create a new company */}
          <Link href="/home-page/skill/add-skill">
            <button className="btn w-64">Add Skills</button>
          </Link>
        </div>
      </div>
      <div className="mx-auto w-full pt-4">
        <div className="overflow-x-auto w-full">
          <h1 className="table_header">All Skills</h1>
          <div className="table_section">
            <table className="w-full">
              <thead>
                <tr className="table_row">
                  <th className="table_th w-4">#SL</th>
                  <th className="table_th ">Skills Category Title</th>
                  <th className="table_th ">Skill Title</th>
                  <th className="table_th">Skill Amount</th>

                  <th className="table_th text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.length > 0 ? (
                  filteredData?.map((item, index) => (
                    <tr key={item?.id} className="tbody_tr">
                      <td className="table_th">{index + 1}</td>
                      <td className="table_th">
                        <p>
                          {truncateCharacters(item?.skillsCategory?.title, 30)}
                        </p>
                      </td>
                      <td className="table_th">
                        <p>{truncateCharacters(item?.skill_title, 30)}</p>
                      </td>
                      <td className="table_th">
                        <p>{truncateCharacters(item?.skill_amount, 30)}</p>
                      </td>

                      <td className="my-2 px-4 text-center ">
                        <div className="flex items-center justify-center w-full gap-4">
                          <EditIcon
                            edit_link={`/home-page/skill/edit-skill/${item?.id}`}
                          />
                          <DeleteIcon
                            handleDelete={handleDeleteSkills}
                            item={item}
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
        <div className="pb-5">
          {data?.data?.meta?.totalPages > 1 && (
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
    </section>
  );
};

export default AllSkills;
