/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ShieldCheck, AlertTriangle, CheckCircle2, RotateCcw, Loader, Send, AlignLeft } from 'lucide-react';

export default function AdminPanel() {
  const [nama, setNama] = useState('Pantai Penyabong Baru');
  const [lokasi, setLokasi] = useState('Membalong, Belitung');
  const [kategori, setKategori] = useState('pantai');
  const [wilayah, setWilayah] = useState('Belitung');
  const [deskripsi, setDeskripsi] = useState('Kawasan pantai indah nan luas berhiaskan sekian banyak formasi batuan besar.');
  const [estimasiBiaya, setEstimasiBiaya] = useState('Rp 5.000');
  const [jamBuka, setJamBuka] = useState('08.00 - 18.00 WIB');
  const [tips, setTips] = useState('Bawalah bekal makanan karena warung makan cukup jauh.');

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{ score: number; isValid: boolean; issues: string[] } | null>(null);

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReport(null);

    try {
      const response = await fetch('/api/admin/validate-wisata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nama,
          lokasi,
          kategori,
          deskripsi,
          estimasi_biaya: estimasiBiaya,
          jam_buka: jamBuka,
          tips,
          wilayah
        })
      });

      const data = await response.json();
      setReport(data);
    } catch (err) {
      alert("Kesalahan menghubungkan validator");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNama('');
    setLokasi('');
    setKategori('pantai');
    setDeskripsi('');
    setEstimasiBiaya('');
    setJamBuka('');
    setTips('');
    setReport(null);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-8" id="admin-panel-ui">
      
      <div>
        <span className="text-indigo-700 bg-indigo-50 border border-indigo-100 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
          Internal Admin Tool
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1.5">Validasi Kelengkapan Konten</h2>
        <p className="text-xs text-slate-500 mt-1">Audit kelayakan data wisata baru sebelum dimasukkan ke dalam database. Sistem akan menghitung skor kepatuhan berdasarkan rincian parameter input.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input fields */}
        <form onSubmit={handleSubmitAudit} className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-name">Nama Wisata</label>
              <input
                id="audit-name"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Misal: Pantai Tanjung Tinggi"
                className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-location">Lokasi Spesifik</label>
              <input
                id="audit-location"
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Kecamatan, Kabupaten"
                className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-cat">Kategori</label>
              <select
                id="audit-cat"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="block w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="pantai">Pantai</option>
                <option value="restoran">Restoran</option>
                <option value="cafe">Cafe / Warkop</option>
                <option value="spot_foto">Spot Foto</option>
                <option value="kuliner">Kuliner Tradisional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-region">Kawasan Wilayah</label>
              <select
                id="audit-region"
                value={wilayah}
                onChange={(e) => setWilayah(e.target.value)}
                className="block w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              >
                <option value="Belitung">Belitung</option>
                <option value="Bangka">Bangka</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-desc">Deskripsi Destinasi</label>
            <textarea
              id="audit-desc"
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Berikan info deskripsi yang informatif..."
              className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-biaya">Estimasi Biaya</label>
              <input
                id="audit-biaya"
                type="text"
                value={estimasiBiaya}
                onChange={(e) => setEstimasiBiaya(e.target.value)}
                placeholder="Misal: Rp 15.000 (Tiket)"
                className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-jam">Jam Buka</label>
              <input
                id="audit-jam"
                type="text"
                value={jamBuka}
                onChange={(e) => setJamBuka(e.target.value)}
                placeholder="Misal: 07.00 - 18.00 WIB"
                className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1" htmlFor="audit-tips">Tips Tambahan</label>
            <input
              id="audit-tips"
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Tips berfoto atau kenyamanan berwisata..."
              className="block w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              id="btn-audit-submit"
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold uppercase rounded-xl transition-all"
            >
              {loading ? 'Memeriksa Kepatuhan...' : 'Mulai Audit Konten'}
            </button>
            <button
              id="btn-audit-reset"
              type="button"
              onClick={handleReset}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl transition-all"
              title="Reset Form"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results Scoring Panel */}
        <div className="lg:col-span-6 min-h-[300px]" id="audit-scoring-panel">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-250">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
              <span className="text-xs font-bold text-slate-600">Melakukan analisis compliance...</span>
            </div>
          ) : !report ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl text-center p-6 text-slate-400">
              <ShieldCheck className="w-10 h-10 mb-3 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">Hasil Audit Belum Keluar</p>
              <p className="text-[10px] text-slate-400 max-w-xs mt-1">Selesaikan parameter isian data wisata baru Anda di sebelah kiri, kemudian klik "Mulai Audit Konten" untuk meninjau status kelayakan databasenya.</p>
            </div>
          ) : (
            /* Scored results display */
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 text-center sm:text-left">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase block">Skor Evaluasi</span>
                  <div className="text-3xl font-black text-slate-950 mt-1">{report.score} <span className="text-slate-400 text-sm font-normal">/ 100</span></div>
                  
                  <span className={`inline-block mt-2 px-3 py-1 text-[10px] font-bold rounded-full ${report.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {report.isValid ? 'Sesuai Standar Layak Database' : 'Harap Lengkapi Kriteria Rekomendasi'}
                  </span>
                </div>

                {/* Score Dial Visualizer */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="#e2e8f0" strokeWidth="6" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke={report.isValid ? "#10b981" : "#f59e0b"}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * report.score) / 100}
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-900">{report.score}%</span>
                </div>
              </div>

              {/* Rules check lists */}
              <div className="space-y-3.5 border-t border-slate-200 pt-5 text-xs text-slate-700">
                <span className="font-bold text-slate-400 block tracking-wider uppercase text-[9px]">Hasil Pengamatan Keaslian</span>
                
                {report.issues.map((issue, idx) => {
                  const isSuccess = issue.includes('Sempurna!') || issue.toLowerCase().includes('berhasil') || report.score === 100;
                  return (
                    <div key={idx} className="flex gap-2.5 items-start">
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5" />
                      )}
                      <span className={isSuccess ? 'text-emerald-950 font-medium' : 'text-slate-650'}>{issue}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
