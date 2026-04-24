"use client";
import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./input/page";
import classes from "./style.module.css";
const dynamic = (importer: () => Promise<any>, _opts?: any) => {
  return React.lazy(importer);
};
import { CitationModel, ConversationPairModel } from "../types/chat";
import OverlayCitation from "../components/citation";
import classnames from "classnames";
import ChatMessages from "./messages/page";
import ChatInitial from "./messages/initial/page";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { selectConversation } from "../store/chat";
import { useApi, configApiRef, identityApiRef } from "@backstage/core-plugin-api";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { addConversation } from "../store/chat/conversation/slice";

const TIMEOUT_INITIAL_CHECK_MESSAGE = "Initial check timed out. You can still ask a question.";
const SERVICE_UNAVAILABLE_MESSAGE = "This plugin has not been configured with the required values. Please ask your administrator to configure it.";

const ChatCitation = dynamic(() => import("./chat-citation"), {
  ssr: false,
});

type ChatMainProps = { backendBaseApiUrl: string };
const ChatMain: React.FC<ChatMainProps> = ({ backendBaseApiUrl }) => {
  const [citationContent, setCitationContent] = useState<CitationModel | null>(
    null
  );
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [showServiceUnavailable, setShowServiceUnavailable] = useState(false);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true); // new: separate loading state
  const effectRanRef = useRef(false); // guard for strict mode double invoke (dev only)
  const conversation = useAppSelector(selectConversation);
  const dispatch = useAppDispatch();
  const config = useApi(configApiRef);
  const identityApi = useApi(identityApiRef);

  useEffect(() => {
    if (effectRanRef.current) return; 
    effectRanRef.current = true;

    let aborted = false;
    setInitialCheckDone(true);

    (async () => {
      try {
        const creds = await identityApi.getCredentials();
        if (aborted) return;
        const url = config.getString("backend.baseUrl") + "/api/flowsource-pdlc/pdlc";

        if (conversation.length === 0) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000); 
          let res: Response | undefined;
          try {
            res = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${creds.token}`,
              },
              body: JSON.stringify({}),
              signal: controller.signal,
            });
          } catch (fetchErr: any) {
            if (fetchErr?.name === 'AbortError') {
              // Treat as generic error (network slow)
              if (!aborted) {
                const timeoutConversation: ConversationPairModel = {
                  id: conversation.length + 1,
                  prompt: "",
                  response: { answer: TIMEOUT_INITIAL_CHECK_MESSAGE },
                  createdat: new Date().toISOString(),
                };
                dispatch(addConversation([timeoutConversation]));
              }
            } else {
              throw fetchErr;
            }
          } finally {
            clearTimeout(timeout);
          }

          if (!res || aborted) return;

          if (res.status === 503) {
            const errorConversation: ConversationPairModel = {
              id: 0,
              prompt: "",
              response: {
                answer: SERVICE_UNAVAILABLE_MESSAGE,
              },
              createdat: new Date().toISOString(),
            };
            dispatch(addConversation([errorConversation]));
            setShowServiceUnavailable(true);
          } else if (res.status !== 200) {
            const errorConversation: ConversationPairModel = {
              id: conversation.length + 1,
              prompt: "",
              response: {
                answer: `Error ${res.status}: ${res.statusText}`,
              },
              createdat: new Date().toISOString(),
            };
            dispatch(addConversation([errorConversation]));
          }
        }
      } catch (e: any) {
        if (!aborted) {
          const errorConversation: ConversationPairModel = {
            id: conversation.length + 1,
            prompt: "",
            response: {
              answer: `Unexpected error: ${e.message}`,
            },
            createdat: new Date().toISOString(),
          };
          dispatch(addConversation([errorConversation]));
        }
      } finally {
        if (!aborted) setIsCheckingConfig(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, []);

  return (
    <div className={classes["chat_container"]} style={{ height: "100vh", minHeight: 0 }}>
      <div className="main-content px-0" style={{ height: "100%" }}>
        <div className={`row ${classes["chat_panel"]} mx-0 h-100`} style={{ height: "100%" }}>
          <div className={`${classes["chat_right"]} m-0 p-0 col rounded`} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className={classes["chat_right_container"]} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              {showServiceUnavailable ? (
                <div className="px-4 pb-3" style={{ marginTop: "100px", zIndex: 2 }}>
                  <Card elevation={3}>
                    <CardHeader title={<Typography variant="h6">Error</Typography>} />
                    <Divider />
                    <CardContent style={{ padding: '12px 16px' }}>
                      <Paper role="alert" elevation={0}>
                        <Alert severity="error" style={{ margin: 0 }}>
                          {conversation[conversation.length - 1]?.response?.answer}
                        </Alert>
                      </Paper>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: "auto", minHeight: 0, position: 'relative' }}>
                    {isCheckingConfig ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <CircularProgress size={32} />
                      </div>
                    ) : (
                      <ChatMessages setCitationContent={setCitationContent} backendBaseApiUrl={backendBaseApiUrl} />
                    )}
                  </div>
                  {conversation.length === 0 && initialCheckDone && !isCheckingConfig && <ChatInitial />}
                  <ChatInput />
                  <OverlayCitation
                    showCitation={Boolean(citationContent)}
                    hideCitation={() => setCitationContent(null)}
                    className={classnames({
                      [classes["chat-modal-source-open"]]: citationContent?.type === "source",
                      [classes["chat-modal-faq-open"]]: citationContent?.type === "faq",
                    })}
                  >
                    <ChatCitation citationContent={citationContent} closeCitation={() => setCitationContent(null)} />
                  </OverlayCitation>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMain;
