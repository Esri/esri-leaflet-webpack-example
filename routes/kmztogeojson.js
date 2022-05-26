var fs = require('fs').promises;
var express = require('express');
var router = express.Router();
const parseKMZ = require("parse2-kmz")

const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({storage: storage});
const upload = multer({dest: '.temp/'})

/* GET users listing. */
router.post('/', upload.any(), function(req, res, next) {
    const attachment = req.files[0];
    parseKMZ
        .toJson(attachment.path)
        .then(resp => {
            res.send(resp);
            fs.unlink(attachment.path)
        })
        .catch(console.error)
});

module.exports = router;
