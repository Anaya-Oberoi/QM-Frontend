/**
 * src/pages/HistoryPage.jsx
 *
 * Displays the user's past measurement calculations with filter controls.
 *
 * FILTERING:
 *   filterOp   — filter by operation type (convert, compare, add, subtract, divide).
 *   filterType — filter by measurement category (LengthUnit, WeightUnit, etc.).
 *
 *   When both filters are 'all', all operations are fetched in parallel and merged.
 *   When filterOp is set, a single targeted API call is made.
 *   When only filterType is set, all operations are fetched and filtered client-side
 *   (the backend has no combined type+operation filter endpoint).
 *
 *   NOTE: The "both filters active" path fetches by operation then filters by type
 *   client-side, which is correct but may return incomplete results if the backend
 *   paginates (not currently the case, but worth noting for future pagination work).
 *
 * PERFORMANCE NOTE (N+1 calls on "All Operations"):
 *   When no filter is set, 5 API calls are made in parallel. This is fine for
 *   a monolith. When migrating to microservices, add a backend endpoint
 *   GET /quantities/history/all to replace this with a single call.
 *
 * ROW RENDERING:
 *   formatDetails() builds a human-readable description of each history record
 *   based on its operation type. It handles error rows specially.
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { historyByOperation, historyByType } from '../api/client';
import { useToast } from '../context/ToastContext';

// ── Helper components ─────────────────────────────────────────────────────────

/** Colour-coded badge showing the operation name. */
function OpBadge({ op }) {
  if (!op) return <span>—</span>;
  return <span className={`op-badge ${op.toLowerCase()}`}>{op.toLowerCase()}</span>;
}

/**
 * Renders a human-readable summary of a history row.
 * The format varies by operation type.
 *
 * @param {object} row - A single record from the history API.
 */
function formatDetails(row) {
  const from = `${row.thisValue ?? ''} ${row.thisUnit ?? ''}`.trim();
  const to   = `${row.thatValue ?? ''} ${row.thatUnit ?? ''}`.trim();

  if (row.error) {
    return (
      <span style={{ color: 'var(--error)', fontSize: '.85rem' }}>
        {row.errorMessage || 'Error'}
      </span>
    );
  }

  if (row.operation === 'compare') {
    return <><strong>{from}</strong> vs <strong>{to}</strong> → <strong>{row.resultString}</strong></>;
  }

  if (row.operation === 'convert') {
    const result = `${row.resultValue ?? ''} ${row.resultUnit ?? ''}`.trim();
    return <><strong>{from}</strong> → <strong>{result}</strong></>;
  }

  // Arithmetic: add / subtract / divide
  const opSym = { add: '+', subtract: '−', divide: '÷' }[row.operation] || '?';
  const result = `${row.resultValue ?? ''} ${row.resultUnit ?? ''}`.trim();
  return <><strong>{from}</strong> {opSym} <strong>{to}</strong> = <strong>{result}</strong></>;
}

// ── Page component ────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [filterOp,   setFilterOp]   = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [rows,    setRows]    = useState(null);   // null = "not loaded yet"
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  /**
   * Fetch history records based on the current filter values.
   * Wrapped in useCallback so the useEffect below doesn't need to list
   * filterOp and filterType as direct dependencies (avoids stale closure).
   */
  const loadHistory = useCallback(async () => {
    setLoading(true);
    setRows(null);
    try {
      let data;

      if (filterOp !== 'all') {
        // Single operation filter — one API call
        data = await historyByOperation(filterOp);
      } else if (filterType !== 'all') {
        // Type filter only — one API call
        data = await historyByType(filterType);
      } else {
        /*
         * No filter — fetch all operations in parallel and merge.
         * Individual failures return [] so one bad endpoint doesn't
         * wipe out results from the others.
         */
        const [compare, convert, add, subtract, divide] = await Promise.all([
          historyByOperation('compare').catch(() => []),
          historyByOperation('convert').catch(() => []),
          historyByOperation('add').catch(() => []),
          historyByOperation('subtract').catch(() => []),
          historyByOperation('divide').catch(() => []),
        ]);
        data = [...compare, ...convert, ...add, ...subtract, ...divide];
      }

      /*
       * When BOTH filters are set, fetch by operation and filter by type
       * client-side (the backend has no combined endpoint for this).
       */
      if (filterOp !== 'all' && filterType !== 'all') {
        data = data.filter(r => r.thisMeasurementType === filterType);
      }

      setRows(data);
    } catch (err) {
      toast.show(err.message, 'error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filterOp, filterType, toast]);

  // Re-fetch whenever filters change.
  useEffect(() => { loadHistory(); }, [loadHistory]);

  return (
    <>
      <Navbar />
      <main className="history-page">

        <div className="page-header">
          <h1>Measurement History</h1>
          <p>Review your past calculations — filter by operation type or measurement category.</p>
        </div>

        {/* ── Filter controls ── */}
        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">Operation</label>
            <select className="filter-select" value={filterOp} onChange={e => setFilterOp(e.target.value)}>
              <option value="all">All Operations</option>
              <option value="compare">Compare</option>
              <option value="convert">Convert</option>
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="divide">Divide</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Measurement Type</label>
            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="LengthUnit">Length</option>
              <option value="WeightUnit">Weight</option>
              <option value="TemperatureUnit">Temperature</option>
              <option value="VolumeUnit">Volume</option>
            </select>
          </div>
          <button className="btn-refresh" onClick={loadHistory} disabled={loading}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Data table ── */}
        <div className="table-card">
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Operation</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading || rows === null ? (
                <tr className="empty-row"><td colSpan="4">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr className="empty-row"><td colSpan="4">No records found.</td></tr>
              ) : rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '.8rem' }}>#{i + 1}</td>
                  {/* Strip 'Unit' suffix for display: 'LengthUnit' → 'Length' */}
                  <td><span className="type-tag">{(row.thisMeasurementType || '').replace('Unit', '')}</span></td>
                  <td><OpBadge op={row.operation} /></td>
                  <td>{formatDetails(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </>
  );
}
