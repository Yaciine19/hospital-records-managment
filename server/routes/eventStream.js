import express from "express";

const router = express.Router();

const deathQueue = [];
const birthQueue = [];
let messageCounter = 0;

const deathClients = new Set();
const birthClients = new Set();

export function emitBirth(record) {
  birthQueue.push(record);
  broadcastToClients(birthClients, record);
}

export function emitDeath(record) {
  deathQueue.push(record);
  broadcastToClients(deathClients, record);
}

function broadcastToClients(clients, record) {
  if (clients.size > 0) {
    messageCounter += 1;
    const data = JSON.stringify(record);
    const message = `id: ${messageCounter}\ndata: ${data}\n\n`;
    
    clients.forEach(client => {
      client.write(message);
    });
    
    console.log(`Broadcast to ${clients.size} clients:`, data);
  }
}

const prepareHeaders = (res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
  });
  res.flushHeaders();
};

router.get("api/eventsDeath", function(req, res) {
  prepareHeaders(res);
  
  deathClients.add(res);
  
  if (deathQueue.length > 0) {
    const record = deathQueue.shift();
    messageCounter += 1;
    res.write(`id: ${messageCounter}\ndata: ${JSON.stringify(record)}\n\n`);
  }
  
  res.on("close", function() {
    deathClients.delete(res);
    console.log("Death event client disconnected, remaining clients:", deathClients.size);
  });
});

router.get("api/eventsBirth", function(req, res) {
  prepareHeaders(res);

  birthClients.add(res);
  if (birthQueue.length > 0) {
    const record = birthQueue.shift();
    messageCounter += 1;
    res.write(`id: ${messageCounter}\ndata: ${JSON.stringify(record)}\n\n`);
  }
  
  res.on("close", function() {
    birthClients.delete(res);
    console.log("Birth event client disconnected, remaining clients:", birthClients.size);
  });
});

export default router;
