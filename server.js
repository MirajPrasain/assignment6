const express = require('express');
const Datastore = require('nedb-promises');

const app = express();
const db = Datastore.create('hits.db');

app.use(express.static('public'));

app.get('/hits/:pageID', async (req, res) => {
  const { pageID } = req.params;
  const doc = await db.findOne({ pageID });
  const hits = (doc ? doc.hits : 0) + 1;
  await db.update({ pageID }, { pageID, hits }, { upsert: true });
  res.json({ hits });
});

app.listen(3000, () => console.log('Server running on port 3000'));