const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

    // creator: {
    //     type: Object,
    //     required: true
    // }
},
    { timestamps: true }
);

postSchema.methods.clearImageIfUpdated = function (updatedImageUrl) {
    if(updatedImageUrl === this.imageUrl) return;

    const fullFilePath = path.join(__dirname, '..', this.imageUrl);
    fs.unlink(fullFilePath, err => console.error(err));
}

module.exports = mongoose.model('Post', postSchema);