import { useState } from "react";
import Stepper from "./Stepper";
import { onboardingRequest } from "../network/services/formdata";
import { GeneratePlanRequest } from "../network/services/generateplan";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const QuestionnaireForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: "",
    ageGroup: "",
    currentWeight: "",
    height: "",
    weightUnit: "kg",
    heightUnit: "cm",
    targetWeight: "",
    targetWeightUnit: "kg",
    timeGoal: "",
    planType: "",
    activityLevel: "",
    yogaExperience: "",
    experienceDetails: "",
    workoutPreference: "",
    dietType: "",
    dietRestrictions: "",
    dietRestrictionsDetails: "",
    mealPreference: "",
    dietGoals: "",
    yogaType: "",
    workoutType: "",
    workoutDetails: "",
    workoutDays: "",
    medicalConditions: "",
    medicalDetails: "",
  });

  const totalSteps = 4;
  const steps = [
    "Basic Information",
    "Activity Preferences",
    "Dietary Preferences",
    "Additional Information",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (validateFields()) {
      if (step < totalSteps) setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const validateFields = () => {
    const newErrors = {};

    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.ageGroup) newErrors.ageGroup = "Age group is required.";
    if (!formData.currentWeight || formData.currentWeight <= 0)
      newErrors.currentWeight = "Enter a valid weight greater than 0.";
    if (!formData.height || formData.height <= 0)
      newErrors.height = "Enter a valid height greater than 0.";
    if (!formData.targetWeight || formData.targetWeight <= 0)
      newErrors.targetWeight = "Enter a valid target weight greater than 0.";
    if (!formData.timeGoal) newErrors.timeGoal = "Time goal is required.";

    if (step === 2) {
      if (!formData.planType) newErrors.planType = "Plan Type is required.";
      if (
        (formData.planType === "dietYoga" ||
          formData.planType === "dietYogaWorkout") &&
        !formData.yogaExperience
      )
        newErrors.yogaExperience = "Yoga Experience is required.";
      if (
        formData.yogaExperience === "Yes" &&
        !formData.experienceDetails?.trim()
      )
        newErrors.experienceDetails = "Yoga Experience Details are required.";
      if (
        (formData.planType === "DietYoga" ||
          formData.planType === "dietYogaWorkout") &&
        !formData.yogaType
      )
        newErrors.yogaType = "Yoga Type is required.";

      // Workout
      if (
        (formData.planType === "dietWorkout" ||
          formData.planType === "dietYogaWorkout") &&
        !formData.workoutPreference
      )
        newErrors.workoutPreference = "Workout Preference  is required.";
      if (
        formData.workoutPreference === "Other" &&
        !formData.workoutDetails?.trim()
      )
        newErrors.workoutDetails = "Workout Details are required.";
      if (
        (formData.planType === "dietWorkout" ||
          formData.planType === "dietYogaWorkout") &&
        !formData.workoutDays
      )
        newErrors.workoutDays = "Please select Workout Days. ";

      if (
        (formData.planType === "dietYoga" ||
          formData.planType === "dietWorkout" ||
          formData.planType === "dietYogaWorkout") &&
        !formData.activityLevel
      )
        newErrors.activityLevel = "Activity Level is required.";
    }

    // Step 3 validations
    if (step === 3) {
      if (!formData.dietType) newErrors.dietType = "Diet Type is required.";
      if (formData.dietType === "Other" && !formData.otherDietType?.trim())
        newErrors.otherDietType = "Diet Type Details are required.";
      if (!formData.dietRestrictions)
        newErrors.dietRestrictions = "Diet Restrictions are required.";
      if (
        formData.dietRestrictions === "Yes" &&
        !formData.dietRestrictionsDetails?.trim()
      )
        newErrors.dietRestrictionsDetails =
          "Diet Restriction Details are required.";
      if (!formData.mealPreference)
        newErrors.mealPreference = "Meal Preference is required.";
      if (!formData.dietGoals) newErrors.dietGoals = "Diet Goals are required.";
    }

    // Step 4 validations
    if (step === 4) {
      if (
        formData.medicalConditions === "Yes" &&
        !formData.medicalDetails?.trim()
      )
        newErrors.medicalDetails = "Medical Condition Details are required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User token not found. Please log in again.");
        }
        const response = await onboardingRequest(formData, token);

        if (response.success) {
          const { submitted_data } = response.data;

          const generatePlanResponse = await GeneratePlanRequest(
            submitted_data
          );

          if (generatePlanResponse.success) {
            navigate("/home");
          } else {
            console.error("Plan generation failed: ", generatePlanResponse);
          }
        } else {
          console.error("Onboarding failed: ", response);
        }
      } catch (error) {
        console.error("Error during onboarding:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <Stepper currentStep={step} steps={steps} />
      {isLoading && <LoadingScreen message="Generating your plan..." />}

      <form onSubmit={handleSubmit}>
        <div className="p-6 border rounded mt-4">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label>What is your gender?</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full mt-2 border px-4 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-sm">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label>What is your age group?</label>
                  <select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Below 18">Below 18</option>What is your
                    current weight?
                    <option value="18-30">18-30</option>
                    <option value="31-45">31-45</option>
                    <option value="46 and above">46 and above</option>
                  </select>
                  {errors.ageGroup && (
                    <p className="text-red-500 text-sm">{errors.ageGroup}</p>
                  )}
                </div>
                <div>
                  <label>What is your current weight?</label>
                  <div className="flex space-x-4">
                    <select
                      name="weightUnit"
                      value={formData.weightUnit}
                      onChange={handleInputChange}
                      className="border mt-2 px-4 py-2 rounded"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                    <input
                      type="number"
                      name="currentWeight"
                      value={formData.currentWeight}
                      onChange={handleInputChange}
                      className="flex-grow border px-4 py-2 rounded"
                      placeholder={`Enter weight in ${formData.weightUnit}`}
                    />
                  </div>
                  {errors.currentWeight && (
                    <p className="text-red-500 text-sm">
                      {errors.currentWeight}
                    </p>
                  )}
                </div>
                <div>
                  <label>What is your height?</label>
                  <div className="flex space-x-4">
                    <select
                      name="heightUnit"
                      value={formData.heightUnit}
                      onChange={handleInputChange}
                      className="border mt-2 px-4 py-2 rounded"
                    >
                      <option value="cm">cm</option>
                      <option value="inches">inches</option>
                    </select>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="flex-grow border px-4 py-2 rounded"
                      placeholder={`Enter height in ${formData.heightUnit}`}
                    />
                  </div>
                  {errors.height && (
                    <p className="text-red-500 text-sm">{errors.height}</p>
                  )}
                </div>
                <div>
                  <label>What is your target weight?</label>
                  <div className="flex space-x-4">
                    <select
                      name="targetWeightUnit"
                      value={formData.targetWeightUnit}
                      onChange={handleInputChange}
                      className="border mt-2 px-4 py-2 rounded"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                    <input
                      type="number"
                      name="targetWeight"
                      value={formData.targetWeight}
                      onChange={handleInputChange}
                      className="flex-grow border px-4 py-2 rounded"
                      placeholder={`Enter target weight in ${formData.targetWeightUnit}`}
                    />
                  </div>
                  {errors.targetWeight && (
                    <p className="text-red-500 text-sm">
                      {errors.targetWeight}
                    </p>
                  )}
                </div>
                <div>
                  <label>How soon do you want to achieve your goal?</label>
                  <select
                    name="timeGoal"
                    value={formData.timeGoal}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="1 Month">1 Month</option>
                    <option value="2 Months">2 Months</option>
                    <option value="3 Months or more">3 Months or more</option>
                  </select>
                  {errors.timeGoal && (
                    <p className="text-red-500 text-sm">{errors.timeGoal}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Activity Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label>What type of plan do you want?</label>
                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="diet">
                      Diet plan only (no workout or yoga)
                    </option>
                    <option value="dietYoga">Diet with yoga</option>
                    <option value="dietWorkout">Diet with workout</option>
                    <option value="dietYogaWorkout">
                      Diet with both yoga and workout
                    </option>
                  </select>
                  {errors.planType && (
                    <p className="text-red-500 text-sm">{errors.planType}</p>
                  )}
                </div>

                {/* Yoga Preferences */}
                {(formData.planType === "dietYoga" ||
                  formData.planType === "dietYogaWorkout") && (
                  <div>
                    <label>Do you have any previous yoga experience?</label>
                    <select
                      name="yogaExperience"
                      value={formData.yogaExperience}
                      onChange={handleInputChange}
                      className="w-full border px-4 mt-2 py-3 rounded"
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    {errors.yogaExperience && (
                      <p className="text-red-500 text-sm">
                        {errors.yogaExperience}
                      </p>
                    )}

                    {formData.yogaExperience === "Yes" && (
                      <div className="mt-4">
                        <label>Please describe your yoga experience:</label>
                        <input
                          type="text"
                          name="experienceDetails"
                          value={formData.experienceDetails}
                          onChange={handleInputChange}
                          className="w-full border px-4 mt-2 py-3 rounded"
                          placeholder="Describe your experience"
                        />
                      </div>
                    )}
                    {errors.experienceDetails && (
                      <p className="text-red-500 text-sm">
                        {errors.experienceDetails}
                      </p>
                    )}

                    <div className="mt-4">
                      <label>Which type of yoga do you prefer?</label>
                      <select
                        name="yogaType"
                        value={formData.yogaType || ""}
                        onChange={handleInputChange}
                        className="w-full border px-4 mt-2 py-3 rounded"
                      >
                        <option value="">Select</option>
                        <option value="Beginner-friendly (relaxation, stretching)">
                          Beginner-friendly (relaxation, stretching)
                        </option>
                        <option value="Intermediate (balance, flexibility)">
                          Intermediate (balance, flexibility)
                        </option>
                        <option value="Advanced (strength, endurance)">
                          Advanced (strength, endurance)
                        </option>
                      </select>
                      {errors.yogaType && (
                        <p className="text-red-500 text-sm">
                          {errors.yogaType}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Workout Preferences */}
                {(formData.planType === "dietWorkout" ||
                  formData.planType === "dietYogaWorkout") && (
                  <div>
                    <label>What type of workout do you prefer?</label>
                    <select
                      name="workoutPreference"
                      value={formData.workoutPreference}
                      onChange={handleInputChange}
                      className="w-full border px-4 mt-2 py-3 rounded"
                    >
                      <option value="">Select</option>
                      <option value="Strength training">
                        Strength training
                      </option>
                      <option value="Cardio">Cardio</option>
                      <option value="HIIT">
                        High-Intensity Interval Training (HIIT)
                      </option>
                      <option value="Other">Other (please specify)</option>
                    </select>
                    {errors.workoutPreference && (
                      <p className="text-red-500 text-sm">
                        {errors.workoutPreference}
                      </p>
                    )}

                    {formData.workoutPreference === "Other" && (
                      <div className="mt-4">
                        <label>Please specify:</label>
                        <input
                          type="text"
                          name="workoutDetails"
                          value={formData.workoutDetails || ""}
                          onChange={handleInputChange}
                          className="w-full border px-4 mt-2 py-3 rounded"
                          placeholder="Specify workout type"
                        />
                      </div>
                    )}
                    {errors.workoutDetails && (
                      <p className="text-red-500 text-sm">
                        {errors.workoutDetails}
                      </p>
                    )}

                    <div className="mt-4">
                      <label>
                        How many days a week are you willing to do workout?
                      </label>
                      <select
                        name="workoutDays"
                        value={formData.workoutDays || ""}
                        onChange={handleInputChange}
                        className="w-full border px-4 mt-2 py-3 rounded"
                      >
                        <option value="">Select</option>
                        <option value="2 Days">2 Days</option>
                        <option value="3-4 Days">3-4 Days</option>
                        <option value="5-6 Days">5-6 Days</option>
                      </select>
                      {errors.workoutDays && (
                        <p className="text-red-500 text-sm">
                          {errors.workoutDays}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Level */}
                {formData.planType && formData.planType !== "diet" && (
                  <div>
                    <label>What is your activity level currently?</label>
                    <select
                      name="activityLevel"
                      value={formData.activityLevel}
                      onChange={handleInputChange}
                      className="w-full border px-4 mt-2 py-3 rounded"
                    >
                      <option value="">Select</option>
                      <option value="Sedentary (little to no exercise)">
                        Sedentary (little to no exercise)
                      </option>
                      <option value="Lightly active (light exercise or walking)">
                        Lightly active (light exercise or walking)
                      </option>
                      <option value="Moderately active (exercise 3-5 days a week)">
                        Moderately active (exercise 3-5 days a week)
                      </option>
                      <option value="Very active (exercise 6-7 days a week)">
                        Very active (exercise 6-7 days a week)
                      </option>
                    </select>
                    {errors.activityLevel && (
                      <p className="text-red-500 text-sm">
                        {errors.activityLevel}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Dietary Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label>What type of diet do you follow?</label>
                  <select
                    name="dietType"
                    value={formData.dietType || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Halal">Halal</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Keto">Keto</option>
                    <option value="Other">Other (please specify)</option>
                  </select>
                  {errors.dietType && (
                    <p className="text-red-500 text-sm">{errors.dietType}</p>
                  )}

                  {formData.dietType === "Other" && (
                    <div className="mt-4">
                      <label>Please specify:</label>
                      <input
                        type="text"
                        name="otherDietType"
                        value={formData.otherDietType || ""}
                        onChange={handleInputChange}
                        className="w-full border px-4 mt-2 py-3 rounded"
                        placeholder="Specify diet type"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label>
                    Do you have any dietary restrictions or allergies?
                  </label>
                  <select
                    name="dietRestrictions"
                    value={formData.dietRestrictions || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes (please specify)</option>
                    <option value="No">No</option>
                  </select>
                  {errors.dietRestrictions && (
                    <p className="text-red-500 text-sm">
                      {errors.dietRestrictions}
                    </p>
                  )}
                  {formData.dietRestrictions === "Yes" && (
                    <div className="mt-4">
                      <label>Please specify:</label>
                      <input
                        type="text"
                        name="dietRestrictionsDetails"
                        value={formData.dietRestrictionsDetails || ""}
                        onChange={handleInputChange}
                        className="w-full border px-4 mt-2 py-3 rounded"
                        placeholder="Specify dietary restrictions or allergies"
                      />
                    </div>
                  )}
                  {errors.dietRestrictionsDetails && (
                    <p className="text-red-500 text-sm">
                      {errors.dietRestrictionsDetails}
                    </p>
                  )}
                </div>

                <div>
                  <label>How many meals a day do you prefer?</label>
                  <select
                    name="mealPreference"
                    value={formData.mealPreference || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="3 Meals">3 Meals</option>
                    <option value="5 Smaller Meals">5 Smaller Meals</option>
                    <option value="Flexible (based on plan recommendations)">
                      Flexible (based on plan recommendations)
                    </option>
                  </select>
                  {errors.mealPreference && (
                    <p className="text-red-500 text-sm">
                      {errors.mealPreference}
                    </p>
                  )}
                </div>

                <div>
                  <label>What are your key goals for the diet plan?</label>
                  <select
                    name="dietGoals"
                    value={formData.dietGoals || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Weight loss">Weight loss</option>
                    <option value="Muscle gain">Muscle gain</option>
                    <option value="Maintenance of current weight">
                      Maintenance of current weight
                    </option>
                    <option value="Improve overall Health">
                      Improve overall health
                    </option>
                  </select>
                  {errors.dietGoals && (
                    <p className="text-red-500 text-sm">{errors.dietGoals}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold mb-4">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label>
                    Do you have any medical conditions we should consider while
                    creating your plan?
                  </label>
                  <select
                    name="medicalConditions"
                    value={formData.medicalConditions || ""}
                    onChange={handleInputChange}
                    className="w-full border px-4 mt-2 py-3 rounded"
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes (please specify)</option>
                    <option value="No">No</option>
                  </select>

                  {formData.medicalConditions === "Yes" && (
                    <div className="mt-4">
                      <label>Please specify:</label>
                      <input
                        type="text"
                        name="medicalDetails"
                        value={formData.medicalDetails || ""}
                        onChange={handleInputChange}
                        className="w-full border px-4 mt-2 py-3 rounded"
                        placeholder="Specify medical conditions"
                      />
                    </div>
                  )}
                  {errors.medicalDetails && (
                    <p className="text-red-500 text-sm">
                      {errors.medicalDetails}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-4 py-2 rounded bg-gray-300 ${
              step === 1 ? "cursor-not-allowed" : "hover:bg-gray-400"
            }`}
          >
            Previous
          </button>
          {step === totalSteps ? (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded bg-green-700 text-white hover:bg-green-600"
            >
              Next
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default QuestionnaireForm;
