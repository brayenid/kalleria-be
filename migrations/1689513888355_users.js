/* eslint-disable */

const gender_enum = 'gender_enum'
exports.up = (pgm) => {
  const gender_values = ['laki-laki', 'perempuan']
  pgm.createType(gender_enum, gender_values)

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
    no_identitas: {
      type: 'TEXT',
      notNull: true
    },
    jenis_kelamin: {
      type: gender_enum,
      notNull: true
    },
    tempat_lahir: {
      type: 'TEXT',
      notNull: true
    },
    tanggal_lahir: {
      type: 'TEXT',
      notNull: true
    },
    alamat: {
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
    asal_sekolah: {
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
  pgm.dropTable('users')
  pgm.dropType(gender_enum)
}
