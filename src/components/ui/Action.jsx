import React from "react";
import { cn } from "@/lib/utils";

export const ActionSize = {
  Small: "sm",
  Medium: "md", 
  Large: "lg",
  ExtraLarge: "xl",
};

export const IconPosition = {
  Before: 0,
  After: 1,
};

const getBaseClasses = () => {
  return "transition p-1.5 px-2 font-medium focus:outline-none flex-centered space-x-0.5 whitespace-nowrap";
};

const getStyleClasses = ({ button, outlined, iconButton, link, rounded, disabled, label, icon }) => {
  let classes = [];
  
  if (button && !link) {
    if (iconButton) {
      classes.push("rounded-full !p-2 aspect-square");
    } else if (rounded) {
      classes.push("rounded-full");
    } else {
      classes.push("rounded-md");
    }
  }
  
  if (disabled) {
    classes.push("opacity-50 cursor-not-allowed");
  } else {
    classes.push("clickable");
  }
  
  return classes.join(" ");
};

const getColorClasses = (color = "primary", outlined = false, iconButton = false, link = false) => {
  const colorMap = {
    primary: outlined 
      ? "border border-azure100 text-azure100 hover:bg-azure100 hover:text-white"
      : "bg-azure100 hover:bg-azure100 text-white stroke-white",
    secondary: outlined
      ? "border border-gray100 text-gray100 hover:bg-gray100 hover:text-white"
      : "bg-gray100 hover:bg-gray80 text-white stroke-white",
    success: outlined
      ? "border border-green text-green hover:bg-green hover:text-white"
      : "bg-green hover:bg-green text-white stroke-white",
    warning: outlined
      ? "border border-yellow75 text-yellow75 hover:bg-yellow75 hover:text-white"
      : "bg-yellow75 hover:bg-yellow75 text-white stroke-white",
    danger: outlined
      ? "border border-error text-error hover:bg-error hover:text-white"
      : "bg-error hover:bg-error text-white stroke-white",
    gray: outlined
      ? "border border-gray80 text-black50 hover:bg-gray80"
      : "bg-gray40 hover:bg-gray60 text-black50 stroke-black50",
    transparent: "bg-transparent hover:bg-gray40 text-black50 stroke-black50",
  };
  
  return colorMap[color] || colorMap.primary;
};

const getSizeClasses = (size = ActionSize.Medium, iconButton = false) => {
  if (iconButton) {
    const sizeMap = {
      [ActionSize.Small]: "!p-[5px]",
      [ActionSize.Medium]: "!p-[5px]",
      [ActionSize.Large]: "!p-2",
      [ActionSize.ExtraLarge]: "!p-3",
    };
    return sizeMap[size] || sizeMap[ActionSize.Medium];
  }
  
  const sizeMap = {
    [ActionSize.Small]: "text-[11px] px-2 py-1",
    [ActionSize.Medium]: "text-[13px] px-3 py-1.5",
    [ActionSize.Large]: "text-[14px] px-4 py-2",
    [ActionSize.ExtraLarge]: "text-[16px] px-6 py-3",
  };
  
  return sizeMap[size] || sizeMap[ActionSize.Medium];
};

export function Action({
  label,
  url,
  outlined = false,
  rounded = false,
  icon,
  iconPosition = IconPosition.Before,
  iconButton = false,
  button = true,
  link = false,
  onClick,
  className = "",
  disabled = false,
  loading = false,
  color = "primary",
  size = ActionSize.Medium,
  testId,
  type = "button",
  children,
  ...rest
}) {
  const baseClasses = getBaseClasses();
  const styleClasses = getStyleClasses({ button, outlined, iconButton, link, rounded, disabled, label, icon });
  const colorClasses = getColorClasses(color, outlined, iconButton, link);
  const sizeClasses = getSizeClasses(size, iconButton);
  
  const allClasses = cn(
    baseClasses,
    styleClasses,
    colorClasses,
    sizeClasses,
    className
  );
  
  const content = (
    <>
      {icon && iconPosition === IconPosition.Before && (
        <span className={iconButton ? "size-4" : "size-4"}>
          {icon}
        </span>
      )}
      {(label || children) && (
        <span>
          {label || children}
        </span>
      )}
      {icon && iconPosition === IconPosition.After && (
        <span className={iconButton ? "size-4" : "size-4"}>
          {icon}
        </span>
      )}
    </>
  );
  
  if (url && !disabled) {
    return (
      <a
        href={url}
        className={allClasses}
        data-testid={testId}
        {...rest}
      >
        {content}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      className={allClasses}
      onClick={onClick}
      disabled={disabled || loading}
      data-testid={testId}
      {...rest}
    >
      {loading ? (
        <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        content
      )}
    </button>
  );
}

export default Action;
