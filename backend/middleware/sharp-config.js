const sharp = require('sharp');
sharp.cache(false);

const fs = require('fs');

module.exports = async (req, res, next) => {
    // Vérifie si un fichier est attaché à la requête
    if (!req.file) {
        return next();
    }

    try {
        const filePath = req.file.path;
        const fileExtension = filePath.split('.').pop();

        // Vérifie si l'image est déjà en format webp
        if (fileExtension.toLowerCase() === 'webp') {
            // L'image est déjà au format webp, la fonction ne s'applique pas
            return next();
        }

        // Sharp optimise l'image
        await sharp(filePath)
            .resize({
                width: 400,
                height: 500
            })
            .webp({ quality: 80 })
            .toFile(`${filePath.split('.')[0]}.webp`);

        // Supprime l'ancien fichier
        fs.unlink(filePath, (error) => {
            req.file.path = `${filePath.split('.')[0]}.webp`;

            if (error) {
                console.log(error);
            }
            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Unable to optimize the image" });
    }
};

