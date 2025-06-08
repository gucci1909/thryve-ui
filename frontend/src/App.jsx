import { useEffect, useRef } from "react";
import AllRoutes from "./allRoutes/AllRoutes";
import SplashScreen from "./components/common/Splash";

function App() {
  const currentVersion = useRef(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch("/version.json", { cache: "no-store" });
        const { version } = await res.json();

        if (!currentVersion.current) {
          console.log("Current version:", version);
          currentVersion.current = version;
        } else if (currentVersion.current !== version) {
          console.log("Version changed, reloading app...");
          window.location.reload(true); // busts cache and reloads
        }
      } catch (err) {
        console.error("Version check failed", err);
      }
    };

    const intervalId = setInterval(checkVersion, 10000); // every 10 sec

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app-container">
      <SplashScreen />
      <AllRoutes />
    </div>
  );
}

export default App;
