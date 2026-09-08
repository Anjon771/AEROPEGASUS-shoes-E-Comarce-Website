import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Ruler, Footprints, Info } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide } = useShop();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { usMen: '7.0', usWomen: '8.5', uk: '6.0', eu: '40.0', cm: '25.0', in: '9.8' },
    { usMen: '7.5', usWomen: '9.0', uk: '6.5', eu: '40.5', cm: '25.5', in: '10.0' },
    { usMen: '8.0', usWomen: '9.5', uk: '7.0', eu: '41.0', cm: '26.0', in: '10.2' },
    { usMen: '8.5', usWomen: '10.0', uk: '7.5', eu: '42.0', cm: '26.5', in: '10.4' },
    { usMen: '9.0', usWomen: '10.5', uk: '8.0', eu: '42.5', cm: '27.0', in: '10.6' },
    { usMen: '9.5', usWomen: '11.0', uk: '8.5', eu: '43.0', cm: '27.5', in: '10.8' },
    { usMen: '10.0', usWomen: '11.5', uk: '9.0', eu: '44.0', cm: '28.0', in: '11.0' },
    { usMen: '10.5', usWomen: '12.0', uk: '9.5', eu: '44.5', cm: '28.5', in: '11.2' },
    { usMen: '11.0', usWomen: '12.5', uk: '10.0', eu: '45.0', cm: '29.0', in: '11.4' },
    { usMen: '11.5', usWomen: '13.0', uk: '10.5', eu: '45.5', cm: '29.5', in: '11.6' },
    { usMen: '12.0', usWomen: '13.5', uk: '11.0', eu: '46.0', cm: '30.0', in: '11.8' },
    { usMen: '13.0', usWomen: '14.5', uk: '12.0', eu: '47.5', cm: '31.0', in: '12.2' },
  ];

  return (
    <div
      id="size-guide-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={closeSizeGuide}
    >
      <div
        id="size-guide-dialog"
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Footwear Size Chart</h2>
              <p className="text-xs text-slate-500">Official Pegasus athletic fit specifications</p>
            </div>
          </div>
          <button
            id="close-size-guide-btn"
            onClick={closeSizeGuide}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fit recommendation tip */}
        <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 flex items-start gap-3 text-xs text-sky-900">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Runner Sizing Tip:</strong> Air Zoom Pegasus models run true to size. If you have wider feet or intend to wear heavy cushioned trail socks, we recommend selecting a <strong>half-size larger</strong>.
          </div>
        </div>

        {/* Unit toggle & Table */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-slate-700">International Conversion</span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  unit === 'cm' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  unit === 'in' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">US Men</th>
                  <th className="py-2.5 px-3">US Women</th>
                  <th className="py-2.5 px-3">UK</th>
                  <th className="py-2.5 px-3">EU</th>
                  <th className="py-2.5 px-3">Length ({unit === 'cm' ? 'cm' : 'in'})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sizeChart.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-2 px-3 font-bold text-slate-900">{row.usMen}</td>
                    <td className="py-2 px-3">{row.usWomen}</td>
                    <td className="py-2 px-3">{row.uk}</td>
                    <td className="py-2 px-3">{row.eu}</td>
                    <td className="py-2 px-3 text-sky-600 font-bold">
                      {unit === 'cm' ? `${row.cm} cm` : `${row.in} in`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to measure */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Footprints className="w-4 h-4 text-slate-700" />
            <span>How to Measure Your Foot Length</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Tape a piece of blank paper to a flat floor flush against a wall.</li>
            <li>Stand barefoot with your heel touching the wall.</li>
            <li>Mark the tip of your longest toe on the paper with a pencil.</li>
            <li>Measure the distance from the edge of the paper to your mark in cm or inches.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
