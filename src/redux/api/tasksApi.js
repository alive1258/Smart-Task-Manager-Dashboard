import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const TASK_URL = "/tasks";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Mutation for creating a new  tasks
    createTask: build.mutation({
      query: (data) => ({
        url: `${TASK_URL}/create-task`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.tasks],
    }),

    // Query for fetching all tasks
    getAllTasks: build.query({
      query: (arg) => ({
        url: `${TASK_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.tasks],
    }),

    // Query for fetching a single tasks by its ID
    getSingleTask: build.query({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tasks],
    }),

    // Mutation for updating a single tasks by its ID
    updateTask: build.mutation({
      query: ({ id, data }) => ({
        url: `${TASK_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.tasks],
    }),
    // Query: Get tasks by project ID
    getTasksByProject: build.query({
      query: (projectId) => ({
        url: `${TASK_URL}/project/${projectId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.tasks],
    }),

    // Mutation for deleting a tasks by its ID
    deleteTask: build.mutation({
      query: (id) => ({
        url: `${TASK_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.tasks],
    }),
    autoReassignTasks: build.mutation({
      query: (projectId) => ({
        url: `${TASK_URL}/auto-reassign/${projectId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.tasks],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
  useAutoReassignTasksMutation,
  useGetTasksByProjectQuery,
} = tasksApi;
