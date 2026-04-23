'use client'

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown, Tag } from 'lucide-react'
import { Transaction, formatCurrency, formatDate, CATEGORY_COLORS } from '../lib/categorize'

interface Props {
  transactions: Transaction[]
  onUpdateCategory: (id: string, category: string, subcategory: string) => void
}

export default function TransactionTable({ transactions, onUpdateCategory }: Props) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({ key: 'date', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<string | null>(null)
  const PER_PAGE = 20

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category))
    return ['all', ...Array.from(cats).sort()]
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions
      .filter(t => {
        if (filterType !== 'all' && t.type !== filterType) return false
        if (filterCategory !== 'all' && t.category !== filterCategory) return false
        if (search) {
          const q = search.toLowerCase()
          return t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.subcategory.toLowerCase().includes(q)
        }
        return true
      })
      .sort((a, b) => {
        let va: any = a[sort.key as keyof Transaction]
        let vb: any = b[sort.key as keyof Transaction]
        if (sort.key === 'amount') { va = Math.abs(Number(va)); vb = Math.abs(Number(vb)) }
        if (sort.key === 'date') { va = new Date(va).getTime(); vb = new Date(vb).getTime() }
        if (va < vb) return sort.dir === 'asc' ? -1 : 1
        if (va > vb) return sort.dir === 'asc' ? 1 : -1
        return 0
      })
  }, [transactions, filterType, filterCategory, search, sort])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  const toggleSort = (key: string) => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }))
    setPage(1)
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Header & filters */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h2 className="font-display" style={{ fontSize: 15, color: 'var(--text)', letterSpacing: '0.05em' }}>
            ALL TRANSACTIONS
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
            {filtered.length} of {transactions.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
            <input
              placeholder="Search transactions..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ paddingLeft: 34 }}
            />
          </div>
          {/* Type filter */}
          <select value={filterType} onChange={e => { setFilterType(e.target.value as any); setPage(1) }} style={{ flex: '0 0 130px' }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          {/* Category filter */}
          <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }} style={{ flex: '0 0 170px' }}>
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              {[
                { key: 'date', label: 'Date' },
                { key: 'description', label: 'Description' },
                { key: 'category', label: 'Category' },
                { key: 'amount', label: 'Amount' },
              ].map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    <ArrowUpDown size={11} style={{ opacity: sort.key === col.key ? 1 : 0.4 }} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
                  No transactions match your filters
                </td>
              </tr>
            ) : (
              paginated.map(t => (
                <tr key={t.id}>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: 'var(--text-3)' }}>
                      {formatDate(t.date) || t.date}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 14, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[t.category] || '#94a3b8', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, color: 'var(--text)' }}>{t.category}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{t.subcategory}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className="font-display"
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: t.amount >= 0 ? 'var(--green)' : 'var(--red)',
                      }}
                    >
                      {t.amount >= 0 ? '+' : ''}{formatCurrency(t.amount)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Prev
            </button>
            <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 13 }} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
