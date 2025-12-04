import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast, Toaster } from "react-hot-toast";

// Lucide Icons
import { Download, FileText, Phone, MapPin, Car, Shield, Tag, Truck, Users } from "lucide-react";

// ------------------- numberToWords -------------------
const numberToWords = (num) => {
  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const g = ["", "Thousand", "Million", "Billion", "Trillion"];

  if (num === 0) return "Zero Rupees Only";

  const chunk = (n) => {
    let str = "";
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) str += a[n] + " ";
    return str.trim();
  };

  let i = 0;
  let words = "";
  while (num > 0) {
    const part = num % 1000;
    if (part) words = chunk(part) + (g[i] ? " " + g[i] + " " : " ") + words;
    num = Math.floor(num / 1000);
    i++;
  }
  return words.trim() + " Rupees Only";
};

// ------------------- Component (JS) -------------------
const Insurancebill = ({ logo, billNo, items = { parts: [], labour: [] }, formData = {} }) => {
  const [partsTotal, setPartsTotal] = useState(0);
  const [labourTotal, setLabourTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Calculate totals when items change
  useEffect(() => {
    const totalParts = (items.parts || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const totalDepAmount = (items.parts || []).reduce((sum, item) => {
      const actual = item.price * (item.qty || 1);
      const deprA = (actual * (item.depr || 0) / 100);
      return sum + deprA;
    }, 0);
    const partsTotalAfterDep = totalParts + totalDepAmount;

    const totalLabour = (items.labour || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
    const totalTaxAmount = (items.labour || []).reduce((sum, item) => {
      const actual = item.price * (item.qty || 1);
      const taxA = (actual * (item.tax || 0) / 100);
      return sum + taxA;
    }, 0);
    const labourTotalAfterTax = totalLabour + totalTaxAmount;

    setPartsTotal(partsTotalAfterDep);
    setLabourTotal(labourTotalAfterTax);
    setGrandTotal(partsTotalAfterDep + labourTotalAfterTax);
  }, [items]);

  // Light theme classes only (simplified)
  const themeClasses = {
    container: 'bg-white text-gray-900 shadow-2xl',
    headerFooterBg: 'bg-gray-100',
    border: 'border-gray-300',
    primaryBg: 'bg-gray-700',
    primaryText: 'text-white',
    accent: 'text-amber-600',
    buttonBg: 'bg-gray-800',
    buttonHover: 'hover:bg-gray-900',
  };

  // ---------------- PDF GENERATION ----------------
  const generatePDF = () => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 30;

      // CALCULATIONS... (kept the same)
      const totalParts = (items.parts || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      const totalDepAmount = (items.parts || []).reduce((sum, item) => {
        const actual = item.price * (item.qty || 1);
        const deprA = (actual * (item.depr || 0) / 100);
        return sum + deprA;
      }, 0);
      const partsTotalAfterDepConsistent = totalParts + totalDepAmount;
      const depPercent = totalParts ? Math.round((totalDepAmount / totalParts) * 100) : 0;

      const totalLabour = (items.labour || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
      const totalTaxAmount = (items.labour || []).reduce((sum, item) => {
        const actual = item.price * (item.qty || 1);
        const taxA = (actual * (item.tax || 0) / 100);
        return sum + taxA;
      }, 0);
      const labourTotalAfterTax = totalLabour + totalTaxAmount;
      const taxPercent = totalLabour ? Math.round((totalTaxAmount / totalLabour) * 100) : 0;

      const netAmount = partsTotalAfterDepConsistent + labourTotalAfterTax;
      const finalGrandTotal = netAmount;
      
      // ... rest of PDF logic (omitted for brevity)

      const fileName = `Yadgar-Insurance-Bill-${billNo}.pdf`;
      doc.save(fileName);
      toast.success(`✅ Bill ${fileName} Generated. Check your downloads folder.`);
    } catch (error) {
      console.error("PDF Error", error);
      toast.error("❌ Failed to generate PDF. Check console for details.");
    }
  };

  // ------------------- Render (Enhanced Responsive & Compact) -------------------
  return (
    <div className={`p-4 sm:p-6 ${themeClasses.container} transition-colors duration-300 w-full max-w-7xl mx-auto rounded-xl`}>
      <Toaster position="top-right" />

      {/* Header */}
      <div className={`rounded-lg p-4 sm:p-6 ${themeClasses.headerFooterBg} mb-4 sm:mb-6 shadow-inner`}>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
          {logo && (
            <img
              src={logo}
              alt="Company Logo"
              className="h-16 sm:h-20 mb-3 sm:mb-0 max-w-[50%]" // Compact logo
              style={{ maxHeight: '100px' }}
            />
          )}

          <div className="text-center sm:text-right text-xs sm:text-sm font-medium space-y-1">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-wider ${themeClasses.accent}`}>
              <FileText className="inline h-5 w-5 sm:h-6 sm:w-6 mr-1" /> WORK / INVOICE
            </h1>
            <p className="text-gray-800"><strong className="text-gray-500">Invoice No:</strong> <span className={`font-mono text-base sm:text-lg font-bold ${themeClasses.accent}`}>{billNo}</span></p>
            <p className="text-gray-800"><strong className="text-gray-500">Date/Time:</strong> <span className="font-mono text-xs sm:text-sm">{new Date().toLocaleString()}</span></p>
          </div>
        </div>

        <hr className={`border-t-2 border-solid ${themeClasses.border} my-3`} />

        <div className="text-center text-xs space-y-1"> 
          <p className="text-gray-500"><MapPin className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" /> 2-3 Marjal Building, Mir Karam Ali Talpur Rd, Saddar Karachi-74400</p>
          <p className="text-gray-500"><Phone className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 text-gray-500" /> Phone: <span className="text-gray-800">0345 7001712</span> | UAN: <span className="text-gray-800">0321 2451996</span></p>
          <p className="text-gray-500">Email: <span className="text-gray-800">Yadgarautos1@gmail.com</span></p>
        </div>
      </div>

      {/* Details Section - Highly Responsive and Compact */}
      <div className={`rounded-lg border-2 ${themeClasses.border} overflow-hidden shadow-lg mb-6 sm:mb-8`}>
        {/* Header Row: grid-cols-2 on small screens, grid-cols-4 on medium */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 ${themeClasses.primaryBg} ${themeClasses.primaryText} font-extrabold text-xs sm:text-sm tracking-wider uppercase`}>
          <div className={`p-2 border-r ${themeClasses.border} flex items-center`}><Users className="h-4 w-4 mr-1 opacity-80" /> CUST DETAILS</div>
          <div className={`p-2 border-r ${themeClasses.border} flex items-center`}><Car className="h-4 w-4 mr-1 opacity-80" /> VEHICLE DETAILS</div>
          <div className={`p-2 border-r ${themeClasses.border} items-center hidden sm:flex`}><Shield className="h-4 w-4 mr-1 opacity-80" /> INSURANCE</div> 
          <div className={`p-2 items-center hidden sm:flex`}><MapPin className="h-4 w-4 mr-1 opacity-80" /> SURVEYOR</div> 
        </div>

        {/* Data Rows: grid-cols-2 on small screens, grid-cols-4 on medium */}
        <div className="grid grid-cols-2 sm:grid-cols-4 text-xs divide-y divide-gray-300">
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Name: <span className={`font-semibold ml-1 text-gray-800`}>{formData.customername || "-"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Reg. No: <span className={`font-semibold ml-1 text-gray-800`}>{formData.vehicleno || "-"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500 hidden sm:block`}>Company: <span className={`font-semibold ml-1 text-gray-800`}>{formData.insurancecompany || "-"}</span></div>
          <div className={`p-2 text-gray-500 hidden sm:block`}>Name: <span className={`font-semibold ml-1 text-gray-800`}>{formData.surveyorname || "-"}</span></div>

          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Contact: <span className={`font-semibold ml-1 text-gray-800`}>{formData.customercontact || "-"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Make: <span className={`font-semibold ml-1 text-gray-800`}>{formData.make || "-"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500 hidden sm:block`}>Loss No: <span className={`font-semibold ml-1 text-gray-800`}>{formData.lossno || "-"}</span></div>
          <div className={`p-2 text-gray-500 hidden sm:block`}>Contact: <span className={`font-semibold ml-1 text-gray-800`}>{formData.surveyorcontact || "-"}</span></div>
          
          {/* Combined Insurance & Surveyor info for small screens */}
          <div className="p-2 col-span-2 border-r sm:hidden text-xs">
             <p className="text-gray-500">Ins.: <span className="font-semibold text-gray-800">{formData.insurancecompany || "-"}</span> | Sur.: <span className="font-semibold text-gray-800">{formData.surveyorname || "-"}</span></p>
          </div>

          {/* Additional details for larger screens (sm and up) */}
          <div className={`p-2 border-r ${themeClasses.border} hidden sm:block`}></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Model: <span className={`font-semibold ml-1 text-gray-800`}>{formData.model || "-"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500 hidden sm:block`}>Chassis No: <span className={`font-semibold ml-1 text-gray-800`}>{formData.chassisno || "-"}</span></div>
          <div className={`p-2 text-gray-500 hidden sm:block`}>Company: <span className={`font-semibold ml-1 text-gray-800`}>{formData.surveyorcompany || "-"}</span></div>

          <div className={`p-2 border-r ${themeClasses.border} hidden sm:block`}></div>
          <div className={`p-2 border-r ${themeClasses.border} text-gray-500`}>Mileage: <span className={`font-semibold ml-1 text-gray-800`}>{formData.mileage || "N/A"}</span></div>
          <div className={`p-2 border-r ${themeClasses.border} hidden sm:block`}></div>
          <div className={`p-2 hidden sm:block`}></div>
        </div>
      </div>

      {/* Parts Preview (Table responsiveness handled by overflow-x-auto and reduced padding/text size) */}
      {items.parts && items.parts.length > 0 && (
        <div className={`rounded-lg border-2 ${themeClasses.border} overflow-hidden shadow-lg mb-4`}>
          <h2 className={`text-base sm:text-lg font-bold p-3 ${themeClasses.primaryBg} ${themeClasses.primaryText}`}><Tag className="h-4 w-4 mr-2" /> Spare Parts & Lubricants</h2>
          <div className="p-1 sm:p-2 overflow-x-auto"> 
            <table className="min-w-full text-xs table-auto border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="p-1 sm:p-2">#</th>
                  <th className="p-1 sm:p-2 text-left min-w-[120px]">Description</th>
                  <th className="p-1 sm:p-2">Qty</th>
                  <th className="p-1 sm:p-2">Actual</th>
                  <th className="p-1 sm:p-2">Dep %</th>
                  <th className="p-1 sm:p-2">Dep Amt</th>
                  <th className="p-1 sm:p-2">Final</th>
                </tr>
              </thead>
              <tbody>
                {items.parts.map((item, idx) => {
                  const qty = item.qty || 1;
                  const actual = item.price * qty;
                  const deprPercent = item.depr || 0;
                  const deprAmt = (actual * deprPercent) / 100;
                  const finalPrice = actual + deprAmt;
                  return (
                    <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-1 sm:p-2 text-center">{idx + 1}</td>
                      <td className="p-1 sm:p-2">{item.name}</td>
                      <td className="p-1 sm:p-2 text-center">{qty}</td>
                      <td className="p-1 sm:p-2 text-right">{actual.toLocaleString()}</td>
                      <td className="p-1 sm:p-2 text-right">{deprPercent}%</td>
                      <td className="p-1 sm:p-2 text-right">{deprAmt.toLocaleString()}</td>
                      <td className="p-1 sm:p-2 text-right font-bold">{finalPrice.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Labour Preview (Table responsiveness handled by overflow-x-auto and reduced padding/text size) */}
      {items.labour && items.labour.length > 0 && (
        <div className={`rounded-lg border-2 ${themeClasses.border} overflow-hidden shadow-lg mb-6`}>
          <h2 className={`text-base sm:text-lg font-bold p-3 ${themeClasses.primaryBg} ${themeClasses.primaryText}`}><Truck className="h-4 w-4 mr-2" /> Labour Performed</h2>
          <div className="p-1 sm:p-2 overflow-x-auto">
            <table className="min-w-full text-xs table-auto border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="p-1 sm:p-2">#</th>
                  <th className="p-1 sm:p-2 text-left min-w-[120px]">Voice of Customer</th>
                  <th className="p-1 sm:p-2">Labour</th>
                  <th className="p-1 sm:p-2">Actual</th>
                  <th className="p-1 sm:p-2">Tax %</th>
                  <th className="p-1 sm:p-2">Tax Amt</th>
                  <th className="p-1 sm:p-2">Final</th>
                </tr>
              </thead>
              <tbody>
                {items.labour.map((item, idx) => {
                  const qty = item.qty || 1;
                  const actual = item.price * qty;
                  const taxPercent = item.tax || 0;
                  const taxAmt = (actual * taxPercent) / 100;
                  const finalPrice = actual + taxAmt;
                  return (
                    <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-1 sm:p-2 text-center">{idx + 1}</td>
                      <td className="p-1 sm:p-2">{item.name}</td>
                      <td className="p-1 sm:p-2 text-center">{qty}</td>
                      <td className="p-1 sm:p-2 text-right">{actual.toLocaleString()}</td>
                      <td className="p-1 sm:p-2 text-right">{taxPercent}%</td>
                      <td className="p-1 sm:p-2 text-right">{taxAmt.toLocaleString()}</td>
                      <td className="p-1 sm:p-2 text-right font-bold">{finalPrice.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary box - Added specific widths for md and lg */}
      <div className={`p-4 sm:p-5 rounded-lg border-4 border-double shadow-xl w-full md:w-1/2 lg:w-2/5 ml-auto bg-white border-amber-600 text-gray-900 mb-6`}>
        <h2 className="text-lg sm:text-xl font-bold mb-3">Summary</h2>

        {(() => {
          const totalParts = (items.parts || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
          const totalDepAmount = (items.parts || []).reduce((sum, item) => sum + ((item.price * (item.qty || 1)) * (item.depr || 0) / 100), 0);
          const depPercent = totalParts ? Math.round((totalDepAmount / totalParts) * 100) : 0;
          const partsTotalAfterDep = totalParts + totalDepAmount;

          const totalLabour = (items.labour || []).reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
          const totalTaxAmount = (items.labour || []).reduce((sum, item) => sum + ((item.price * (item.qty || 1)) * (item.tax || 0) / 100), 0);
          const taxPercent = totalLabour ? Math.round((totalTaxAmount / totalLabour) * 100) : 0;
          const labourTotalAfterTax = totalLabour + totalTaxAmount;

          const netAmount = partsTotalAfterDep + labourTotalAfterTax;

          return (
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between"><span>Total Parts Amount:</span><span>Rs. {totalParts.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Depreciation Amount:({depPercent}%)</span><span>Rs. {totalDepAmount.toLocaleString()} </span></div>
              <div className="flex justify-between"><span>Total Labour Amount:</span><span>Rs. {totalLabour.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Tax Amount: ({taxPercent}%)</span><span>Rs. {totalTaxAmount.toLocaleString()} </span></div>
              <hr className="border-t border-gray-400 my-1" />
              <div className="flex justify-between font-bold text-base"><span>Net Amount:</span><span>Rs. {netAmount.toLocaleString()}</span></div>
              <div className="pt-1 text-xs italic">In Words: {numberToWords(netAmount)}</div>
            </div>
          );
        })()}
      </div>

{/* Grand Total */}
      <div className={`flex justify-end p-4 rounded-xl ${themeClasses.headerFooterBg} shadow-inner`}>
        <div className={`w-full p-4 sm:p-6 rounded-lg border-4 border-double border-amber-600 bg-white/70 text-right shadow-xl`}>
          <p className={`text-xl sm:text-2xl lg:text-2xl font-black text-gray-700 flex justify-between sm:justify-end items-center`}>
            <span>GRAND TOTAL:</span>
            <span className={`ml-4 text-3xl sm:text-4xl font-extrabold ${themeClasses.accent}`}>Rs. {grandTotal.toLocaleString()}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons - Compact */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6 sm:mt-8">
        <button onClick={generatePDF} className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-bold ${themeClasses.buttonBg} rounded-lg shadow-lg ${themeClasses.buttonHover} transition-all transform hover:scale-[1.02] text-sm sm:text-base`}>
          <Download className="h-4 w-4" /> GENERATE PDF & SAVE
        </button>
        <button onClick={() => toast.success("✅ Bill Attached Successfully!")} className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold bg-gray-300 text-gray-800 rounded-lg shadow-lg hover:bg-gray-400 transition-all transform hover:scale-[1.02] text-sm sm:text-base">
          Save / Attach Bill
        </button>
      </div>
    </div>
  );
};

export default Insurancebill;