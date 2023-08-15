/* eslint-disable  */

exports.up = (pgm) => {
  pgm.createTable('absen', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      notNull: true
    },
    kelas_id: {
      type: 'VARCHAR(30)',
      references: '"kelas"',
      notNull: true
    },
    jumlah_pertemuan: {
      type: 'INTEGER',
      notNull: true
    },
    admin: {
      type: 'VARCHAR(30)',
      notNull: true
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
  pgm.dropTable('absen')
}
