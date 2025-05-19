import AllRoutes from "./allRoutes/AllRoutes";
import SplashScreen from "./components/common/Splash";

function App() {
  return (
    <div className="app-container">
      <SplashScreen/>
      <AllRoutes />
    </div>
  );
}

export default App;
