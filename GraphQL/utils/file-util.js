const path = require('path');
const fs = require('fs');

exports.clearImage = (imageUrl) => {
    const fullFilePath = path.join(__dirname, '..', imageUrl);
    fs.unlink(fullFilePath, err => console.error(err));
}
