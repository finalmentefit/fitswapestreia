import React from "react";

export const Avatar = ({ src, alt = "avatar", size = 40, className = "" }) => {
  return (
    <img
      src={src || "/default-avatar.png"}
      alt={alt}
      className={rounded-full object-cover ${className}}
      style={{ width: size, height: size }}
    />
  );
};
