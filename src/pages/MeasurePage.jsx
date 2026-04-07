/**
 * src/pages/MeasurePage.jsx
 *
 * The main measurement calculator page.
 *
 * SUPPORTED MEASUREMENT TYPES:
 *   LengthUnit      — Feet, Inches, Yards, Centimeters
 *   WeightUnit      — Kilogram, Gram, Pound
 *   TemperatureUnit — Celsius, Fahrenheit, Kelvin
 *   VolumeUnit      — Litre, Millilitre, Gallon
 *
 * SUPPORTED OPERATIONS:
 *   convert   — Convert a value from one unit to another (same type only).
 *   compare   — Compare two quantities (same type, potentially different units).
 *   add       — Add two quantities.
 *   subtract  — Subtract the second quantity from the first.
 *   divide    — Divide the first quantity by the second.
 *
 * UNIT KEYS:
 *   The string keys in UNITS (e.g. 'FEET', 'KILOGRAM') must match the enum
 *   values expected by the backend exactly. If the backend renames a unit,
 *   update the UNITS map here.
 *
 * CUSTOM SELECT:
 *   A custom dropdown (CustomSelect) is used instead of <select> to support
 *   the app's visual design. It closes when the user clicks outside via a
 *   document click listener that is cleaned up on unmount.
 *
 * RESULT DISPLAY:
 *   The result panel appears below the form after a successful API response.
 *   On error, the toast system is used — no inline error state.
 */

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { measure } from '../api/client';

const UNITS = {
  LengthUnit: [
    { key: 'FEET', label: 'Feet' },
    { key: 'INCHES', label: 'Inches' },
    { key: 'YARDS', label: 'Yards' },
    { key: 'CENTIMETERS', label: 'Centimeters' },
  ],
  WeightUnit: [
    { key: 'KILOGRAM', label: 'Kilogram' },
    { key: 'GRAM', label: 'Gram' },
    { key: 'POUND', label: 'Pound' },
  ],
  TemperatureUnit: [
    { key: 'CELSIUS', label: 'Celsius' },
    { key: 'FAHRENHEIT', label: 'Fahrenheit' },
    { key: 'KELVIN', label: 'Kelvin' },
  ],
  VolumeUnit: [
    { key: 'LITRE', label: 'Litre' },
    { key: 'MILLILITRE', label: 'Millilitre' },
    { key: 'GALLON', label: 'Gallon' },
  ],
};

function CustomSelect({ units, selectedKey, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selectedLabel = units.find(u => u.key === selectedKey)?.label || selectedKey;

  useEffect(() => {
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="select-wrapper" ref={ref}>
      <button className={`select-btn${open ? ' open' : ''}`} type="button" onClick={() => setOpen(o => !o)}>
        <span>{selectedLabel}</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="select-menu open">
          {units.map(u => (
            <div
              key={u.key}
              className={`select-option${u.key === selectedKey ? ' selected' : ''}`}
              onClick={() => { onSelect(u.key); setOpen(false); }}
            >
              {u.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TypeCards({ activeType, onChange }) {
  const types = [
    {
      key: 'LengthUnit', label: 'Length',
      icon: (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <g transform="rotate(-30 32 32)">
            <rect x="6" y="24" width="52" height="16" rx="4" fill="#DBEAFE" />
            <rect x="6" y="24" width="52" height="16" rx="4" fill="none" stroke="#3B82F6" strokeWidth="4" />
            <path d="M14 24v6M22 24v4M30 24v6M38 24v4M46 24v6" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      ),
    },
    {
      key: 'WeightUnit', label: 'Weight',
      icon: (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M18 56h28c4.4 0 6-3.6 5-8l-3-20c-1-6-4-10-16-10-12 0-15 4-16 10l-3 20c-1 4.4.6 8 5 8z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="4" strokeLinejoin="round" />
          <path d="M26 18v-6c0-3.3 2.7-6 6-6s6 2.7 6 6v6" fill="none" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
          <line x1="22" y1="36" x2="42" y2="36" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'TemperatureUnit', label: 'Temperature',
      icon: (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M32 6c-4.4 0-8 3.6-8 8v24.5c-3.6 2.6-6 6.8-6 11.5 0 7.7 6.3 14 14 14 7.7 0 14-6.3 14-14 0-4.7-2.4-8.9-6-11.5V14c0-4.4-3.6-8-8-8z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="4" strokeLinejoin="round" />
          <circle cx="32" cy="50" r="8" fill="#EF4444" />
          <path d="M29 50V26h6v24z" fill="#EF4444" />
          <line x1="20" y1="20" x2="24" y2="20" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="20" y1="28" x2="24" y2="28" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'VolumeUnit', label: 'Volume',
      icon: (
        <svg width="40" height="40" viewBox="0 0 64 64">
          <path d="M16 12l4 38c.5 4 3 6 12 6 9 0 11.5-2 12-6l4-38" fill="#CFFAFE" stroke="#06B6D4" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M18 32l2 18c.5 4 3 6 12 6 9 0 11.5-2 12-6l2-18z" fill="#06B6D4" />
          <ellipse cx="32" cy="12" rx="16" ry="4" fill="none" stroke="#06B6D4" strokeWidth="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="type-cards">
      {types.map(t => (
        <button
          key={t.key}
          className={`type-card${activeType === t.key ? ' active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function MeasurePage() {
  const [type, setType] = useState('LengthUnit');
  const [action, setAction] = useState('compare');
  const [fromVal, setFromVal] = useState('1');
  const [toVal, setToVal] = useState('1000');
  const [fromUnit, setFromUnit] = useState('FEET');
  const [toUnit, setToUnit] = useState('INCHES');
  const [operator, setOperator] = useState('add');
  const [opDropOpen, setOpDropOpen] = useState(false);
  const [result, setResult] = useState({ text: 'Select type and action, then click Calculate.', state: 'muted' });
  const [calculating, setCalculating] = useState(false);
  const [fromErr, setFromErr] = useState(false);
  const [toErr, setToErr] = useState(false);
  const [convertedVal, setConvertedVal] = useState('');

  const units = UNITS[type] || [];

  function handleTypeChange(newType) {
    const u = UNITS[newType] || [];
    setType(newType);
    setFromUnit(u[0]?.key || '');
    setToUnit(u[1]?.key || u[0]?.key || '');
    if (newType === 'TemperatureUnit' && action === 'arithmetic') {
      setAction('compare');
    }
    setResult({ text: 'Click Calculate to get started.', state: 'muted' });
  }

  function handleActionChange(a) {
    setAction(a);
    setResult({ text: 'Click Calculate to get started.', state: 'muted' });
    if (a === 'convert') setConvertedVal('');
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult({ text: 'Units swapped. Click Calculate.', state: 'muted' });
  }

  async function calculate() {
    setFromErr(false);
    setToErr(false);
    const fromV = parseFloat(fromVal);
    const toV   = parseFloat(toVal);
    let hasErr = false;
    if (isNaN(fromV)) { setFromErr(true); hasErr = true; }
    if (action !== 'convert' && isNaN(toV)) { setToErr(true); hasErr = true; }
    if (hasErr) { setResult({ text: 'Please enter valid numbers.', state: 'error' }); return; }

    const operation = action === 'arithmetic' ? operator : action;
    const dto = {
      thisQuantityDTO: { value: fromV, unit: fromUnit, measurementType: type },
      thatQuantityDTO: { value: action === 'convert' ? 0 : toV, unit: toUnit, measurementType: type },
    };
    if (action === 'arithmetic') {
      dto.targetUnitDTO = { value: 0, unit: fromUnit, measurementType: type };
    }

    setCalculating(true);
    try {
      const res = await measure(operation, dto);
      if (res.error) { setResult({ text: res.errorMessage || 'An error occurred.', state: 'error' }); return; }

      const fLabel = units.find(u => u.key === res.thisUnit)?.label || res.thisUnit || '';
      const tLabel = units.find(u => u.key === res.thatUnit)?.label || res.thatUnit || '';
      const rLabel = units.find(u => u.key === res.resultUnit)?.label || res.resultUnit || '';

      let text = '';
      if (operation === 'compare') {
        const eq = res.resultString === 'true';
        text = `${res.thisValue} ${fLabel} ${eq ? '=' : '≠'} ${res.thatValue} ${tLabel} — ${eq ? 'Equal' : 'Not Equal'}`;
      } else if (operation === 'convert') {
        setConvertedVal(res.resultValue);
        text = `${res.thisValue} ${fLabel} = ${res.resultValue} ${rLabel}`;
      } else {
        const sym = { add: '+', subtract: '−', divide: '÷' }[operation] || operation;
        text = `${res.thisValue} ${fLabel} ${sym} ${res.thatValue} ${tLabel} = ${res.resultValue} ${rLabel}`;
      }
      setResult({ text, state: 'success' });
    } catch (err) {
      setResult({ text: err.message, state: 'error' });
    } finally {
      setCalculating(false);
    }
  }

  const opLabels = { add: '+', subtract: '−', divide: '÷' };
  const arithDisabled = type === 'TemperatureUnit';

  return (
    <>
      <Navbar />
      <main className="measure-page">

        {/* TYPE SELECTION */}
        <div className="panel-card">
          <p className="section-label">Choose Type</p>
          <TypeCards activeType={type} onChange={handleTypeChange} />
        </div>

        {/* ACTION + INPUTS */}
        <div className="panel-card">
          <p className="section-label">Choose Action</p>
          <div className="action-tabs">
            {[
              { key: 'compare', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: 'Comparison' },
              { key: 'convert', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 3 20 7 16 11"/><line x1="4" y1="7" x2="20" y2="7"/><polyline points="8 21 4 17 8 13"/><line x1="20" y1="17" x2="4" y2="17"/></svg>, label: 'Conversion' },
              { key: 'arithmetic', icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>, label: 'Arithmetic' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-btn${action === tab.key ? ' active' : ''}${tab.key === 'arithmetic' && arithDisabled ? ' tab-disabled' : ''}`}
                onClick={() => !(tab.key === 'arithmetic' && arithDisabled) && handleActionChange(tab.key)}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="input-grid">
            {/* FROM */}
            <div className="input-col">
              <label className="input-label">{action === 'arithmetic' ? 'VALUE 1' : 'FROM'}</label>
              <input
                className={`num-input${fromErr ? ' is-error' : ''}`}
                type="number"
                value={fromVal}
                onChange={e => setFromVal(e.target.value)}
                placeholder="0"
              />
              <CustomSelect units={units} selectedKey={fromUnit} onSelect={setFromUnit} />
            </div>

            {/* CENTER */}
            <div className="center-bridge">
              {action === 'arithmetic' ? (
                <div style={{ position: 'relative' }}>
                  <button
                    className="center-circle"
                    type="button"
                    onClick={() => setOpDropOpen(o => !o)}
                  >
                    {opLabels[operator]}
                  </button>
                  {opDropOpen && (
                    <div className="op-dropdown open">
                      {['add', 'subtract', 'divide'].map(op => (
                        <div
                          key={op}
                          className={`op-option${operator === op ? ' active' : ''}`}
                          onClick={() => { setOperator(op); setOpDropOpen(false); }}
                        >
                          {opLabels[op]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button className="center-circle" type="button" onClick={handleSwap}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              )}
            </div>

            {/* TO */}
            <div className="input-col">
              <label className="input-label">{action === 'arithmetic' ? 'VALUE 2' : 'TO'}</label>
              <input
                className={`num-input${toErr ? ' is-error' : ''}`}
                type="number"
                value={action === 'convert' ? convertedVal : toVal}
                onChange={e => action !== 'convert' && setToVal(e.target.value)}
                readOnly={action === 'convert'}
                style={action === 'convert' ? { background: 'var(--bg)', color: 'var(--text-muted)' } : {}}
                placeholder="0"
              />
              <CustomSelect units={units} selectedKey={toUnit} onSelect={setToUnit} />
            </div>
          </div>

          <button className="btn-calculate" onClick={calculate} disabled={calculating}>
            {calculating ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Calculating…
              </>
            ) : (
              <>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                Calculate
              </>
            )}
          </button>

          <div className="result-section">
            <p className="section-label">Result</p>
            <div className="result-box">
              <div className={`result-indicator${result.state === 'success' ? ' success' : result.state === 'error' ? ' error' : ''}`} />
              <div className={`result-text${result.state === 'error' ? ' error' : result.state === 'muted' ? ' muted' : ''}`}>
                {result.text}
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
