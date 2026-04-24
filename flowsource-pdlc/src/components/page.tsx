import React, { useEffect, useRef } from "react";
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import ChatMain from "./chat-main";
import ImageContextProvider from "./context/image-context";
import ChatProvider from "./provider";
import {
  Header
} from '@backstage/core-components';

export default function Page() {
  const headerRef = useRef<HTMLDivElement>(null);
  const config = useApi(configApiRef);
  // Always use the full backend URL for API calls (no proxy)
  const backendBaseApiUrl = config.getString('backend.baseUrl') + '/api/flowsource-pdlc/pdlc';

  useEffect(() => {
    function setHeaderHeightVar() {
      const header = headerRef.current;
      if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
      }
    }
    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);
    return () => window.removeEventListener('resize', setHeaderHeightVar);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%", display: "flex", flexDirection: "column", overflowX: "hidden" }}>
      <ImageContextProvider backendBaseApiUrl={backendBaseApiUrl}>
        <div ref={headerRef}>
          <Header title="Agent Assist" />
        </div>
        <div id="citation-portal-modal"></div>
        <main className="main-content px-0" style={{ overflow: "hidden", display: "flex", flexDirection: "row", position: "relative", height: "100%" }}>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <ChatProvider logLevel={process.env.LOG_LEVEL} url={{ initial: '', prompt: '' }} />

            <ChatMain backendBaseApiUrl={backendBaseApiUrl} />
          </div>
        </main>
      </ImageContextProvider>
    </div>
  );
}