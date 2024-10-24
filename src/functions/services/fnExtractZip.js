import unzipper from 'unzipper';
import { Buffer } from 'buffer';

// Función para decodificar el archivo ZIP desde base64
const decodeBase64 = (b64ZIP) => {
  return Buffer.from(b64ZIP, 'base64');
};

// Función para convertir un archivo en base64
const convertFileToBase64 = async (buffer) => {
  return buffer.toString('base64');
};

const extraZip = async (b64ZIP) => {
  try {
    const zipBase64 = b64ZIP.fileZip64;
    if (!zipBase64) {
      throw new Error("El archivo ZIP base64 está vacío o no es válido.");
    }

    // Decodificar el ZIP desde base64
    const zipBuffer = decodeBase64(zipBase64);

    // Crear un array para almacenar los archivos
    const files = [];

    // Extraer el contenido del ZIP
    await unzipper.Open.buffer(zipBuffer).then(async (directory) => {
      for (const file of directory.files) {
        // Solo procesamos archivos, no carpetas
        if (!file.path.endsWith('/')) {
          const contentBuffer = await file.buffer();
          const b64 = await convertFileToBase64(contentBuffer);
          files.push({
            file: file.path,
            b64: b64,
          });
        }
      }
    });

    return { files };
  } catch (error) {
    console.error("Error al procesar el archivo ZIP:", error);
    throw new Error("Error al procesar el archivo ZIP");
  }
};

const extraZips = async (request) => {
  const b64ZIP = request;
  try {
    const extraZipsReturnData = await extraZip(b64ZIP);
    return extraZipsReturnData;
  } catch (error) {
    console.error("Error al extraer archivos ZIP:", error);
    throw new Error("Error al extraer archivos ZIP");
  }
};

export default extraZips;
