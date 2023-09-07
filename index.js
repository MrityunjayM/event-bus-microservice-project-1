import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// initialize middleware('s)
app.use(express.json());
app.use(cors());

// keep track of system services
const services = ["http://posts-srv:4011", "http://comments-srv:4012", "http://query-srv:4013", "http://moderation-srv:4014"];

// event emmitters function, emits events to all the services
const emitIncommingEvents = (event) => {
  axios.post(`${services[0]}/events`, event).catch(console.error);
  axios.post(`${services[1]}/events`, event).catch(console.error);
  axios.post(`${services[2]}/events`, event).catch(console.error);
  axios.post(`${services[3]}/events`, event).catch(console.error);
};

// define POST route /events - entry point for event to the event_bus
app.post("/events", async (req, res) => {
  const event = req.body;

  emitIncommingEvents(event);
  console.info("EventEmmited: %s", event.type);

  return res.sendStatus(204);
});

const PORT = process.env.PORT || 4010;

app.listen(PORT, () => {
  console.info("[EVENT BUS]: running on port %d", PORT);
});
