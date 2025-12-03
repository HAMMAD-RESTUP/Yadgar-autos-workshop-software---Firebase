import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { generateBillNo } from "../firebase/firebaseMethods";
import {
  updateField,
  resetForm,
  saveJobSurvey,
} from "../redux/reducers/insuranceslice";

const MOCK_INSURANCE_COMPANIES = [
  "Adamjee Insurance Company Limited",
  "EFU General Insurance Limited",
  "Jubilee General Insurance Company Limited",
  "TPL Insurance Limited",
  "Askari General Insurance Company Limited",
  "IGI General Insurance Limited",
  "United Insurance Company of Pakistan Limited",
  "Pak-Qatar General Takaful Limited",
];

const formatTime12 = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  });

export default function JobFileSurveyForm() {
  const dispatch = useDispatch();
  const reduxFormData = useSelector((state) => state.jobSurvey.fields);
  const billNo = useSelector((state) => state.jobSurvey.fields.billNo);

  const [formData, setFormData] = useState({
    vehicleno: "",
    make: "",
    model: "",
    chassisno: "",
    mileage: "",
    lossno: "",
    customername: "",
    customercontact: "",
    surveyorcompany: "",
    surveyorname: "",
    surveyorcontact: "",
    insurancecompany: "",
    paid: false,
    ...reduxFormData,
  });

  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [time, setTime] = useState(formatTime12());
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchNextBill = async () => {
      const nextBill = await generateBillNo(false);
      dispatch(updateField({ field: "billNo", value: nextBill }));
    };
    fetchNextBill();
  }, [dispatch]);

  const fieldMap = {
    vehicleno: "vehicleno",
    make: "make",
    model: "model",
    chassisno: "chassisno",
    mileage: "mileage",
    lossno: "lossno",
    customername: "customername",
    customercontact: "customercontact",
    surveyorcompany: "surveyorcompany",
    surveyorname: "surveyorname",
    surveyorcontact: "surveyorcontact",
    insurancecompany: "insurancecompany",
    paid: "paid",
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    dispatch(updateField({ field: fieldMap[name], value: newValue }));

    if (name === "insurancecompany") {
      const filtered = value
        ? MOCK_INSURANCE_COMPANIES.filter((i) =>
            i.toLowerCase().includes(value.toLowerCase())
          )
        : [];
      setSuggestions(filtered);
    }
  };

  const handleSuggestionClick = (s) => {
    setFormData((prev) => ({ ...prev, insurancecompany: s }));
    dispatch(updateField({ field: "insurancecompany", value: s }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(saveJobSurvey()).unwrap();
      const newBill = await generateBillNo(true);
      dispatch(updateField({ field: "billNo", value: newBill }));
      alert("Job File saved! ID: " + result.id);
      dispatch(resetForm());
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-auto bg-gray-100 text-gray-900 text-xs sm:text-sm">

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
      >
        {/* COLUMN 1 */}
        <div className="p-4 rounded-2xl space-y-2 md:space-y-4 bg-white border border-gray-200 shadow">
          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Job File No</label>
            <input
              value={billNo}
              readOnly
              className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-200 border border-gray-300 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Vehicle Number *</label>
            <input
              type="text"
              name="vehicleno"
              value={formData.vehicleno}
              onChange={handleChange}
              placeholder="Vehicle Number"
              required
              className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-semibold">Loss Number</label>
            <input
              type="text"
              name="lossno"
              value={formData.lossno}
              onChange={handleChange}
              placeholder="Loss Number"
              className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="w-4 h-4 accent-blue-600"
            />
            <span className="font-medium text-sm">Mark as Paid</span>
          </label>
        </div>

        {/* COLUMN 2 + 3 */}
        <div className="lg:col-span-2 space-y-4">

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full sm:w-1/2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
            />

            <input
              type="text"
              value={time}
              readOnly
              className="w-full sm:w-1/2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-200 border border-gray-300 cursor-not-allowed"
            />
          </div>

          {/* Vehicle Info */}
          <div className="p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 bg-white border border-gray-200 shadow">
            {[
              { name: "make", label: "Make" },
              { name: "model", label: "Model" },
              { name: "chassisno", label: "Chassis Number" },
              { name: "mileage", label: "Mileage" },
              { name: "customername", label: "Customer Name" },
              { name: "customercontact", label: "Customer Contact" },
            ].map((f) => (
              <div key={f.name} className="flex flex-col space-y-1">
                <label className="font-semibold">{f.label}</label>
                <input
                  type="text"
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.label}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
                />
              </div>
            ))}
          </div>

          {/* Surveyor + Insurance */}
          <div className="p-4 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 bg-white border border-gray-200 shadow">
            {[
              { name: "surveyorcompany", label: "Surveyor Company" },
              { name: "surveyorname", label: "Surveyor Name" },
              { name: "surveyorcontact", label: "Surveyor Contact" },
            ].map((f) => (
              <div key={f.name} className="flex flex-col space-y-1">
                <label className="font-semibold">{f.label}</label>
                <input
                  type="text"
                  name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.label}
                  className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
                />
              </div>
            ))}

            <div className="relative col-span-1 md:col-span-2">
              <label className="font-semibold">Insurance Company</label>
              <input
                type="text"
                name="insurancecompany"
                value={formData.insurancecompany}
                onChange={handleChange}
                placeholder="Insurance Company"
                required
                className="w-full px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs sm:text-sm bg-gray-50 border border-gray-300"
              />

              {suggestions.length > 0 && (
                <ul className="absolute left-0 top-full mt-1 w-full rounded-xl shadow-lg bg-white border border-gray-300 z-50 max-h-40 overflow-auto">
                  {suggestions.slice(0, 6).map((s, i) => (
                    <li
                      key={i}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-600/20 transition text-xs sm:text-sm font-medium"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="lg:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 md:px-6 py-2 md:py-2.5 rounded-xl bg-cyan-600 text-white font-semibold hover:bg-cyan-700 shadow-md transition text-sm md:text-base"
          >
            Save Job File
          </button>
        </div>
      </form>
    </div>
  );
}
