/**
 * Almacén de imágenes subidas desde el panel: se guardan en una rama aparte del repositorio de GitHub
 * (por defecto «media», así Render no vuelve a desplegar) y se sirven desde raw.githubusercontent.com.
 * El disco de Render se borra en cada despliegue, por eso no se guardan allí.
 */
const API = "https://api.github.com";

export function githubMediaEnabled(): boolean {
  return Boolean(process.env.GITHUB_TOKEN);
}

function config() {
  return {
    token: process.env.GITHUB_TOKEN as string,
    repo: process.env.GITHUB_REPO || "Bryandlc654/alko-web",
    branch: process.env.GITHUB_MEDIA_BRANCH || "media",
    defaultBranch: process.env.GITHUB_DEFAULT_BRANCH || "main",
  };
}

async function gh(path: string, init?: RequestInit) {
  const { token } = config();
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}

/** Crea la rama de imágenes a partir de la principal si todavía no existe. */
async function ensureBranch() {
  const { repo, branch, defaultBranch } = config();
  const existing = await gh(`/repos/${repo}/git/ref/heads/${branch}`);
  if (existing.ok) return;
  const base = await gh(`/repos/${repo}/git/ref/heads/${defaultBranch}`);
  if (!base.ok) throw new Error(`No se encontró la rama ${defaultBranch} en GitHub (${base.status})`);
  const sha = (await base.json()).object.sha as string;
  const created = await gh(`/repos/${repo}/git/refs`, {
    method: "POST",
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha }),
  });
  if (!created.ok && created.status !== 422) throw new Error(`No se pudo crear la rama ${branch} (${created.status})`);
}

/** Sube la imagen y devuelve su URL pública. */
export async function uploadImageToGithub(fileName: string, data: Buffer): Promise<string> {
  const { repo, branch } = config();
  await ensureBranch();
  const res = await gh(`/repos/${repo}/contents/uploads/${fileName}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Imagen subida desde el panel: ${fileName}`,
      content: data.toString("base64"),
      branch,
    }),
  });
  if (!res.ok) throw new Error(`GitHub rechazó la subida (${res.status})`);
  return `https://raw.githubusercontent.com/${repo}/${branch}/uploads/${fileName}`;
}
