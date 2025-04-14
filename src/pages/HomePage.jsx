import { useState, useEffect } from "react";
import { getPlan } from "../network/services/GetPlan";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import PlanAccordion from "../components/PlanAccordion";
import { FaTimes, FaPlus } from "react-icons/fa";
import { MdOutlineFitnessCenter } from "react-icons/md";
import LoadingScreen from "../components/LoadingScreen";

const HomePage = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        setIsLoading(true);
        const response = await getPlan();

        if (response.success && response.data.length > 0) {
          const plansWithParsedData = response.data.map((plan) => ({
            ...plan,
            generated_plan:
              typeof plan.generated_plan === "string"
                ? JSON.parse(plan.generated_plan)
                : plan.generated_plan,
          }));
          const sortedPlans = plansWithParsedData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          setPlans(sortedPlans);
          setSelectedPlan(sortedPlans[0]);
        }
      } catch (err) {
        console.error("Error fetching user plans:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading your fitness plans..." />;
  }

  if (plans.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center transform hover:scale-105 transition-transform duration-300">
            <div className="mb-8">
              <MdOutlineFitnessCenter className="mx-auto text-6xl text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-black bg-clip-text text-transparent">
              Start Your Fitness Journey
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              You currently do not have any fitness plans. Create your first
              personalized plan to begin your transformation!
            </p>
            <button
              onClick={() => navigate("/form")}
              className="bg-gradient-to-r from-black to-green-700 text-white font-semibold py-3 px-8 rounded-full hover:opacity-90 transition-all duration-300 flex items-center justify-center mx-auto gap-2"
            >
              <FaPlus className="text-sm" />
              Create Your First Plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 flex relative">
        {/* Mobile Hamburger Button */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="text-black p-2 bg-white rounded-lg shadow-lg"
          >
            <span className="block w-6 h-1 bg-black mb-1"></span>
            <span className="block w-6 h-1 bg-black mb-1"></span>
            <span className="block w-6 h-1 bg-black"></span>
          </button>
        </div>

        {/* Content wrapper */}
        <div className="flex flex-1 w-full h-full">
          {/* Sidebar */}
          <aside
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 fixed md:relative w-full md:w-1/5 bg-white border-r-2 border-green-600 shadow-lg transition-transform duration-300 ease-in-out z-40 md:z-0 h-[calc(100vh-64px)]`}
          >
            <div className="sticky top-0 p-6 h-full overflow-y-auto">
              <div className="md:hidden flex justify-end mb-4">
                <button
                  onClick={toggleSidebar}
                  className="text-black text-2xl p-2"
                >
                  <FaTimes />
                </button>
              </div>

              <h2 className="text-2xl text-black font-bold mb-6 flex items-center justify-between">
                Your Plans
                <FaPlus
                  onClick={() => navigate("/form")}
                  className="text-green-600 cursor-pointer hover:text-green-700 transition-all"
                  size={20}
                />
              </h2>
              <ul className="space-y-4">
                {plans.map((plan) => (
                  <li
                    key={plan.id}
                    onClick={() => handlePlanClick(plan)}
                    className={`cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                      selectedPlan?.id === plan.id
                        ? "bg-gradient-to-r from-black to-green-700 text-white"
                        : "hover:bg-gradient-to-r hover:from-black hover:to-green-700 hover:text-white text-black"
                    }`}
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium capitalize flex items-center">
                        <MdOutlineFitnessCenter className="mr-2" />
                        {plan.plan_type}
                      </span>
                      <span className="text-sm opacity-80 flex items-center ml-6">
                        Created: {formatDate(plan.created_at)}
                      </span>
                      {plan.goal_time && (
                        <span className="text-sm opacity-80 flex items-center ml-6">
                          Goal: {plan.goal_time}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 md:p-10 bg-white overflow-y-auto h-[calc(100vh-64px)]">
            {selectedPlan ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2 capitalize flex items-center">
                  <MdOutlineFitnessCenter className="mr-2" />
                  {selectedPlan.plan_type} Plan
                </h2>
                <div className="text-sm text-gray-500 mb-4 ml-8">
                  Created on {formatDate(selectedPlan.created_at)}
                </div>
                <PlanAccordion plan={selectedPlan} />
              </div>
            ) : (
              <p className="text-gray-500 text-lg">
                Select a plan from the sidebar to view details.
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
