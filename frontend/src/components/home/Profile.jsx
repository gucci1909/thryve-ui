import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, firstName } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex-1 overflow-y-auto px-5">
      <div className="flex flex-col items-center justify-start p-6 w-full max-w-md mx-auto mt-4">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-md">
          <span className="text-3xl text-blue-600 font-semibold">
            {firstName ? firstName[0].toUpperCase() : "U"}
          </span>
        </div>
        
        <div className="w-full bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Name</p>
              <p className="text-lg font-medium text-gray-700">{firstName || "Not provided"}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-lg font-medium text-gray-700 break-all">{email || "Not provided"}</p>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-medium text-gray-500 mb-1">Account Status</p>
              <p className="text-lg font-medium text-green-600">Active</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-8 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition duration-200 font-medium shadow-md hover:shadow-lg active:transform active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 