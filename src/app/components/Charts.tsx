'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Transaction, CATEGORY_COLORS, formatCurrency } from '../lib/categorize'

interface Props {
  transactions: Transaction[]
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null
  return (
    <div style={{
      background: 'var(--bg-3)',
      border: '1px solid var(--border-strong)',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
        {payload[0].name}
      </div>
      <div style={{ color: payload[0].payload?.color || 'var(--accent)' }}>
        {formatCurrency(payload[0].value)}
      </div>
    </div>
  )
}

export default function Charts({ transactions }: Props) {
  const expenses = transactions.filter(t => t.type === 'expense')

  // Pie data by category
  const catMap = new Map<string, number>()
  expenses.forEach(t => {
    catMap.set(t.category, (catMap.get(t.category) || 0) + Math.abs(t.amount))
  })
  const pieData = Array.from(catMap.entries())
    .map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name] || '#94a3b8' }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  // Monthly bar data
  const monthMap = new Map<string, { income: number; expense: number }>()
  transactions.forEach(t => {
    if (!t.date) return
    const d = new Date(t.date)
    if (isNaN(d.getTime())) return
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!monthMap.has(key)) monthMap.set(key, { income: 0, expense: 0 })
    const entry = monthMap.get(key)!
    if (t.type === 'income') entry.income += t.amount
    else entry.expense += Math.abs(t.amount)
  })
  const barData = Array.from(monthMap.entries())
    .map(([month, vals]) => ({ month, ...vals }))
    .slice(-6)

  if (pieData.length === 0) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Pie chart */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 13, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 20 }}>
          EXPENSES BY CATEGORY
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 8 }}>
          {pieData.slice(0, 6).map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{d.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="font-display" style={{ fontSize: 13, color: 'var(--text-3)', letterSpacing: '0.08em', marginBottom: 20 }}>
          INCOME vs EXPENSES
        </h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={18}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: 'var(--text-3)', fontFamily: 'var(--font-display)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--text-3)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload) return null
                  return (
                    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border-strong)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                      <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 6 }}>{label}</div>
                      {payload.map((p: any) => (
                        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
                          {p.name}: {formatCurrency(p.value)}
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              <Bar dataKey="income" name="Income" fill="var(--green)" opacity={0.7} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expenses" fill="var(--red)" opacity={0.7} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>
            Not enough date data for chart
          </div>
        )}
      </div>
    </div>
  )
}
