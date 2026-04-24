import { useCallback } from "react";

// You need to provide your own navigation and location logic.
// For example, using react-router-dom:
import { useNavigate, useLocation } from "react-router-dom";

export const useChatNavigationHook = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToChat = useCallback(
    (
      res: null | {
        isNewChat: boolean;
        data: string;
      }
    ) => {
      if (!res || !res?.isNewChat || !res.data) return;
      const params = new URLSearchParams(location.search);
      params.set("id", `${res.data || ""}`);
      navigate(`${location.pathname}?${params.toString()}`);
    },
    [navigate, location]
  );
  return navigateToChat;
};
