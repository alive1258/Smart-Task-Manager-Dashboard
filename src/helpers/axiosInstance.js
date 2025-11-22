// // import { getNewAccessToken } from "@/services/auth.services";
// // import axios from "axios";

// // // Create an instance of axios
// // const instance = axios.create({
// //   withCredentials: true, // Allow sending cookies with requests (for refresh tokens stored in cookies)
// //   timeout: 60000, // Set a global timeout (60 seconds) for all requests
// // });

// // // Flag to track refresh token request status and pending requests queue
// // let isRefreshing = false;

// // // Queue to hold pending requests while token is being refreshed
// // let pendingRequests = [];

// // /**
// //  * Response Interceptor
// //  *
// //  * Handles token expiration globally. If a request fails with 403 (Forbidden),
// //  * and the token hasn't already been refreshed, it attempts to refresh the token.
// //  * All other pending requests are queued and retried once the token is successfully refreshed.
// //  */
// // instance.interceptors.response.use(
// //   // On successful response, return it as-is
// //   function (response) {
// //     return response;
// //   },

// //   // On error response
// //   async function (error) {
// //     const config = error.config;

// //     // Check if error status is 400 (or another status your backend uses for token refresh)

// //     // and the retry flag `sent` is not yet set on the config object
// //     if (error.response?.status === 403 && !config.sent) {
// //       if (!isRefreshing) {
// //         isRefreshing = true;
// //         config.sent = true; // Avoid retrying same request multiple times

// //         try {
// //           // Attempt to refresh the access token
// //           await getNewAccessToken();

// //           // After refreshing, retry all pending requests
// //           pendingRequests.forEach((callback) => callback());
// //           pendingRequests = [];

// //           // Retry the original failed request
// //           return instance(config);
// //         } catch (refreshError) {
// //           // Token refresh failed; reject with the refresh error
// //           return Promise.reject(refreshError);
// //         } finally {
// //           isRefreshing = false;
// //         }
// //       }

// //       // If a refresh is already in progress, queue the request until refresh completes
// //       return new Promise((resolve) => {
// //         pendingRequests.push(() => resolve(instance(config)));
// //       });
// //     } else {
// //       // For other errors, format and return a consistent error structure
// //       // Return a structured error response
// //       const responseObject = {
// //         statusCode: error?.response?.status || 500,
// //         message: error?.response?.data?.message || "Something went wrong!",
// //       };
// //       return Promise.reject(responseObject);
// //     }
// //   }
// // );

// // export { instance };

// import { getNewAccessToken } from "@/services/auth.services";
// import axios from "axios";
// import { setToLocalStorage } from "@/hooks/local-storage";
// import { AUTH_KEY } from "@/constans/keys";

// const instance = axios.create({
//   withCredentials: true,
//   timeout: 60000,
// });

// let isRefreshing = false;
// let pendingRequests = [];

// // Handle token refresh
// instance.interceptors.response.use(
//   (response) => response,

//   async (error) => {
//     const originalRequest = error.config;

//     // ====================
//     // Case 1: Access token expired → 401
//     // ====================
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         originalRequest._retry = true;

//         try {
//           const res = await getNewAccessToken();
//           const newAccessToken = res?.data?.data?.accessToken;

//           // Save new access token
//           setToLocalStorage(AUTH_KEY, newAccessToken);

//           // Attach new token to all requests
//           instance.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${newAccessToken}`;

//           // Retry pending requests
//           pendingRequests.forEach((callback) => callback());
//           pendingRequests = [];

//           return instance(originalRequest);
//         } catch (refreshError) {
//           // Refresh failed → logout user
//           return Promise.reject({
//             statusCode: 403,
//             message: "Session expired. Please login again.",
//           });
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       // If refreshing already happening → queue current request
//       return new Promise((resolve) => {
//         pendingRequests.push(() => resolve(instance(originalRequest)));
//       });
//     }

//     // ==========================
//     // Case 2: refreshToken invalid → 403
//     // ==========================
//     if (error.response?.status === 403) {
//       return Promise.reject({
//         statusCode: 403,
//         message: "Session expired. Please login again.",
//       });
//     }

//     // ==========================
//     // Case 3: Other backend errors
//     // ==========================
//     return Promise.reject({
//       statusCode: error?.response?.status || 500,
//       message:
//         error?.response?.data?.message || "Something went wrong on server!",
//     });
//   }
// );

// export { instance };

// axiosInstance.js
import { getNewAccessToken } from "@/services/auth.services";
import axios from "axios";
import {
  setToLocalStorage,
  getFromLocalStorage,
  removeFromLocalStorage,
} from "@/hooks/local-storage";
import { AUTH_KEY } from "@/constans/keys";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 60000,
});

let isRefreshing = false;
let pendingRequests = [];

// Request interceptor to add access token
instance.interceptors.request.use(
  (config) => {
    const accessToken = getFromLocalStorage(AUTH_KEY);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve) => {
          pendingRequests.push(() => resolve(instance(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await getNewAccessToken();
        const newAccessToken = response?.data?.accessToken;

        if (newAccessToken) {
          // Store new access token
          setToLocalStorage(AUTH_KEY, newAccessToken);

          // Update authorization header
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry all pending requests
          pendingRequests.forEach((callback) => callback());
          pendingRequests = [];

          // Retry the original request
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        removeFromLocalStorage(AUTH_KEY);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If 403 (Forbidden) - token is invalid
    if (error.response?.status === 403) {
      removeFromLocalStorage(AUTH_KEY);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export { instance };
