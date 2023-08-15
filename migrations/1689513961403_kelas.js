/* eslint-disable */

exports.up = (pgm) => {
  pgm.createTable('kelas', {
    id: {
      type: 'VARCHAR(30)',
      primaryKey: true
    },
    nama_kelas: {
      type: 'TEXT',
      notNull: true
    },
    harga_kelas: {
      type: 'INTEGER',
      notNull: true
    },
    tipe_kelas: {
      type: 'TEXT',
      notNull: true
    },
    deskripsi_kelas: {
      type: 'TEXT',
      notNull: true
    },
    thumbnail_kelas: {
      type: 'TEXT',
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
  pgm.dropTable('kelas')
}
