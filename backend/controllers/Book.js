const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: imageUrl,
        averageRating: bookObject.ratings[0].grade
    });
    book.save()
        .then(() => { res.status(201).json({message: 'Livre enregistré!'})})
        .catch(error => { res.status(400).json( { error })});
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Livre supprimé!' })})
                        .catch(error => res.status(401).json({error}));
                })
            }
        })
        .catch(error => res.status(500).json({error}));
};

exports.updateBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}`,
    } : { ...req.body };
    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: unauthorized request' });
            } else if (req.file) {
                const filename = book.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => { });
            }
            Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(res.status(200).json({ message: 'Livre modifié! ' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};

exports.getBestBook = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(401).json({ error }));
};

exports.rateBook = async (req, res, next) => {
    const user = req.body.userId;
    if (user !== req.auth.userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
  
    try {
      const book = await Book.findOne({ _id: req.params.id });
      if (book.ratings.find(rating => rating.userId === user)) {
        return res.status(401).json({ message: 'Livre déjà noté' });
      }
  
      const newRating = {
        userId: user,
        grade: req.body.rating,
        _id: req.body._id
      };
  
      const updatedRatings = [...book.ratings, newRating];
  
      const calcAverageRating = ratings => {
        const sumRatings = ratings.reduce((total, rate) => total + rate.grade, 0);
        const average = sumRatings / ratings.length;
        return parseFloat(average.toFixed(2));
      };
  
      const updateAverageRating = calcAverageRating(updatedRatings);
  
      const updatedBook = await Book.findOneAndUpdate(
        { _id: req.params.id, 'ratings.userId': { $ne: user } },
        { $push: { ratings: newRating }, averageRating: updateAverageRating },
        { new: true }
      );
  
      res.status(201).json(updatedBook);
    } catch (error) {
      res.status(401).json({ error });
    }
};
