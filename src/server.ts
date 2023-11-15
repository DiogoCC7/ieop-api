import "dotenv/config"
import fastify from "fastify";
import autoload from "@fastify/autoload";
import { join } from "path";

const port = process.env.SERVER_PORT || 3001;
const server = fastify();

server.register(autoload, {
    dir: join(__dirname, "routes")
})
  
server.listen({
    host: "0.0.0.0",
    port: port,
})

console.log(`Server listening on port ${port}`);
