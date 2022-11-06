import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import rootReducer from "./reducer/index";

const { NODE_ENV } = process.env;
const logger = createLogger({
  predicate: () => NODE_ENV !== "production",
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  devTools: NODE_ENV === "development",
});
