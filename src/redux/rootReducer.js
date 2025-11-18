import { persistReducer } from "redux-persist";
import authSlice from "./features/authSlice";
import otpSlice from "./features/otpSlice";
import adminSiteBerSlice from "./features/adminSiteBerSlice";
import storage from "redux-persist/lib/storage";
import { baseApi } from "./api/baseApi";

const persistConfig = {
  key: "root",
  storage,
};

const persistedAdminSideBarTree = persistReducer(
  persistConfig,
  adminSiteBerSlice
);
const persistedAuth = persistReducer(persistConfig, authSlice);
const persistedOtp = persistReducer(persistConfig, otpSlice);

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedAuth,
  otpTree: persistedOtp,
  adminTree: persistedAdminSideBarTree,
};
