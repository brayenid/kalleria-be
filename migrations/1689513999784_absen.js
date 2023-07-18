/* eslint-disable  */

exports.up = (pgm) => {
  pgm.createTable('absen', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      notNull: true
    },
    kelas_user_id: {
      type: 'VARCHAR(30)',
      references: '"kelas_users"',
      notNull: true
    },
    jumlah_pertemuan: {
      type: 'INTEGER',
      notNull: true
    },
    tanggal: {
      type: 'TEXT',
      notNull: true
    },
    admin: {
      type: 'VARCHAR(30)',
      references: '"admins"',
      notNull: true
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('absen')
}
