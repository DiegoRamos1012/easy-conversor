import path from "path";
import YAML from "yamljs";

const swaggerPath = path.resolve(__dirname, "./docs/swagger.yaml");
const swaggerDocument = YAML.load(swaggerPath);

export default swaggerDocument;
