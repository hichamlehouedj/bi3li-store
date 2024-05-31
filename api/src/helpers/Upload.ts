import path from "path";
//@ts-ignore
import { v4 as UUID } from 'uuid';
import {fileURLToPath} from "url";


const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const UploadFile = async (file: any) => {
    const { name, mimetype, mv, data, size} = file;

    const imgType = name.split(".")[name.split(".").length-1].toUpperCase()
    const imgName: string = `${UUID()}.${imgType}`;

    const uploadPath = path.join(__dirname,   `./../../uploads/${imgName}`)

    await mv(uploadPath)

    return imgName
}


export const UploadMultiFile = async (files: any[]) => {
    let listFiles = []

    for (let i = 0; i < files.length; i++) {
        const fileName = await UploadFile(files[i])

        listFiles.push(fileName)
    }

    return listFiles
}