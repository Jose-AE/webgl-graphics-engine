export async function loadFile(path: string): Promise<string> {
  const response = await fetch(path);
  return response.text();
}
