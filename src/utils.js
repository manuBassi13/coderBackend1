import multer from "multer"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import fs from "node:fs"

const __filename = fileURLToPath(import.meta.url)

//Ruta Absoluta de /src
export const __dirname = dirname(__filename)

