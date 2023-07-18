/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('testimoni', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(30)',
      references: '"users"',
      notNull: true
    },
    name: {
      type: 'TEXT',
      notNull: true
    },
    testimoni: {
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
  pgm.dropTable('testimoni')
}
