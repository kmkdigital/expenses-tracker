'use client'

import { useRef, useState } from 'react'
import Papa from 'papaparse'
import { Upload, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { categorizeTransaction, detectColumns, parseAmount, Transaction } from '../lib/categorize'

interface Props {
  onImport: (transactions: Transaction[]) => void
}

const SAMPLE_CSV = `Date,Description,Amount
2024-01-02,Salary Direct Deposit,3500.00
2024-01-03,Starbucks Coffee,-5.40
2024-01-04,Walmart Grocery,-89.23
2024-01-05,Netflix Subscription,-15.99
2024-01-07,Uber Ride,-12.50
2024-01-08,Shell Gas Station,-55.20
2024-01-10,Rent Payment,-1400.00
2024-01-12,McDonalds,-9.75
2024-01-14,AT&T Phone Bill,-65.00
2024-01-15,Freelance Invoice Payment,800.00
2024-01-17,Amazon Purchase,-34.99
2024-01-18,LA Fitness Membership,-29.99
2024-01-20,Whole Foods Market,-67.45
2024-01-22,Spotify Premium,-9.99
2024-01-23,Electric Bill,-110.00
2024-01-25,DoorDash Food Delivery,-23.50
2024-01-26,H&M Clothing,-89.00
2024-01-28,Doctor Visit Copay,-25.00
2024-01-29,Salary Direct Deposit,3500.00
2024-01-30,CVS Pharmacy,-18.40`

export default function CSVUploader({ onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [parsing, setParsing] = useState(false)

  const processCSV = (text: string) => {
    setParsing(true)
    setError('')
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<Record<string, string>>) => {
        try {
          const headers = results.meta.fields || []
          if (headers.length === 0) throw new Error('No headers found in CSV')

          const cols = detectColumns(headers)
          if (!cols.date && !cols.description) {
            throw new Error('Could not detect date/description columns. Please check your CSV format.')
          }

          const transactions: Transaction[] = []

          results.data.forEach((row: any, i) => {
            const dateVal = row[cols.date] || ''
            const descVal = row[cols.description] || `Transaction ${i + 1}`
            let amount = 0

            if (cols.amount && row[cols.amount]) {
              amount = parseAmount(row[cols.amount])
            } else if (cols.credit && cols.debit) {
              const credit = parseAmount(row[cols.credit])
              const debit = parseAmount(row[cols.debit])
              amount = credit > 0 ? credit : -Math.abs(debit)
            }

            if (amount === 0 && descVal) amount = 0

            const { category, subcategory, type } = categorizeTransaction(descVal, amount)

            transactions.push({
              id: `txn_${i}_${Date.now()}`,
              date: dateVal,
              description: descVal,
              amount,
              type: amount >= 0 ? (category === 'Income' ? 'income' : 'income') : 'expense',
              category,
              subcategory,
              rawRow: row,
            })
          })

          // Re-classify: if amount positive → income type, negative → expense
          const classified = transactions.map(t => ({
            ...t,
            type: (t.amount >= 0 ? 'income' : 'expense') as 'income' | 'expense',
          }))

          onImport(classified)
        } catch (e: any) {
          setError(e.message)
        }
        setParsing(false)
      },
      error: (e: Error) => {
        setError(`Parse error: ${e.message}`)
        setParsing(false)
      }
    })
  }

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a CSV file')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => processCSV(e.target?.result as string)
    reader.readAsText(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const loadSample = () => processCSV(SAMPLE_CSV)

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div style={{ maxWidth: 560, width: '100%' }}>
        {/* Header */}
        <div className="animate-fade-up stagger-1 text-center mb-10">
          <div className="font-display text-sm mb-4" style={{ color: 'var(--accent)', letterSpacing: '0.15em' }}>
            LEDGER_v1.0
          </div>
          <h1 className="font-display text-4xl mb-3" style={{ color: 'var(--text)', lineHeight: 1.15 }}>
            Smart Expense<br />Tracker
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 16, lineHeight: 1.6 }}>
            Import your bank statement CSV and instantly see<br />
            where every dollar goes — categorized automatically.
          </p>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone animate-fade-up stagger-2 ${dragging ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{ padding: '48px 32px', textAlign: 'center', cursor: 'pointer' }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            style={{ display: 'none' }}
          />
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
            background: 'rgba(124,106,247,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {parsing
              ? <div style={{ width: 28, height: 28, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <Upload size={28} color="var(--accent)" />
            }
          </div>
          <div className="font-display" style={{ fontSize: 16, color: 'var(--text)', marginBottom: 8 }}>
            {parsing ? 'Analyzing transactions...' : 'Drop your bank CSV here'}
          </div>
          <div style={{ color: 'var(--text-3)', fontSize: 13 }}>
            or click to browse · .csv files only
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="animate-fade-in" style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', gap: 10, alignItems: 'flex-start',
          }}>
            <AlertCircle size={16} color="var(--red)" style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'var(--red)' }}>{error}</span>
          </div>
        )}

        {/* Supported formats */}
        <div className="animate-fade-up stagger-3" style={{ marginTop: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
            SUPPORTED FORMATS
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Date, Description, Amount', 'Date, Memo, Debit, Credit', 'Transaction Date, Details, Value'].map(fmt => (
              <div key={fmt} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: 'var(--bg-3)', border: '1px solid var(--border)',
                fontSize: 12, color: 'var(--text-3)',
              }}>
                <FileText size={12} />
                <code>{fmt}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Sample button */}
        <div className="animate-fade-up stagger-4" style={{ marginTop: 24, textAlign: 'center' }}>
          <button className="btn btn-ghost" onClick={loadSample} disabled={parsing}>
            <Sparkles size={15} />
            Try with sample data
          </button>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
