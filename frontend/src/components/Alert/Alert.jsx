import "./Alert.css";
import { 
  IoCheckmarkCircleOutline, 
  IoWarningOutline, 
  IoInformationCircleOutline, 
  IoCloseCircleOutline,
  IoCloseOutline
} from "react-icons/io5";

const Alert = ({ 
  severity = "info", 
  children, 
  onClose,
  className = "",
  title
}) => {
  const icons = {
    success: IoCheckmarkCircleOutline,
    warning: IoWarningOutline,
    info: IoInformationCircleOutline,
    error: IoCloseCircleOutline
  };

  const Icon = icons[severity];

  const alertClasses = [
    "custom-alert",
    `custom-alert--${severity}`,
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={alertClasses} role="alert">
      <div className="custom-alert__content">
        <div className="custom-alert__icon">
          <Icon size={20} />
        </div>
        
        <div className="custom-alert__message">
          {title && <div className="custom-alert__title">{title}</div>}
          <div className="custom-alert__text">{children}</div>
        </div>

        {onClose && (
          <button 
            className="custom-alert__close"
            onClick={onClose}
            aria-label="Fechar alerta"
            type="button"
          >
            <IoCloseOutline size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;