/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('admins', {
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
      default: 'admin'
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
  pgm.dropTable('admins')
}
