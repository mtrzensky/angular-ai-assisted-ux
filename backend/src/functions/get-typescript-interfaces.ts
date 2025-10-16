import { Project } from "ts-morph";

const SOURCE_PATH = "../models/test.ts";
const SOURCE_FILE = "test.ts";

export const getTypeScriptInterfacesAsString = () => {
    const project = new Project();
    project.addSourceFileAtPath(SOURCE_PATH);

    const sourceFile = project.getSourceFileOrThrow(SOURCE_FILE);
    const interfaces = sourceFile.getInterfaces();
    const interfacesString = interfaces.map(i => i.getText()).join("\n\n");
    return interfacesString;
}