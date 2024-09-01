const redis = require("redis");
console.log("Connecting to redis");

const client = redis.createClient({
  password: "MDsnzLlcj6SACTo5vXlPd7D6vgz0pbLP",
  socket: {
    host: "redis-13052.c281.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 13052,
  },
});

//connnect to redis
client.on("connect", async () => {
  console.log("connected to redis");
});
client.on("error", async (err) => {
  console.log("Redis connection error", err);
});

client.connect();
module.exports = client;
