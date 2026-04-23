'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Transaction, formatCurrency, CATEGORY_COLORS } from '../lib/categorize'

interface Props {
  transactions: Transaction[]
}

interface SubcategoryData {
  name: string
  amount: number
  count: number
  transactions: Transaction[]
}

interface CategoryData {
  name: string
  color: string
  amount: number
  count: number
  subcategories: SubcategoryData[]
  percentage: number
}

export default function CategoryBreakdown({ transactions }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [activeType, setActiveType] = useState<'expense' | 'income'>('expense')

  const filtered = transactions.filter(t => t.type === activeType)
  const total = filtered.reduce((s, t) => s + Math.abs(t.amount), 0)

  // Build category → subcategory map
  const categoryMap = new Map<string, Map<string, Transaction[]>>()
  filtered.forEach(t => {
    if (!categoryMap.has(t.category)) categoryMap.set(t.category, new Map())
    const subMap = categoryMap.get(t.category)!
    if (!subMap.has(t.subcategory)) subMap.set(t.subcategory, [])
    subMap.get(t.subcategory)!.push(t)
  })

  const categories: CategoryData[] = Array.from(categoryMap.entries())
    .map(([cat, subMap]) => {
      const subcategories: SubcategoryData[] = Array.from(subMap.entries())
        .map(([sub, txns]) => ({
          name: sub,
          amount: txns.reduce((s, t) => s + Math.abs(t.amount), 0),
          count: txns.length,
          transactions: txns,
        }))
        .sort((a, b) => b.amount - a.amount)

      const amount = subcategories.reduce((s, s2) => s + s2.amount, 0)
      return {
        name: cat,
        color: CATEGORY_COLORS[cat] || '#94a3b8',
        amount,
        count: subcategories.reduce((s, s2) => s + s2.count, 0),
        subcategories,
        percentage: total > 0 ? (amount / total) * 100 : 0,
      }
    })
    .sort((a, b) => b.amount - a.amount)

  const toggle = (cat: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <h2 className="font-display" style={{ fontSize: 15, color: 'var(--text)', letterSpacing: '0.05em' }}>
          CATEGORY BREAKDOWN
        </h2>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-3)', padding: 4, borderRadius: 10 }}>
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              style={{
                padding: '6px 16px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activeType === t ? 'var(--bg-4)' : 'transparent',
                color: activeType === t ? 'var(--text)' : 'var(--text-3)',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category list */}
      <div>
        {categories.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>
            No {activeType} transactions found
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.name} style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Category row */}
              <div
                onClick={() => toggle(cat.name)}
                style={{
                  padding: '16px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Expand icon */}
                <div style={{ color: 'var(--text-3)', flexShrink: 0 }}>
                  {expanded.has(cat.name)
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                  }
                </div>

                {/* Color dot */}
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />

                {/* Name & progress */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500, color: 'var(--text)', fontSize: 14 }}>{cat.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{cat.count} txns</span>
                      <span className="font-display" style={{ fontSize: 14, color: cat.color, fontWeight: 700, minWidth: 90, textAlign: 'right' }}>
                        {formatCurrency(cat.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        '--w': `${cat.percentage}%`,
                        width: `${cat.percentage}%`,
                        background: cat.color,
                        opacity: 0.7,
                      } as React.CSSProperties}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-display)' }}>
                    {cat.percentage.toFixed(1)}% of total
                  </div>
                </div>
              </div>

              {/* Subcategories */}
              {expanded.has(cat.name) && (
                <div style={{ background: 'rgba(0,0,0,0.2)' }}>
                  {cat.subcategories.map(sub => (
                    <div
                      key={sub.name}
                      style={{
                        padding: '12px 24px 12px 56px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: cat.color, opacity: 0.5, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{sub.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub.count} transactions</span>
                            <span className="font-display" style={{ fontSize: 13, color: 'var(--text)', minWidth: 80, textAlign: 'right' }}>
                              {formatCurrency(sub.amount)}
                            </span>
                          </div>
                        </div>
                        {/* Full transactions list */}
                        <div style={{ marginTop: 6 }}>
                          {sub.transactions.map(t => (
                            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12, color: 'var(--text-3)', gap: 12 }}>
                              <span style={{ wordBreak: 'break-word' }}>{t.description}</span>
                              <span style={{ color: t.amount >= 0 ? 'var(--green)' : 'var(--red)', fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                                {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
