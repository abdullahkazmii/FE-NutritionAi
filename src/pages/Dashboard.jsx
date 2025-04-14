import Navbar from "../components/Navbar";
import QuestionnaireForm from "../components/QuestionnaireForm";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 my-3 bg-white shadow-lg max-w-5xl mx-auto rounded-md">
          <QuestionnaireForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
