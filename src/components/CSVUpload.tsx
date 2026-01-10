import { useState, useRef } from 'react';
import { Upload, FileText, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import type { DemandData } from '../types';

interface CSVUploadProps {
  onUpload: (data: DemandData[]) => void;
  onReset: () => void;
}

export default function CSVUpload({ onUpload, onReset }: CSVUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string): DemandData[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const dateIdx = headers.findIndex(h => h.includes('date'));
    const demandIdx = headers.findIndex(h => h.includes('demand') || h.includes('quantity') || h.includes('sales'));

    if (dateIdx === -1 || demandIdx === -1) {
      throw new Error('CSV must have "date" and "demand" columns');
    }

    const data: DemandData[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length < Math.max(dateIdx, demandIdx) + 1) continue;

      const dateStr = values[dateIdx];
      const demandStr = values[demandIdx];

      // Parse date
      let date: Date;
      if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        date = new Date(parseInt(year.length === 2 ? '20' + year : year), parseInt(month) - 1, parseInt(day));
      } else if (dateStr.includes('-')) {
        date = new Date(dateStr);
      } else {
        continue;
      }

      const demand = parseFloat(demandStr);
      if (isNaN(demand) || demand < 0) continue;

      data.push({
        date: date.toISOString().split('T')[0],
        demand,
      });
    }

    if (data.length < 7) {
      throw new Error('Need at least 7 days of data');
    }

    // Sort by date
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return data;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      onUpload(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    onReset();
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Data Source</h3>
      </div>

      <div className="space-y-4">
        {/* Upload Button */}
        <button
          onClick={handleButtonClick}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Upload className="h-5 w-5" />
          {uploading ? 'Processing...' : 'Upload CSV File'}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Reset to Demo Button */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          Reset to Demo Data
        </button>

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 animate-pulse">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Data uploaded successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <XCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Upload failed</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* CSV Format Help */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">CSV Format Requirements</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Must include columns: <code className="px-1 py-0.5 bg-gray-200 rounded">date</code> and <code className="px-1 py-0.5 bg-gray-200 rounded">demand</code></p>
            <p>• Date format: YYYY-MM-DD or MM/DD/YYYY</p>
            <p>• Minimum 7 days of historical data</p>
            <p>• Example:</p>
            <pre className="mt-2 p-2 bg-white rounded text-xs border border-gray-300">
date,demand
2024-01-01,120
2024-01-02,135
2024-01-03,128
            </pre>
          </div>
        </div>

        {/* Download Sample */}
        <button
          onClick={() => {
            const csv = 'date,demand\n2024-01-01,120\n2024-01-02,135\n2024-01-03,128\n2024-01-04,142\n2024-01-05,115\n2024-01-06,130\n2024-01-07,125';
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sample-demand-data.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Download Sample CSV
        </button>
      </div>
    </div>
  );
}
