const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold ${
              currentStep === index + 1
                ? "bg-green-700"
                : currentStep > index + 1
                ? "bg-green-400"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </div>
          <div>
            <span
              className={`text-sm ${
                currentStep === index + 1
                  ? "font-bold text-green-700"
                  : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                currentStep > index + 1 ? "bg-green-400" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;
