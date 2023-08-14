/* eslint-disable  */

exports.up = (pgm) => {
  pgm.createTable('sertifikat', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    kelas_user_id: {
      type: 'VARCHAR(40)',
      references: '"kelas_users"',
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
