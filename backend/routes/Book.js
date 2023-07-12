const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const optimizedImage = require('../middleware/sharp-config');
const bookController = require('../controllers/Book');

router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getBestBook);
router.get('/:id', bookController.getOneBook);
router.post('/:id/rating', auth, bookController.rateBook);
router.post('/', auth, multer, optimizedImage, bookController.createBook);
router.put('/:id', auth, multer, optimizedImage, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;