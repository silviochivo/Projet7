const express = require('express');
const router = express.Router();

const bookController = require('../controllers/Book');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.get('/bestrating',);
router.post('/', auth, multer, bookController.createBook );
router.post('/:id/rating', );
router.put('/:id',);
router.delete('/:id', auth, bookController.deleteBook);

module.exports = router;