"use client";
import React from "react";

import { useEffect } from "react";
import { logData } from "../utils/common";

export default function Layout({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    // Log the clearing of logout state from sessionStorage
    logData("info", { message: "Removing 'logout' flag from sessionStorage" });
    sessionStorage.removeItem("logout");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      // Log redirection when query parameters are detected
      logData("info", {
        message: "Detected query parameters in URL, redirecting to home page",
        search: window.location.search,
      });
      window.location.assign("/");
    }
  }, []);

  return <>{children}</>;
}

