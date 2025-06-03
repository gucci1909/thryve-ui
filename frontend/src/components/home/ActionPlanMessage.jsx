import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ActionPlanMessage() {
  const firstName = useSelector((state) => state.user.firstName);
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate("/personalize-dashboard")}
      className="mt-4 cursor-pointer rounded-xl border-2 border-dashed border-[#0029ff] bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <p className="text-center text-gray-700">
        <span className="font-semibold text-[#0029ff]">{firstName}</span>, your Leadership Action Plan and SWOT Analysis report can be viewed in the Dashboard Tab
      </p>
    </div>
  );
}

export default ActionPlanMessage; 