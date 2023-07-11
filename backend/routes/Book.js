const express = require('express');
const router = express.Router();

const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const bookController = require('../controllers/Book');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.get('/bestrating', bookController.getBestBook);
router.post('/', auth, multer, bookController.createBook);
router.post('/:id/rating', auth, bookController.rateBook);
router.put('/:id', auth, multer, bookController.updateBook);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;