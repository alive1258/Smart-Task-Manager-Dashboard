import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const PROJECT_URL = "/projects";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Mutation for creating a new  projects
    createProject: build.mutation({
      query: (data) => ({
        url: `${PROJECT_URL}/create-project`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.projects],
    }),

    // Query for fetching all projects
    getAllProjects: build.query({
      query: (arg) => ({
        url: `${PROJECT_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.projects],
    }),

    // Query for fetching a single projects by its ID
    getSingleProject: build.query({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.projects],
    }),

    // Mutation for updating a single projects by its ID
    updateProject: build.mutation({
      query: ({ id, data }) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.projects],
    }),

    // Mutation for deleting a projects by its ID
    deleteProject: build.mutation({
      query: (id) => ({
        url: `${PROJECT_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.projects],
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useGetAllProjectsQuery,
  useGetSingleProjectQuery,
  useUpdateProjectMutation,
} = teamApi;
