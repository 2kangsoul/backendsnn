import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
export const compileTemplate = <T>(templateName:string,data: T) => {
  const dirPath = path.join(process.cwd());
  const templateHTML = fs.readFileSync(
    `${dirPath}/src/template/${templateName}.html`,
    "utf-8",
  );
  const template = Handlebars.compile(templateHTML);
  return template(data);
};
