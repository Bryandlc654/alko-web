import path from "path";

/** Carpeta privada de los CV: fuera de `public/`, solo se sirven desde el panel con permiso de Empleo. */
export const CV_DIR = path.join(process.cwd(), "data", "private", "cvs");
export const CV_URL_PREFIX = "/api/admin/empleo/cv/";
