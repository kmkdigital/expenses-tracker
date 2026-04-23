'use client'

import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react'
import { Transaction, formatCurrency } from '../lib/categorize'

interface Props {
  transactions: Transaction[]
}

export default function SummaryCards({ transactions }: Props) {
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0)
  const net = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? ((net / totalIncome) * 100) : 0

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: 'var(--green)',
      bg: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.15)',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: 'var(--red)',
      bg: 'rgba(239,68,68,0.08)',
      border: 'rgba(239,68,68,0.15)',
    },
    {
      label: 'Net Balance',
      value: formatCurrency(net),
      icon: DollarSign,
      color: net >= 0 ? 'var(--green)' : 'var(--red)',
      bg: net >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
      border: net >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      prefix: net >= 0 ? '+' : '',
    },
    {
      label: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: 'var(--accent)',
      bg: 'rgba(124,106,247,0.08)',
      border: 'rgba(124,106,247,0.15)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`card animate-fade-up stagger-${i + 1}`}
          style={{ padding: '20px 24px', background: card.bg, borderColor: card.border }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {card.label}
            </span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: card.bg, border: `1px solid ${card.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon size={16} color={card.color} />
            </div>
          </div>
          <div className="font-display" style={{ fontSize: 24, color: card.color, fontWeight: 700 }}>
            {card.prefix}{card.value}
          </div>
        </div>
      ))}
    </div>
  )
}
