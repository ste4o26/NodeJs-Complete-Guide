exports.uploadImage = (req, res, next) => {
    if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

    if (!req.file)
        return res
            .status(200)
            .json({ message: 'No file provided!' })

    if (req.body.oldPath)
        fileUtil.clearImage(oldPath);

    return res
        .status(201)
        .json({ message: 'File stored successfully', filePath: req.file.path });
}