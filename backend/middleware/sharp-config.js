const sharp = require('sharp');
sharp.cache(false);

const fs = require('fs');

module.exports = async (req, res, next) => {
    // Verifie si un fichier est attaché a la Requette
    if (!req.file) {
        return next();
    }

    try {
        // Sharp optimize l´image 
        await sharp(req.file.path)
            .resize({
                width: 400,
                height: 500
            })
            .webp({ quality: 80 })
            .toFile(`${req.file.path.split('.')[0]}optimized.webp`);

        // Supprimer l´ancier fichier
        fs.unlink(req.file.path, (error) => {
            
            req.file.path = `${req.file.path.split('.')[0]}optimized.webp`;

            if (error) {
                console.log(error);
            }
            next();
        });
    } catch (error) {
        res.status(500).json({ error: "Unable to optimize the image" });
    }
};

