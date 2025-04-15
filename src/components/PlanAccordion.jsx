import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const PlanAccordion = ({ plan }) => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderContent = (content, level = 0) => {
    if (typeof content === "object" && content !== null) {
      if (Array.isArray(content)) {
        return (
          <div className="space-y-4">
            {content.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border border-gray-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {renderContent(item, level + 1)}
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(content).map(([key, value]) => (
            <div
              key={key}
              className="group overflow-hidden bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="p-3 bg-green-50 border-b border-gray-100">
                <span className="font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}:
                </span>
              </div>
              <div className="p-4 bg-white">
                {renderContent(value, level + 1)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Handle non-object values (e.g., strings, numbers)
    return (
      <div className="text-gray-600">
        {typeof content === "string" ? (
          <p className="hover:text-gray-800 transition-colors duration-200 leading-relaxed">
            {content}
          </p>
        ) : (
          <span className="font-medium text-gray-700">{String(content)}</span>
        )}
      </div>
    );
  };

  const renderBasicInfoItem = (label, value) => (
    <div className="p-4 bg-green-50 hover:bg-green-100 rounded-lg shadow-sm border border-gray-100 hover:border-green-300 transition-colors duration-200">
      <div className="font-medium text-sm text-gray-500 mb-1 capitalize">
        {label.replace(/_/g, " ")}
      </div>
      <div className="text-lg text-gray-800 font-medium">{value}</div>
    </div>
  );

  const renderAccordionSection = (key, content) => {
    const isBasicInfo = [
      "planType",
      "duration",
      "meals_per_day",
      "diet_type",
      "target_weight",
      "diet_goal",
    ].includes(key);

    if (isBasicInfo) {
      return null;
    }

    return (
      <div key={key} className="mb-4">
        <button
          onClick={() => toggleSection(key)}
          className={`w-full flex justify-between items-center p-4 bg-white hover:bg-green-50 rounded-lg shadow-sm border transition-all duration-200 ${
            openSections[key] ? "bg-green-50 border-green-500" : ""
          }`}
        >
          <span className="font-medium text-lg capitalize text-gray-800">
            {key.replace(/_/g, " ")}
          </span>
          {openSections[key] ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {openSections[key] && (
          <div className="mt-2 p-4 bg-white rounded-lg border border-green-100 shadow-sm">
            {renderContent(content)}
          </div>
        )}
      </div>
    );
  };

  const generatedPlan = plan.generated_plan;
  const basicInfo = [
    "planType",
    "duration",
    "meals_per_day",
    "diet_type",
    "target_weight",
    "diet_goal",
  ];
  const advancedSections = Object.keys(generatedPlan).filter(
    (key) => !basicInfo.includes(key)
  );

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-3 gap-4">
          {basicInfo.map(
            (key) =>
              generatedPlan[key] && renderBasicInfoItem(key, generatedPlan[key])
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-3">
          Detailed Plan
        </h3>
        {advancedSections.map(
          (key) =>
            generatedPlan[key] &&
            renderAccordionSection(key, generatedPlan[key])
        )}
      </div>
    </div>
  );
};

export default PlanAccordion;
