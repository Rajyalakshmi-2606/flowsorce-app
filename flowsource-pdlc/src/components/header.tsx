"use client";
import React from "react";
import AppName from "./app-name";

import HeaderLogo from "./header-logo";

export default function Header() {


  return (
    <header>
      <nav className="navbar position-relative">
        <div className="container-fluid">
          <div className="row mx-0 w-100">
            <HeaderLogo />
            <div className="d-flex flex-column w-auto col-4 h4 text-white m-auto text-center">
              <div className="">
                <AppName />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
