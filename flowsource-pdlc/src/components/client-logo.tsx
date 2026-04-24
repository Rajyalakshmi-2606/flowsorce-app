import { fetchIntercept } from "../utils/api/common";
import React, { useEffect, useState } from "react";

const ClientLogo = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  useEffect(() => {
    const fetchSignedUrl = async () => {
      const url = `/api/get-signed-url`;
      const data = await fetchIntercept(url, {
        method: "GET",
      });
      setImageSrc(data.url);
    };
    fetchSignedUrl();
  }, []);
  if (!imageSrc) return <></>;
  return (
    <>
      <div className="h-100">
        <div id="client-logo" className={"vertical-line"}></div>
      </div>
      <div className="my-auto">
        <img
          src={imageSrc}
          alt="Client Logo"
          width={150}
          height={46}
          className="ms-3 logo client-logo"
        />
      </div>
    </>
  );
};

export default ClientLogo;
