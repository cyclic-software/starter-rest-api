const db = require("@cyclic.sh/dynamodb");

const setCollection = async (req, res) => {
  const { params, body } = req;
  const { col, key } = params;

  if (!col || !key) {
    return res.status(400).send({
      message: "Required parameters col and/or key missing!",
    });
  }

  const item = await db.collection(col).set(key, body);
  res.json(item).end();
};

const deleteCollection = async (req, res) => {
  const { col, key } = req?.params || null;

  if (!col || !key) {
    return res.status(400).send({
      message: "Required parameters col and/or key missing!",
    });
  }

  const item = await db.collection(col).delete(key);
  res.json(item).end();
};

const getCollection = async (req, res) => {
  const { col, key } = req?.params || null;

  if (!col || !key) {
    return res.status(400).send({
      message: "Required parameters col and/or key missing!",
    });
  }

  const item = await db.collection(col).get(key);
  res.json(item).end();
};

const getCollections = async (req, res) => {
  const { col } = req?.params || null;

  if (!col) {
    return res.status(400).send({
      message: "Required parameter col missing!",
    });
  }

  const items = await db.collection(col).list();
  res.json(items).end();
};

module.exports = {
  setCollection,
  deleteCollection,
  getCollection,
  getCollections,
};
