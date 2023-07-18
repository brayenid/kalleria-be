/* eslint-disable  */

exports.up = (pgm) => {
  pgm.createTable('sertifikat', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    kelas_id: {
      type: 'VARCHAR(30)',
      references: '"kelas"',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      notNull: true
    },
    nama: {
      type: 'TEXT',
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
  pgm.dropTable('sertifikat')
}
