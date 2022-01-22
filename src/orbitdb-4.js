const OrbitDB = require("orbit-db");
const IPFS = require("ipfs");

async function main() {
  // Create the first peer
  const ipfs1 = await IPFS.create({ repo: "./ipfs1" });

  // Create the database
  const orbitdb1 = await OrbitDB.createInstance(ipfs1, {
    directory: "./orbitdb1",
  });
  const db1 = await orbitdb1.log("events");

  // Create the second peer
  const ipfs2 = await IPFS.create({ repo: "./ipfs2" });

  // Open the first database for the second peer,
  // ie. replicate the database
  const orbitdb2 = await OrbitDB.createInstance(ipfs2, {
    directory: "./orbitdb2",
  });
  const db2 = await orbitdb2.log(db1.address.toString());

  console.log("Making db2 check replica");

  // When the second database replicated new heads, query the database
  db2.events.on("replicated", () => {
    const result = db2
      .iterator({ limit: -1 })
      .collect()
      .map((e) => e.payload.value);
    console.log(result.join("\n"));
  });

  // Start adding entries to the first database
  setInterval(async () => {
    await db1.add({ time: new Date().getTime() });
  }, 1000);
}

main();
