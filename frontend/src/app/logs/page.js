'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function Logs() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [errorSummary, setErrorSummary] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) {
      loadLogs();
      loadErrorSummary();
    }
  }, [token, filters]);

  const loadLogs = async () => {
    try {
      const data = await api.getLogs(token, filters);
      setLogs(data.logs || []);
    } catch (err) {
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadErrorSummary = async () => {
    try {
      const data = await api.getErrorSummary(token);
      setErrorSummary(data);
    } catch (err) {
      console.error('Error loading summary:', err);
    }
  };

  const getStatusColor = (code) => {
    if (code < 300) return 'text-green-600 bg-green-50';
    if (code < 400) return 'text-blue-600 bg-blue-50';
    if (code < 500) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (authLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Transaction Logs</h1>

      {errorSummary && errorSummary.summary && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-3 text-red-800">🤖 AI Error Summary</h2>
          <p className="text-red-700 mb-3">{errorSummary.summary}</p>
          {errorSummary.errorCount > 0 && (
            <p className="text-sm text-red-600">Total errors: {errorSummary.errorCount}</p>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 border rounded"
            onChange={(e) => setFilters({...filters, http_method: e.target.value || undefined})}
          >
            <option value="">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <select
            className="px-3 py-2 border rounded"
            onChange={(e) => setFilters({...filters, status_code: e.target.value || undefined})}
          >
            <option value="">All Status Codes</option>
            <option value="200">200 (Success)</option>
            <option value="201">201 (Created)</option>
            <option value="400">400 (Bad Request)</option>
            <option value="401">401 (Unauthorized)</option>
            <option value="404">404 (Not Found)</option>
            <option value="500">500 (Server Error)</option>
          </select>

          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                      {log.http_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{log.endpoint}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(log.status_code)}`}>
                      {log.status_code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600">
                    {log.error_message ? (
                      <span className="truncate block max-w-xs" title={log.error_message}>
                        {log.error_message}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No logs found
          </div>
        )}
      </div>
    </div>
  );
}