import path from "path";
import fs from "fs";
import __dirname from "../dirname.js";

const uploadsFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
}

const productFolder = path.join(uploadsFolder, "products");
if (!fs.existsSync(productFolder)) {
    fs.mkdirSync(productFolder);
}

const saveImage = (productId, productColour, file) => {
    const productColourFolder = path.join(productFolder, productId, productColour);
    if (!fs.existsSync(productColourFolder)) {
        fs.mkdirSync(productColourFolder, { recursive: true });
    }

    let fileBuffer = file.buffer;
    let fileName = `${Date.now()}-${file.originalname}`;

    fs.writeFileSync(`${productColourFolder}/${fileName}`, fileBuffer);
    return `uploads/products/${productId}/${productColour}/${fileName}`;
};

export default saveImage;
