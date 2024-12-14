import { useState } from "react";
import Typography from "../common/typography";
import "./index.css";
import { routes } from "@/router";
import { useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  function changeRoute(path: string) {
    navigate(path);
  }

  return (
    <footer className="navbar z-[4]">
      {routes
        .filter((route) => route.icon)
        .map((route) => (
          <div
            key={route.title}
            className={`tab ${pathname === route.path ? "active" : ""}`}
            onClick={() => changeRoute(route.path)}>
            {route.icon ? (
              <route.icon
                className="w-[29px] h-[21px] icon"
                fill="#999999"
              />
            ) : (
              <></>
            )}
            <Typography className="text-[10px]">{route.title}</Typography>
          </div>
        ))}
    </footer>
  );
}
