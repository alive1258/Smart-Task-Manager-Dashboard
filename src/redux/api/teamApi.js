import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const TEAM_URL = "/team";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Mutation for creating a new  team
    createTeam: build.mutation({
      query: (data) => ({
        url: `${TEAM_URL}/create-team`,
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.team],
    }),

    // Query for fetching all team
    getAllTeams: build.query({
      query: (arg) => ({
        url: `${TEAM_URL}`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.team],
    }),

    // Query for fetching a single team by its ID
    getSingleTeam: build.query({
      query: (id) => ({
        url: `${TEAM_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.team],
    }),

    // Mutation for updating a single team by its ID
    updateTeam: build.mutation({
      query: ({ id, data }) => ({
        url: `${TEAM_URL}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [tagTypes.team],
    }),

    // Mutation for deleting a team by its ID
    deleteTeam: build.mutation({
      query: (id) => ({
        url: `${TEAM_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.team],
    }),
  }),
});

export const {
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useGetAllTeamsQuery,
  useGetSingleTeamQuery,
  useUpdateTeamMutation,
} = teamApi;
