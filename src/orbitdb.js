const OrbitDB = require("orbit-db");
const IpfsClient = require("ipfs-http-client");

async function main() {
  // Create IPFS instance
  const ipfs = IpfsClient.create({
    host: "localhost",
    port: 5001,
    protocol: "http",
  });

  const results = await ipfs.add("IPFS works!!!");
  const cid = results.cid.toV1().toString();
  console.log("CID created via ipfs.add:", cid);

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs);

  // Create database instance
  const db = await orbitdb.keyvalue("Awesome");
  await db.load();

  let i = 0;

  setInterval(async () => {
    console.log(db.all);
    await db.put(`key-${i}`, { data: "example" });
    await db.load();
    i++;
  }, 4000);

  db.events.on("replicated", (address) => {
    console.log(db.iterator({ limit: -1 }).collect());
  });

  console.log("database address: " + db.address.toString());
}

main();
