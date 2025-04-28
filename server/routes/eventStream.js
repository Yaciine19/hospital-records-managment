import express from "express";

const router = express.Router();

const deathQueue = [];
const birthQueue = [];
let messageCounter = 0;

export function emitBirth(record) {
  birthQueue.push(record);
}

export function emitDeath(record) {
  deathQueue.push(record);
}

const prepareHeaders = (res, interval) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });

  res.flushHeaders();

  res.on("close", function() {
    clearInterval(interval);
    console.log("Client stopped listening");
  });
};

const sendRecord = (res, record) => {
  messageCounter += 1;

  let data = JSON.stringify(record);
  console.log(data);

  res.write("id: " + messageCounter + "\n");
  res.write("data: " + JSON.stringify(record) + "\n\n");
};

router.get("/eventsDeath", async function(req, res) {
  prepareHeaders(res);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (deathQueue.length > 0) {
      sendRecord(res, birthQueue.pop());
    }
  }
});

router.get("/eventsBirth", async function(req, res) {
  prepareHeaders(res);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (birthQueue.length > 0) {
      sendRecord(res, birthQueue.pop());
    }
  }
});

export default router;
