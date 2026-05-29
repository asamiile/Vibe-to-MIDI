import {
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import type { SavedIdea } from './types';

const SAVE_DIR = `${documentDirectory ?? ''}vibe-saves/`;
const INDEX_PATH = `${SAVE_DIR}index.json`;

async function ensureDir(): Promise<void> {
  const info = await getInfoAsync(SAVE_DIR);
  if (!info.exists) {
    await makeDirectoryAsync(SAVE_DIR, { intermediates: true });
  }
}

export async function loadSavedIdeas(): Promise<SavedIdea[]> {
  try {
    await ensureDir();
    const info = await getInfoAsync(INDEX_PATH);
    if (!info.exists) return [];
    const content = await readAsStringAsync(INDEX_PATH);
    return JSON.parse(content) as SavedIdea[];
  } catch {
    return [];
  }
}

export async function writeSavedIdeas(ideas: SavedIdea[]): Promise<void> {
  await ensureDir();
  await writeAsStringAsync(INDEX_PATH, JSON.stringify(ideas));
}
