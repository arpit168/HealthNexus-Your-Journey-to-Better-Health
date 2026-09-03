import React from "react";

const ResponsiveCard = ({
  children,
  className = "",
  hover = true,
  delay = 0,
}) => {
  return (
    <div
      className={`bg-white  rounded-2xl p-6 border border-gray-100  flex flex-col h-full
      ${hover ? "hover:shadow-xl transition-all duration-300 hover:-translate-y-1" : ""} 
      ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
  titleColor = "text-gray-900 ",
}) => (
  <div className="flex items-start justify-between mb-4 gap-4">
    <div className="flex-1 min-w-0">
      {" "}
      {/* min-w-0 ensures text truncation works */}
      {title && (
        <h3
          className={`text-lg font-bold truncate flex items-center gap-2 ${titleColor}`}
        >
          {Icon && <Icon className="w-5 h-5 shrink-0" />}
          <span className="truncate">{title}</span>
        </h3>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500  mt-1 line-clamp-2">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`flex-1 flex flex-col min-h-0 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = "" }) => (
  <div className={`mt-4 pt-4 border-t border-gray-100  shrink-0 ${className}`}>
    {children}
  </div>
);

export default ResponsiveCard;
