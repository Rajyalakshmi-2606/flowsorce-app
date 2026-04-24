import React from "react";
import ClientLogo from "./client-logo";

const HeaderLogo = () => {
  return (
    <div className="col-3 px-0 d-flex flex-row">
      <a className="d-block" href="/">
        <img
          src="/images/logo.png"
          alt="Cognizant Neuro AI"
          width={150}
          height={46}
          className="ms-3 logo"
        />
      </a>
      <ClientLogo />
    </div>
  );
};

export default HeaderLogo;
