/* eslint-disable */
const transactions_status_enum = 'transactions_status_enum'

exports.up = (pgm) => {
  const transactions_values = ['pending', 'ditolak', 'diterima']
  pgm.createType(transactions_status_enum, transactions_values)

  pgm.createTable('transaksi_beli_kelas', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      onDelete: 'cascade'
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
    admin: {
      type: 'VARCHAR(30)',
      references: '"admins"',
      onDelete: 'cascade'
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('transaksi_beli_kelas')
  pgm.dropType(transactions_status_enum)
}
