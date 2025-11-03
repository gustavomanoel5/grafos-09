import "./Container.css";

const Container = ({ 
  children, 
  maxWidth = "xl", 
  padding = "medium",
  className = "" 
}) => {
  const containerClasses = [
    "custom-container",
    `max-width--${maxWidth}`,
    `padding--${padding}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

export default Container;