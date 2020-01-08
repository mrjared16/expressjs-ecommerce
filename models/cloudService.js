const multer = require('multer');
const memoryStorage = multer.memoryStorage();

let singleUpload = multer({
    storage: memoryStorage,
    limits: {fileSize: 1000000, files: 1}
})

const multiUpload = multer({
    storage: memoryStorage,
    limits: {fileSize: 1000000, files: 3}
})

module.exports = {
    singleUpload,
    multiUpload
}