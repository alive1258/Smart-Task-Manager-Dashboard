import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const TESTIMONIALS_URL = "/testimonials";

export const faqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Mutation for creating a new  testimonials
    createTestimonials: build.mutation({
      query: (data) => ({
        url: `${TESTIMONIALS_URL}`,
        method: "POST",
        data,
        contentType: "multipart/form-data",
      }),
      invalidatesTags: [tagTypes.testimonials],
    }),

    // Query for fetching all testimonials
    getAllTestimonials: build.query({
      query: (arg) => ({
        url: `${TESTIMONIALS_URL}/all-testimonials`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.testimonials],
    }),

    // Query for fetching a single testimonials by its ID
    getSingleTestimonial: build.query({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.testimonials],
    }),

    // Mutation for updating a single testimonials by its ID
    updateTestimonial: build.mutation({
      query: ({ id, data }) => ({
        url: `${TESTIMONIALS_URL}/${id}`,
        method: "PATCH",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: [tagTypes.testimonials],
    }),

    // Mutation for deleting a testimonials by its ID
    deleteTestimonial: build.mutation({
      query: (id) => ({
        url: `${TESTIMONIALS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.testimonials],
    }),
  }),
});

export const {
  useCreateTestimonialsMutation,
  useGetAllTestimonialsQuery,
  useGetSingleTestimonialQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
} = faqsApi;
