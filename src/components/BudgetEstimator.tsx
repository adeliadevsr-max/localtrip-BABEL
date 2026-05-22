/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, HelpCircle, BadgeCent, TableProperties, Info, Loader, Wallet, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import { BudgetEstimateResponse, BudgetPackage } from '../types';

interface BudgetEstimatorProps {
  token: string;
}

export default function BudgetEstimator({ token }: BudgetEstimatorProps) {
  const [region, setRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [days, setDays] = useState('2');
  const [people, setPeople] = useState('3');
  const [origin, setOrigin] = useState('Palembang');

  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<BudgetEstimateResponse | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/budget/estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wilayah: region,
          jumlah_hari: days,
          jumlah_orang: people,
          tipe: 'standar',
          asal_kota: origin
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error calculating budget.');
      }
      setEstimate(data);
    } catch (err: any) {
      setError(err.message || 'Gagal menghitung budget');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleCalculate();
  }, [region, days, people, origin]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8" id="budget-estimator">
      
      <div>
        <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
          SaaS Calculator
        </span>
        <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mt-1.5">Kalkulator Estimasi Budget Otomatis</h2>
        <p className="text-xs text-slate-500 mt-1">Estimasi biaya liburan real-time berdasarkan titik tolak awal Anda, akomodasi harian, konsumsi, tiket pesawat, dan transportasi lokal.</p>
      </div>

      {/* Input parameters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        {/* Region */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="calc-region">Tujuan Wilayah</label>
          <select
            id="calc-region"
            value={region}
            onChange={(e) => setRegion(e.target.value as 'Bangka' | 'Belitung')}
            className="block w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="Belitung">Pulau Belitung</option>
            <option value="Bangka">Pulau Bangka</option>
          </select>
        </div>

        {/* Days */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="calc-days">Durasi (Hari)</label>
          <input
            id="calc-days"
            type="number"
            min="1"
            max="14"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="block w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        {/* People count */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="calc-people">Jumlah Anggota (Orang)</label>
          <input
            id="calc-people"
            type="number"
            min="1"
            max="30"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="block w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800"
          />
        </div>

        {/* Origin City */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="calc-origin">Asal Kota</label>
          <select
            id="calc-origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="block w-full text-xs font-semibold py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-800"
          >
            <option value="Palembang">Palembang (Kapal / Pesawat Singkat)</option>
            <option value="Jakarta">Jakarta (Pesawat Komersil)</option>
            <option value="Pangkalpinang">Lokal Bangka (Tanpa Tiket Pesawat)</option>
            <option value="Belitung">Lokal Belitung (Tanpa Tiket Pesawat)</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 border border-slate-150 rounded-2xl bg-slate-50">
          <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
          <span className="text-xs text-slate-500 font-bold">Menghitung kalkulasi pos biaya...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          {error}
        </div>
      )}

      {estimate && !loading && (
        <div className="space-y-8 animate-fade-in" id="estimate-result-ui">
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* HEMAT */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-indigo-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg">PAKET HEMAT</span>
                  <Wallet className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="mb-4">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">TOTAL ESTIMASI</span>
                  <span className="text-2xl font-serif font-bold text-indigo-950 block">{estimate.packages.HEMAT.total_estimasi}</span>
                </div>
                
                <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Transportasi</span>
                    <span>{estimate.packages.HEMAT.rincian.transportasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Akomodasi</span>
                    <span>{estimate.packages.HEMAT.rincian.akomodasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Makan Harian</span>
                    <span>{estimate.packages.HEMAT.rincian.makan}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Tiket & Retribusi</span>
                    <span>{estimate.packages.HEMAT.rincian.tiket_masuk}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">{estimate.packages.HEMAT.catatan}</p>
              </div>
            </div>

            {/* STANDAR */}
            <div className="bg-white rounded-2xl border-2 border-emerald-500 p-5 hover:shadow-md transition-all flex flex-col justify-between shadow-xs relative">
              <span className="absolute -top-3 right-4 text-[9px] font-bold text-emerald-900 bg-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider">REKOMENDASI</span>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg">PAKET STANDAR</span>
                  <TableProperties className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mb-4">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">TOTAL ESTIMASI</span>
                  <span className="text-2xl font-serif font-bold text-emerald-950 block">{estimate.packages.STANDAR.total_estimasi}</span>
                </div>
                
                <div className="border-t border-slate-150 pt-4 space-y-3.5 text-xs text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Transportasi</span>
                    <span>{estimate.packages.STANDAR.rincian.transportasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Akomodasi</span>
                    <span>{estimate.packages.STANDAR.rincian.akomodasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Makan Harian</span>
                    <span>{estimate.packages.STANDAR.rincian.makan}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Tiket & Retribusi</span>
                    <span>{estimate.packages.STANDAR.rincian.tiket_masuk}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/30">
                <p className="text-[10px] text-slate-600 leading-relaxed italic">{estimate.packages.STANDAR.catatan}</p>
              </div>
            </div>

            {/* NYAMAN */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-amber-400 transition-all flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">PAKET NYAMAN</span>
                  <PlaneTakeoff className="w-4 h-4 text-amber-550" />
                </div>
                <div className="mb-4">
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">TOTAL ESTIMASI</span>
                  <span className="text-2xl font-serif font-bold text-amber-950 block">{estimate.packages.NYAMAN.total_estimasi}</span>
                </div>
                
                <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs text-slate-700">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Transportasi</span>
                    <span>{estimate.packages.NYAMAN.rincian.transportasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Akomodasi</span>
                    <span>{estimate.packages.NYAMAN.rincian.akomodasi}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Makan Harian</span>
                    <span>{estimate.packages.NYAMAN.rincian.makan}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">Tiket & Retribusi</span>
                    <span>{estimate.packages.NYAMAN.rincian.tiket_masuk}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 leading-relaxed italic">{estimate.packages.NYAMAN.catatan}</p>
              </div>
            </div>

          </div>

          {/* AI Tips section */}
          <div className="bg-emerald-50 border border-emerald-150 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start">
            <div className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl">
              <Sparkles className="w-5 h-5 fill-emerald-100/20" />
            </div>
            <div className="space-y-2">
              <span className="font-extrabold text-xs text-emerald-900 uppercase tracking-wider block">ANALOGI & TIPS PENDUKUNG AI</span>
              <ul className="space-y-1 text-xs text-emerald-950 leading-relaxed">
                {estimate.tips_hemat.map((tip, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="text-emerald-700 font-bold mt-0.5">🔑</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
