import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Social Netword for Music API",
    description: "Social Netword for Music API",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["../index.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(async () => {
  await import("../index.ts");
});
