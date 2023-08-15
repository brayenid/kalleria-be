/* eslint-disable */
const transactions_status_enum = 'transactions_status_enum'

exports.up = (pgm) => {
  const transactions_values = ['pending', 'dibayar', 'ditolak', 'diterima']
  pgm.createType(transactions_status_enum, transactions_values)

  pgm.createTable('transaksi_beli_kelas', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      onDelete: 'cascade',
      notNull: true
    },
    kelas_id: {
      type: 'VARCHAR(30)',
      references: '"kelas"',
      onDelete: 'cascade',
      notNull: true
    },
    status: {
      type: transactions_status_enum,
      default: 'pending',
      notNull: true
    },
    url_bukti_bayar: {
      type: 'TEXT',
      default: null
    },
    message: {
      type: 'TEXT',
      default: null
    },
    accepted_by: {
      type: 'VARCHAR(30)',
      default: null
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('transaksi_beli_kelas')
  pgm.dropType(transactions_status_enum)
}
