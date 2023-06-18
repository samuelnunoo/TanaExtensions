/*
 * Tells the IntelliSense to allow import of the following file extensions in TypeScript.
 * Current Webpack config for these files doesn't embed their content, but provides the file path inside the Webpack bundle.
 */

declare module "*.svg" {
    const content: string;
    export default content;
}
declare module "*.png" {
    const content: string;
    export default content;
}
declare module "*.html" {
    const content: string;
    export default content;
}