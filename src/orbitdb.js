const OrbitDB = require("orbit-db");
const IPFS = require("ipfs");
const Identities = require("orbit-db-identity-provider");

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true,
  },
};

const options = { id: "test1" };

async function main() {
  // Create IPFS instance
  const ipfs = await IPFS.create(ipfsOptions);

  //Test IPFS instance
  const results = await ipfs.add("IPFS works!!!");
  const cid = results.cid.toV1().toString();
  console.log("CID created via ipfs.add:", cid);

  // Create identity
  const identity = await Identities.createIdentity(options);

  // Create OrbitDB instance
  const orbitdb = await OrbitDB.createInstance(ipfs, { identity: identity });

  const optionsToWrite = {
    accessController: {
      type: "orbitdb", //OrbitDBAccessController
      write: [orbitdb.identity.id],
    },
  };

  // Create database instance
  const db = await orbitdb.keyvalue("Awesome", optionsToWrite);
  await db.load();

  let i = 0;

  setInterval(async () => {
    console.log(db.all);
    await db.put(`key-${i}`, { data: "example" });
    await db.load();
    i++;
  }, 10000);

  db.events.on("replicated", (address) => {
    console.log("replicated");
  });

  console.log("database address: " + db.address.toString());
}

main();
