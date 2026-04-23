'use client'

import { useState } from 'react'
import { Upload, RotateCcw, Download } from 'lucide-react'
import { Transaction } from './lib/categorize'
import CSVUploader from './components/CSVUploader'
import SummaryCards from './components/SummaryCards'
import CategoryBreakdown from './components/CategoryBreakdown'
import Charts from './components/Charts'
import TransactionTable from './components/TransactionTable'

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [view, setView] = useState<'upload' | 'dashboard'>('upload')

  const handleImport = (txns: Transaction[]) => {
    setTransactions(txns)
    setView('dashboard')
  }

  const handleReset = () => {
    setTransactions([])
    setView('upload')
  }

  const handleUpdateCategory = (id: string, category: string, subcategory: string) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, category, subcategory } : t)
    )
  }

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Amount', 'Type', 'Category', 'Subcategory']
    const rows = transactions.map(t => [
      t.date, `"${t.description}"`, t.amount, t.type, t.category, t.subcategory
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'transactions-categorized.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (view === 'upload') return <CSVUploader onImport={handleImport} />

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px' }}>
      {/* Top nav */}
      <div className="animate-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <div className="font-display" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.15em', marginBottom: 4 }}>
            LEDGER_v1.0
          </div>
          <h1 className="font-display" style={{ fontSize: 22, color: 'var(--text)' }}>
            Expense Tracker Dashboard
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>
            {transactions.length} transactions imported and categorized
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={exportCSV}>
            <Download size={15} />
            Export
          </button>
          <button className="btn btn-ghost" onClick={handleReset}>
            <RotateCcw size={15} />
            New Import
          </button>
          <button className="btn btn-primary" onClick={handleReset}>
            <Upload size={15} />
            Import CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="animate-fade-up stagger-1" style={{ marginBottom: 24 }}>
        <SummaryCards transactions={transactions} />
      </div>

      {/* Charts */}
      <div className="animate-fade-up stagger-2" style={{ marginBottom: 24 }}>
        <Charts transactions={transactions} />
      </div>

      {/* Category Breakdown */}
      <div className="animate-fade-up stagger-3" style={{ marginBottom: 24 }}>
        <CategoryBreakdown transactions={transactions} />
      </div>

      {/* Transaction Table */}
      <div className="animate-fade-up stagger-4">
        <TransactionTable transactions={transactions} onUpdateCategory={handleUpdateCategory} />
      </div>
    </div>
  )
}
