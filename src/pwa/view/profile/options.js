import React from "react";
import { Link } from "react-router-dom";
const avatarClass = [
  {
    name: "avatar-1",
    url: require("../../assets/img/profile/profile-picture/profile-pic00.png"),
  },
  {
    name: "avatar-2",
    url: require("../../assets/img/profile/profile-picture/profile-pic01.png"),
  },
  {
    name: "avatar-3",
    url: require("../../assets/img/profile/profile-picture/profile-pic02.png"),
  },
  {
    name: "avatar-4",
    url: require("../../assets/img/profile/profile-picture/profile-pic03.png"),
  },
  {
    name: "avatar-5",
    url: require("../../assets/img/profile/profile-picture/profile-pic04.png"),
  },
];

const MenuItem = ({ to, onClick, name, className }) => {
  if (onClick && !to) {
    return (
      <button
        className={`profile-sa-menu--item item-${className}`}
        onClick={onClick}
      >
        <i></i>
        <p>
          {" "}
          {name} <span></span>
        </p>
      </button>
    );
  }

  return (
    <Link className={`profile-sa-menu--item item-${className}`} to={to} onClick={onClick}>
      <i></i>
      <p>{name}</p>
      <span></span>
    </Link>
  );
};

export { avatarClass, MenuItem };
