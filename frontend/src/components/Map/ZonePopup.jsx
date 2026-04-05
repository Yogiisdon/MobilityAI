import React from 'react'
import { rgbStr } from '../../utils/colors'
import MiniSparkline from '../Charts/MiniSparkline'

export default function ZonePopup({ zone, demand, norm, rgb, history, delta }) {
  const col = rgbStr(rgb)
  const pct = demand > 0 && delta !== 0 ? Math.round((delta / (demand - delta || 1)) * 100) : 0
  const tier = norm >= 0.65 ? 'High' : norm >= 0.3 ? 'Medium' : 'Low'
  const safeHistory = Array.isArray(history) && history.length > 0 ? history.slice(-12) : Array(12).fill(0)

  return (
    <div style={{
      padding: '10px 12px',
      width: 175,           /* ✅ fixed width, no minWidth */
      maxWidth: 175,
      boxSizing: 'border-box',
      fontFamily: "'IBM Plex Sans', sans-serif",
      color: '#d8dce8',
      overflow: 'hidden',
    }}>
      {/* Zone name */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
        color: col, marginBottom: 2, letterSpacing: 1,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {zone.name.toUpperCase()}
      </div>

      {/* Subtitle */}
      <div style={{
        fontSize: 11, color: '#5a6080', marginBottom: 8,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {zone.reg} · {zone.type}
      </div>

      {/* Demand number */}
      <div style={{ fontSize: 24, fontWeight: 300, color: col, lineHeight: 1, marginBottom: 8 }}>
        {demand ?? '—'}
        <span style={{ fontSize: 11, color: '#5a6080', marginLeft: 5 }}>rides</span>
      </div>

      {/* VS PREV + DEMAND row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8, color: '#5a6080', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: 1 }}>VS PREV</div>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: delta >= 0 ? '#30d880' : '#f04060' }}>
            {delta >= 0 ? '+' : ''}{delta} ({pct >= 0 ? '+' : ''}{pct}%)
          </div>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 8, color: '#5a6080', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', letterSpacing: 1 }}>DEMAND</div>
          <div style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: col }}>{tier}</div>
        </div>
      </div>

      {/* Sparkline — width matches container */}
      <MiniSparkline data={safeHistory} color={col} width={151} height={26} />
    </div>
  )
}