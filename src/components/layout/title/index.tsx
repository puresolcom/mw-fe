import React from "react";
import routerProvider from "@pankod/refine-react-router";
import { TitleProps } from "@pankod/refine";

const { Link } = routerProvider;

export const Title: React.FC<TitleProps> = ({ collapsed }) => (
  <Link to="/">
    {collapsed ? (
      <img
        src={"/refine-collapsed.svg"}
        alt="Mumz World"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 24px",
        }}
      />
    ) : (
      <img
        src={"/refine.svg"}
        alt="Mumz World"
        style={{
          width: "200px",
          padding: "12px 24px",
        }}
      />
    )}
  </Link>
);
