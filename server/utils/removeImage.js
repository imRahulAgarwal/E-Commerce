import fs from "fs";

const removeImage = (filePath) => {
    fs.unlinkSync(filePath);
};

export default removeImage;
