import toast from "react-hot-toast";

// Custom toast functions with your theme
export const showInfoToast = (message) => {
  return toast(message, {
    icon: "ℹ️",
    style: {
      border: "1px solid #0029ff",
      background: "#f0f4ff",
      color: "#0029ff",
      marginTop: "100px",
    },
  });
};

export const showSuccessToast = (message) => {
  return toast.success(message, {
    iconTheme: {
      primary: "#0029ff",
      secondary: "#fff",
      marginTop: "100px",
    },
    style: {
      border: "1px solid #0029ff",
      background: "#f0f4ff",
      color: "#0029ff",
    },
  });
};

// Export the default toast for other use cases
export { toast };
