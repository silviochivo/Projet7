const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ratingSchema = mongoose.Schema({
    userId: { type: String, required: true },
    grade: {
        type: Number,
        required: true,
        min: 1 // Minimum grade value is set to 1
    }
});

const bookSchema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true, unique: true},
    author: {type: String, required: true},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: true},
    genre: {type: String, required: true},
    ratings: {type: [ratingSchema], required: true},
    averageRating: {type: Number, required: true},
});

bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);