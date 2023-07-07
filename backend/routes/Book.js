const express = require('express');
const router = express.Router();

const bookController = require('../controllers/Book');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getOneBook);
router.get('/bestrating',);
router.post('/', );
router.put('/:id',);
router.delete('/:id',);
router.post('/:id/rating',);

module.exports = router;