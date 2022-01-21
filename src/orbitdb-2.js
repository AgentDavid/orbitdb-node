const OrbitDB = require("orbit-db");
const IpfsClient = require("ipfs-http-client");

async function main() {
  // Create IPFS instance
  const ipfs = IpfsClient.create({
    host: "localhost",
    port: 5001,
    protocol: "http",
  });

  const results = await ipfs.add("Important data");
  const cid = results.cid.toV1().toString();
  console.log("CID created via ipfs.add:", cid);

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs, {
    directory: "./orbitdb-second",
  });

  // Create database instance
  const db = await orbitdb.open(
    "/orbitdb/zdpuAwhppLaAL5J3xJk6B8aLVpusR1gahtLmdj7ToCZzU4F64/Awesome"
  );

  await db.load();

  setInterval(function () {
    console.log(db.all);
  }, 5000);
  // await db.put("another-key", { extra_item: "value" });

  console.log("database address: " + db.address.toString());
}

main();
