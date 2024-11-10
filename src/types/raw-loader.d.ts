//define you can export raw files with ?raw

declare module "*?raw" {
  const rawFileContent: string;
  export default rawFileContent;
}
