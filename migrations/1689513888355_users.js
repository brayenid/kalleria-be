/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    username: {
      type: 'TEXT',
      unique: true,
      notNull: true
    },
    nama: {
      type: 'TEXT',
      notNull: true
    },
    email: {
      type: 'TEXT',
      notNull: true
    },
    no_telepon: {
      type: 'VARCHAR(20)',
      notNull: true
    },
    password: {
      type: 'TEXT',
      notNull: true
    },
    pekerjaan: {
      type: 'TEXT',
      notNull: true
    },
    no_identitas: {
      type: 'TEXT',
      notNull: true
    },
    url_foto: {
      type: 'TEXT',
      default: null
    },
    role: {
      type: 'TEXT',
      default: 'user'
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
  pgm.dropTable('users')
}
