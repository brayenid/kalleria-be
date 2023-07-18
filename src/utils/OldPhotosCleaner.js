const fs = require('fs')

exports.oldPhotosCleaner = (destinationPath, urlFoto) => {
  fs.readdir(destinationPath, (err, files) => {
    if (err) {
      console.log(err)
      return
    }

    // GET PHOTOS PATH WITHOUT EXTENSION
    const getPhotoPathWannaDeleteNoExt = urlFoto.split('/')[2].split('.')[0].split('_').slice(0, 2).join('_')

    // GET ALL PHOTOS THAT BELONG TO THE USER, AND EXCLUDE THE NEW ONE
    const photosExceptTheNewOne = files.filter((file) => file.includes(getPhotoPathWannaDeleteNoExt))
    photosExceptTheNewOne.sort((a, b) => {
      const timestampA = parseInt(a.split('_')[2].split('.')[0])
      const timestampB = parseInt(b.split('_')[2].split('.')[0])
      return timestampA - timestampB
    })
    photosExceptTheNewOne.pop()

    // UNLINK OLD PHOTOS
    photosExceptTheNewOne.forEach((file) => {
      const pathToDelete = 'src/public/uploads/foto'
      fs.unlink(`${pathToDelete}/${file}`, (err) => {
        if (err) {
          console.error(`Gagal menghapus file ${file}:`, err)
        }
      })
    })
  })
}
