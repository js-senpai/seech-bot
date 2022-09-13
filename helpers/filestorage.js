import {join, resolve} from "path";
import axios from "axios";
import { Storage } from "@google-cloud/storage";
export default class FileStorage {
    bucketName = 'seech-bot'
    storage = null
    constructor() {
        const getCredentials = join(resolve(),'filestorage-config.json')
        const storage = new Storage({keyFilename: getCredentials})
        this.storage = storage.bucket(this.bucketName)
    }


    async uploadFile(file) {
        try {
            const { file_id,file_unique_id } = file[file.length - 1]
            // Find file
            const {
                data: {
                    ok = false,
                    description = '',
                    error_code = 0,
                    result: { file_path },
                },
            } = await axios.get(
                `${process.env.TELEGRAM_BOT_URL}/getFile?file_id=${file_id}`,
            );
            if (!ok) {
                throw new Error(
                    `File path dont get in telegram. Request end with status code ${error_code}.${description}`,
                );
            }
            const fileName = `${file_unique_id}.${file_path.replace(/.*\.(.*$)/g, '$1')}`
            const { data } = await axios.get(
                `${process.env.TELEGRAM_BOT_FILE_URL}/${file_path}`,
                {
                    responseType: 'stream',
                },
            )
            const newFile = this.storage.file(fileName)
            const stream = newFile.createWriteStream({
                resumable: true,
            });
            await data.pipe(stream)
            await this.storage.makePublic()
            return {
                url: `https://storage.googleapis.com/${this.bucketName}/${fileName}`
            }
        } catch (e) {
            console.error(e)
        }
    }

}