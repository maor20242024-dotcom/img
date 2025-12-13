
import fs from 'fs-extra';
import path from 'path';

// Helper to read data
export async function getDeveloperData(dev: string, type: 'communities' | 'projects') {
  const filePath = path.join(process.cwd(), 'out', 'developers', dev, `${type}.json`);
  if (!await fs.pathExists(filePath)) return [];
  return fs.readJSON(filePath);
}

export async function getAllDevelopers() {
    const outDir = path.join(process.cwd(), 'out', 'developers');
    if (!await fs.pathExists(outDir)) return [];
    return fs.readdir(outDir);
}
