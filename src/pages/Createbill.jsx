import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ArrowLeft, Hammer, Wrench, Plus, Trash2, FileText, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Insurancebill from "../insuranceComponents/Insurancebill";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  updateItem,
  removeItem,
  updatePercent,
} from "../redux/reducers/insuranceslice";

// ====================================================================
// HARDCODED SUGGESTIONS DATA
// ====================================================================

const SUGGESTIONS = {
  parts: [
    { name: "Front Bumper Cover", price: 5500 },
    { name: "Headlight Assembly (Left)", price: 8200 },
    { name: "Fender (Right)", price: 3100 },
    { name: "Radiator Grille", price: 2500 },
    { name: "Windshield Glass", price: 7800 },
  ],
  labour: [
    { name: "Dent Repair & Painting (Major)", price: 6000 },
    { name: "Bumper Replacement", price: 1500 },
    { name: "Wheel Alignment", price: 800 },
    { name: "Electrical Diagnosis", price: 1200 },
  ],
};

// ====================================================================
// Reusable Suggestion Dropdown Component
// ====================================================================

const SuggestionDropdown = ({ suggestions, onSelect, section }) => {
    if (suggestions.length === 0) return null;

    const color = section === 'parts' ? 'text-emerald-700 hover:bg-emerald-50' : 'text-blue-700 hover:bg-blue-50';

    return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
                <div
                    key={index}
                    onClick={() => onSelect(suggestion)}
                    // Ensure the dropdown is above other content using z-index
                    className={`flex justify-between items-center p-2 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${color}`}
                >
                    <span className="text-sm font-medium">{suggestion.name}</span>
                    <span className="text-sm font-mono opacity-80">₨{suggestion.price.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

// ====================================================================
// Reusable Component for Item Row UI (Parts/Labour)
// ====================================================================

const ItemRow = React.memo(({ item, index, section, handleItemChange, handleRemoveItem, itemInputClass, itemInputFocus, itemPriceClass, itemQtyPriceBorder }) => {
    // Local state to handle suggestions visibility
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Filter suggestions based on current input name
    const filteredSuggestions = useMemo(() => {
        if (!item.name || item.name.length < 2) return [];
        return SUGGESTIONS[section].filter(s =>
            s.name.toLowerCase().includes(item.name.toLowerCase())
        );
    }, [item.name, section]);

    // Handle when a suggestion is clicked
    const handleSuggestionSelect = useCallback((suggestion) => {
        handleItemChange(section, index, "name", suggestion.name);
        handleItemChange(section, index, "price", suggestion.price);
        setShowSuggestions(false);
    }, [handleItemChange, section, index]);

    // Handle Name Input Change
    const handleNameChange = (e) => {
        const value = e.target.value;
        handleItemChange(section, index, "name", value);
        if (value.length >= 2) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    return (
        // Main Row Container
        <div className="flex flex-col gap-2 md:gap-3 p-1 rounded-lg transition-shadow duration-200 hover:shadow-lg hover:shadow-gray-300/50 border group bg-white">
            
            {/* Input and Action Bar */}
            <div className="flex items-start gap-2 md:gap-3 w-full">
                
                <div className="flex w-full sm:w-auto sm:flex-1 relative">
                    {/* Index */}
                    <span className="text-xs font-mono opacity-50 w-4 mt-2 hidden sm:inline">{(index + 1).toString().padStart(2, "0")}</span>

                    {/* Name/Description Input */}
                    <input
                        type="text"
                        placeholder={section === "parts" ? "Part Name/No (Suggestions)" : "Description (Suggestions)"}
                        value={item.name}
                        onChange={handleNameChange}
                        onFocus={() => item.name.length >= 2 && setShowSuggestions(true)}
                        // Use a slight delay to allow click on suggestion before hiding
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                        className={`flex-1 min-w-[100px] px-2 py-2 outline-none text-sm md:text-base font-medium rounded-lg transition-colors border ${itemInputClass} ${itemInputFocus}`}
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <SuggestionDropdown 
                            suggestions={filteredSuggestions} 
                            onSelect={handleSuggestionSelect} 
                            section={section}
                        />
                    )}
                </div>

                <div className="flex w-full sm:w-auto sm:ml-auto items-center gap-2 md:gap-3">
                    {/* Quantity Input */}
                    <div className={`flex items-center w-20 border-l px-1 ${itemQtyPriceBorder} sm:border-l-0 border-r`}>
                        <input
                            type="number"
                            min={1}
                            value={item.qty || 1}
                            onChange={(e) => handleItemChange(section, index, "qty", Number(e.target.value))}
                            className={`w-full bg-transparent px-1 py-2 text-sm text-center outline-none text-gray-800`}
                            placeholder="Qty"
                        />
                    </div>
                    
                    {/* Price Input */}
                    <div className={`flex items-center w-28 md:w-36 border-l px-2 ${itemQtyPriceBorder}`}>
                        <span className={`text-sm mr-1 text-gray-400`}>₨</span>
                        <input
                            type="number"
                            placeholder="0"
                            value={item.price}
                            onChange={(e) => handleItemChange(section, index, "price", e.target.value)}
                            className={`w-full bg-transparent outline-none text-sm md:text-base font-mono text-right ${itemPriceClass}`}
                        />
                    </div>
                    
                    {/* Remove Button */}
                    <button
                        onClick={() => handleRemoveItem(section, index)}
                        className={`p-2 rounded-lg transition-all duration-200 opacity-70 hover:opacity-100 text-red-500 hover:bg-red-50`}
                        title="Remove Item"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
});

// ====================================================================
// Main Component
// ====================================================================

export default function CreateBill() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const items = useSelector((state) => state.jobSurvey.items);
  const fields = useSelector((state) => state.jobSurvey.fields);

  // Local state for live input handling
  const [localItems, setLocalItems] = useState(items);
  const [taxPercent, setTaxPercent] = useState(items.taxPercent || 0);
  const [deprPercent, setDeprPercent] = useState(items.deprPercent || 0);

  // Sync Redux -> local
  useEffect(() => {
    setLocalItems(items);
    setTaxPercent(items.taxPercent || 0);
    setDeprPercent(items.deprPercent || 0);
  }, [items]);

  // Update percentages
  const handlePercentChange = (type, value) => {
    if (type === "tax") setTaxPercent(value);
    else setDeprPercent(value);
    dispatch(
      updatePercent({
        taxPercent: type === "tax" ? value : undefined,
        deprPercent: type === "depr" ? value : undefined,
      })
    );
  };

  // Handlers for items
  const handleItemChange = useCallback(
    (section, index, key, value) => {
      setLocalItems((prev) => {
        const updated = prev[section].map((item, i) =>
          i === index ? { ...item, [key]: key === "price" || key === "qty" ? Number(value) : value } : item
        );
        return { ...prev, [section]: updated };
      });
      dispatch(updateItem({ section, index, key, value }));
    },
    [dispatch]
  );

  const handleAddItem = (section) => {
    setLocalItems((prev) => ({
      ...prev,
      [section]: [...prev[section], { name: "", price: 0, qty: 1 }],
    }));
    dispatch(addItem(section));
  };

  const handleRemoveItem = (section, index) => {
    setLocalItems((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
    dispatch(removeItem({ section, index }));
  };

  // Totals calculation
  const { labourTotal, partsTotal, grandTotal, updatedItems } = useMemo(() => {
    let labourSum = 0;
    let partsSum = 0;

    // Labour items: Tax add hoga
    const updatedLabour = localItems.labour.map((item) => {
      const base = Number(item.price || 0) * Number(item.qty || 1);
      const taxAmount = (base * (taxPercent || 0)) / 100;
      const finalPrice = base + taxAmount;
      labourSum += finalPrice;
      return { ...item, taxAmount, finalPrice, tax: taxPercent };
    });

    // Parts items: Depreciation add hoga
    const updatedParts = localItems.parts.map((item) => {
      const base = Number(item.price || 0) * Number(item.qty || 1);
      const deprAmount = (base * (deprPercent || 0)) / 100;
      const finalPrice = base + deprAmount;
      partsSum += finalPrice;
      return { ...item, deprAmount, finalPrice, depr: deprPercent };
    });


    return {
      labourTotal: labourSum,
      partsTotal: partsSum,
      grandTotal: labourSum + partsSum,
      updatedItems: { ...localItems, labour: updatedLabour, parts: updatedParts },
    };
  }, [localItems, taxPercent, deprPercent]);

  // Styling (Light Theme only)
  const containerBg = "bg-gray-100 text-gray-900";
  const sideBg = "#ffffff";
  const itemInputClass = "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"; // Changed input bg for better visual hierarchy
  const itemInputFocus = "focus:ring-2 focus:ring-blue-200 focus:border-blue-500";
  const itemQtyPriceBorder = "border-gray-200";
  

  return (
    <div className={`flex flex-col min-h-screen p-3 md:p-5 transition-colors duration-500 ${containerBg}`}>
      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        {/* LEFT SIDE FORM */}
        <div
          className="w-full lg:w-1/2 flex flex-col rounded-2xl shadow-2xl overflow-hidden border transition-colors duration-500 h-[650px] lg:h-auto"
          style={{ backgroundColor: sideBg, borderColor: "rgba(0,0,0,0.05)" }}
        >
          {/* Header */}
          <div className={`p-5 md:p-6 border-b border-gray-100`}>
            <button
              onClick={() => navigate(-1)}
              className={`p-3 rounded-full transition shadow-md hover:scale-105 duration-200 bg-gray-200 hover:bg-gray-300`}
            >
              <ArrowLeft className={"text-blue-500"} />
            </button>
            <div className="flex items-center justify-between mt-3">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Insurance Bill Generator
                </h1>
                <p className={`text-sm md:text-base mt-1 text-gray-500`}>
                  Manage labour costs and spare parts.
                </p>
              </div>
              <div className={`p-3 md:p-4 rounded-full bg-blue-50`}>
                <FileText className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>
          </div>

          {/* Scrollable Form */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar">
            
            

            {/* Tax & Depreciation Inputs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl border bg-white border-gray-200 shadow-sm`}
            >
              <div className="flex flex-col flex-1">
                <label className="text-sm font-semibold mb-1">Tax % (Labour)</label>
                <input
                  type="number"
                  value={taxPercent}
                  min={0}
                  onChange={(e) => handlePercentChange("tax", Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg transition-colors focus:ring-2 bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-200 focus:border-blue-500`}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-semibold mb-1">Depreciation % (Parts)</label>
                <input
                  type="number"
                  value={deprPercent}
                  min={0}
                  onChange={(e) => handlePercentChange("depr", Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded-lg transition-colors focus:ring-2 bg-gray-50 text-gray-900 border border-gray-300 focus:ring-blue-200 focus:border-blue-500`}
                />
              </div>
            </div>

            {/* PARTS SECTION */}
            <section
              className={`rounded-xl p-4 md:p-5 border bg-white border-gray-200 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-emerald-600">
                  <Wrench className="w-5 h-5 md:w-6 md:h-6" />
                  <h2 className={`text-lg md:text-xl font-semibold text-gray-800`}>Spare Parts</h2>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700`}
                >
                  Total: ₨{partsTotal.toLocaleString()}
                </span>
              </div>
              <div className="space-y-3">
                {localItems.parts.map((item, index) => (
                  <ItemRow 
                    key={index} 
                    item={item} 
                    index={index} 
                    section="parts" 
                    handleItemChange={handleItemChange} 
                    handleRemoveItem={handleRemoveItem} 
                    itemInputClass={itemInputClass}
                    itemInputFocus={itemInputFocus}
                    itemPriceClass={"text-emerald-600 font-semibold"}
                    itemQtyPriceBorder={itemQtyPriceBorder}
                  />
                ))}
              </div>
              <button
                onClick={() => handleAddItem("parts")}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed transition-colors border-gray-300 text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50`}
              >
                <Plus className="w-5 h-5" /> Add Spare Part
              </button>
            </section>
            
            {/* LABOUR SECTION */}
            <section
              className={`rounded-xl p-4 md:p-5 border bg-white border-gray-200 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-blue-600">
                  <Hammer className="w-5 h-5 md:w-6 md:h-6" />
                  <h2 className={`text-lg md:text-xl font-semibold text-gray-800`}>
                    Labour Charges
                  </h2>
                </div>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700`}
                >
                  Total: ₨{labourTotal.toLocaleString()}
                </span>
              </div>
              <div className="space-y-3">
                {localItems.labour.map((item, index) => (
                  <ItemRow 
                    key={index} 
                    item={item} 
                    index={index} 
                    section="labour" 
                    handleItemChange={handleItemChange} 
                    handleRemoveItem={handleRemoveItem} 
                    itemInputClass={itemInputClass}
                    itemInputFocus={itemInputFocus}
                    itemPriceClass={"text-blue-600 font-semibold"}
                    itemQtyPriceBorder={itemQtyPriceBorder}
                  />
                ))}
              </div>
              <button
                onClick={() => handleAddItem("labour")}
                className={`mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed transition-colors border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50`}
              >
                <Plus className="w-5 h-5" /> Add Labour Item
              </button>
            </section>

          </div>

          {/* Footer Summary */}
          <div className={`p-5 border-t text-right bg-gray-50 border-gray-200`}>
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">Grand Total</p>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              ₨ {grandTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE BILL PREVIEW */}
        <div
          className="w-full lg:w-1/2 p-4 md:p-6 overflow-y-auto rounded-xl md:rounded-lg shadow-lg transition-colors duration-500 h-[500px] md:h-[600px] lg:h-auto"
          style={{ backgroundColor: sideBg }}
        >
          <Insurancebill
            logo={logo}
            billNo={fields.billNo || 1234}
            items={updatedItems}
            taxPercent={taxPercent}
            deprPercent={deprPercent}
            formData={fields}
          />

        </div>
      </div>
    </div>
  );
}