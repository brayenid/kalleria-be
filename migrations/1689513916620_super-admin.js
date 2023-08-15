/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('super_admin', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    username: {
      type: 'TEXT',
      notNull: true,
      unique: true
    },
    nama: {
      type: 'TEXT',
      notNull: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    role: {
      type: 'TEXT',
      default: 'sudo'
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
  pgm.dropTable('super_admin')
}
