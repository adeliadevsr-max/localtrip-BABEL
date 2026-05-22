/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Calendar, ArrowRight, Printer, AlertTriangle, Sparkles, Loader, Users, BadgeDollarSign, Heart } from 'lucide-react';
import { TripPlan } from '../types';

interface TripPlannerComponentProps {
  token: string;
  username: string;
}

export default function TripPlannerComponent({ token, username }: TripPlannerComponentProps) {
  const [region, setRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [budget, setBudget] = useState('500000');
  const [duration, setDuration] = useState('2');
  const [people, setPeople] = useState('2');
  const [preferences, setPreferences] = useState<string[]>(['pantai', 'kuliner']);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState<TripPlan | null>(null);

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter(p => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPlan(null);

    try {
      const response = await fetch('/api/trip/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          wilayah: region,
          budget,
          durasi: `${duration} hari`,
          jumlah_orang: `${people} orang`,
          preferensi: preferences.join(', ')
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal menyusun itinerary.');
      }
      setPlan(data);
    } catch (err: any) {
      setError(err.message || 'Kesalahan menyusun rute.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!plan) return;
    
    // Create print window with standalone elegant styling
    const printContent = document.getElementById('printable-itinerary-area')?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Trip Itinerary - LocalTrip Babel</title>
            <style>
              body { font-family: 'Inter', sans-serif; color: #1e293b; padding: 40px; }
              .header { text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; color: #090d16; }
              .sub { font-size: 14px; color: #059669; font-weight: bold; margin-top: 4px; }
              .day-section { margin-bottom: 30px; page-break-inside: avoid; }
              .day-title { font-size: 16px; font-weight: bold; background: #f1f5f9; padding: 8px 16px; border-radius: 8px; margin-bottom: 15px; }
              .activity-row { border-left: 3px solid #059669; padding-left: 15px; margin-bottom: 15px; }
              .time { font-weight: bold; font-size: 12px; color: #059669; }
              .act-title { font-weight: bold; font-size: 14px; color: #0f172a; margin: 4px 0; }
              .location { font-size: 11px; color: #475569; }
              .meta-span { font-size: 11px; margin-right: 15px; font-weight: bold; color: #475569; }
              .summary { background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-top: 30px; }
              .tips-box { background: #ecfdf5; border: 1px solid #d1fae5; padding: 20px; border-radius: 12px; margin-top: 20px; }
              .tips-title { font-weight: bold; color: #065f46; font-size: 13px; margin-bottom: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">Rencana Perjalanan Wisata Anda</div>
              <div class="sub">LocalTrip Babel Premium Smart Itinerary</div>
              <p style="font-size: 11px; color: #64748b; margin-top: 10px;">Dihasilkan khusus untuk: <strong>${username}</strong> • Tujuan: ${region} • Durasi: ${duration} Hari • Anggota: ${people} Orang</p>
            </div>
            ${printContent}
            <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 50px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              © 2026 LocalTrip Babel • Platform Perencana Wisata Pintar Terpercaya Bangka Belitung.
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8" id="trip-planner-component">
      
      <div>
        <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 fill-emerald-500" /> Premium Module
        </span>
        <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mt-1">AI Trip Planner Pintar</h2>
        <p className="text-xs text-slate-500 mt-1">Penyusun itinerary instan berbasis budget total perjalanan Anda agar hemat BBM dan maksimal berekreasi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form panel */}
        <form onSubmit={handleCreatePlan} className="lg:col-span-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
          
          {/* Target Region */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pulau Tujuan</label>
            <div className="flex bg-slate-200 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                id="form-region-belitung"
                onClick={() => setRegion('Belitung')}
                className={`flex-1 py-2 font-bold rounded-md ${region === 'Belitung' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'}`}
              >
                Belitung
              </button>
              <button
                type="button"
                id="form-region-bangka"
                onClick={() => setRegion('Bangka')}
                className={`flex-1 py-2 font-bold rounded-md ${region === 'Bangka' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500'}`}
              >
                Bangka
              </button>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label htmlFor="form-budget" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Maksimal Budget (Rupiah)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-bold text-slate-400">Rp</span>
              <input
                id="form-budget"
                type="number"
                min="100000"
                max="15000000"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="block w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
                placeholder="Misal: 500000"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Total dana perjalanan yang Anda targetkan.</span>
          </div>

          {/* Duration & Companions */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="form-durasi" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Durasi</label>
              <select
                id="form-durasi"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="1">1 Hari</option>
                <option value="2">2 Hari</option>
                <option value="3">3 Hari</option>
              </select>
            </div>
            <div>
              <label htmlFor="form-companions" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jumlah Orang</label>
              <select
                id="form-companions"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="block w-full py-2 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium"
              >
                <option value="1">1 Orang Solo</option>
                <option value="2">2 Orang Pacaran</option>
                <option value="3">3 Orang Keluarga</option>
                <option value="4">4 Orang Rombongan</option>
              </select>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Preferensi Kunjungan</label>
            <div className="flex flex-wrap gap-1.5">
              {(['pantai', 'kuliner', 'spot_foto', 'alam'] as const).map((pref) => {
                const active = preferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-2.5 py-1.5 text-[9px] font-bold rounded-lg border transition-all uppercase ${active ? 'bg-slate-900 border-slate-950 text-white' : 'bg-white border-slate-200 text-slate-500'}`}
                  >
                    {pref === 'spot_foto' ? 'Foto Estetik' : pref}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            id="btn-trigger-ai-planner"
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {loading ? 'Menyusun Itinerary AI...' : 'Buat Trip Plan Sekarang'}
          </button>
        </form>

        {/* Output timeline panel */}
        <div className="lg:col-span-8 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-2xl border border-slate-200">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-4" />
              <span className="text-xs font-bold text-slate-700">Sedang meminta asisten AI menyusun rute...</span>
              <p className="text-[10px] text-slate-400 mt-1">Mengurutkan lokasi terdekat & menyesuaikan budget Rp {parseFloat(budget).toLocaleString('id-ID')}</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-bounce">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gagal Menyusun Itinerary:</span>
                <span className="block mt-1">{error}</span>
              </div>
            </div>
          ) : !plan ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-center p-6 text-slate-400">
              <Calendar className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Formulir Belum Dikirim</p>
              <p className="text-[10px] text-slate-400 max-w-sm mt-1">Silakan sesuaikan budget dan kriteria Anda di sebelah kiri lalu klik tombol "Buat Trip Plan Sekarang" untuk merancang itinerary terstruktur.</p>
            </div>
          ) : (
            /* Structured itinerary view */
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-slate-100 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">ITINERARY DIPROSES</span>
                  <span className="text-xs font-bold text-slate-800">Total Pengeluaran: <span className="text-emerald-700 font-extrabold">{plan.estimasi_total_biaya}</span></span>
                </div>
                
                <button
                  id="btn-print-itinerary"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-500 rounded-xl transition-all text-xs font-bold"
                >
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>
              </div>

              {/* Printable Wrapper */}
              <div id="printable-itinerary-area" className="space-y-6">
                {plan.itinerary.map((dayItem) => (
                  <div key={dayItem.day} className="day-section">
                    <div className="day-title flex items-center justify-between mb-4">
                      <span className="font-extrabold text-sm text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">HARI {dayItem.day}</span>
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">LocalTrip Babel Rute</span>
                    </div>

                    <div className="space-y-4">
                      {dayItem.activities.map((act, actIdx) => (
                        <div key={actIdx} className="activity-row border-l-4 border-emerald-600 pl-4 py-1">
                          <span className="time text-xs font-bold text-emerald-600 block">{act.waktu}</span>
                          <h4 className="act-title text-sm font-bold text-slate-900 mt-1">{act.aktivitas}</h4>
                          <span className="location text-[11px] text-slate-500 block mb-2">{act.lokasi} (durasi {act.estimasi_durasi})</span>
                          
                          <div className="flex items-center text-[10px] text-slate-400 font-semibold">
                            <span className="meta-span mr-4 text-slate-600">Est. Biaya: <strong className="text-amber-700 font-bold">{act.estimasi_biaya}</strong></span>
                            <span>Aman sesuai budget</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Print bottom blocks for tips */}
                <div className="tips-box bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                  <div className="tips-title text-emerald-800 font-bold text-xs mb-2 uppercase tracking-wide">💡 TIPS PERJALANAN PENTING</div>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-900 leading-relaxed">
                    {plan.tips_perjalanan.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
