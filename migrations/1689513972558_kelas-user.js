/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('kelas_users', {
    id: {
      type: 'VARCHAR(30)',
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
    maksimal_pertemuan: {
      type: 'INTEGER',
      notNull: true
    },
    presensi: {
      type: 'INTEGER',
      default: 0
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
  pgm.dropTable('kelas_users')
}
