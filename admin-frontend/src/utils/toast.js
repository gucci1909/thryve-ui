import toast from "react-hot-toast";

// Custom toast functions with your theme
export const showInfoToast = (message) => {
  return toast(message, {
    icon: "ℹ️",
    style: {
      border: "1px solid #0029ff",
      background: "#f0f4ff",
      color: "#0029ff",
    },
  });
};

export const showSuccessToast = (message) => {
  return toast.success(message, {
    iconTheme: {
      primary: "#0029ff",
      secondary: "#fff",
    },
    style: {
      border: "1px solid #0029ff",
      background: "#f0f4ff",
      color: "#0029ff",
    },
  });
};

export const showErrorToast = (message) => {
  return toast.error(message, {
    iconTheme: {
      primary: "#ef4444",
      secondary: "#fff",
    },
    style: {
      border: "1px solid #ef4444",
      background: "#fef2f2",
      color: "#dc2626",
    },
  });
};

// Export the default toast for other use cases
export { toast };
