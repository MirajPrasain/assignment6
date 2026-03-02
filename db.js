console.log("DB file loaded")
const Datastore = require("nedb-promises");

const db = Datastore.create({
  filename: "./data/hits.db",
  autoload: true,
});

// Increment (NeDB-safe)
async function incrementHit(pageID) {
  let doc = await db.findOne({ pageID });

  if (!doc) {
    // If page doesn't exist, create it with 1 hit
    doc = await db.insert({ pageID, hits: 1 });
  } else {
    // If exists, increment
    await db.update(
      { pageID },
      { $inc: { hits: 1 } }
    );

    doc = await db.findOne({ pageID });
  }

  return doc;
}

// Read one page (no increment)
async function getHit(pageID) {
  const doc = await db.findOne({ pageID });
  return doc || { pageID, hits: 0 };
}

// Read all pages
async function getAllHits() {
  return await db.find({}).sort({ pageID: 1 });
}

module.exports = {
  incrementHit,
  getHit,
  getAllHits
};