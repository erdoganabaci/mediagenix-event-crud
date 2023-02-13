import { rest } from "msw";
import { faker } from "@faker-js/faker";

let events = Array(12).fill(0).map((_, i) => ({
  id: i.toString(),
  title: faker.lorem.words(),
  type: faker.helpers.arrayElement(["generic", "holiday"]),
  startDate: faker.date.between(new Date(), faker.date.future()),
  endDate: faker.date.between(new Date(), faker.date.future()),
  description: faker.lorem.words(),
}));

export const handlers = [
  rest.get("/events", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(events)),
      ctx.delay(1000)
    );
  }),

  rest.post("/event", async (req, res, ctx) => {    
    const event = { id: events.length.toString(), ...(await req.json()) };
    // last event will be displayed first
    events = [event, ...events];

    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(event)), // send back the created event
      ctx.delay(1000)
    );
  }),
  // update event
  rest.put("/event/:id", async (req, res, ctx) => {
    const eventId = req.params.id;
    const updatedEvent = await req.json();

    const eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex === -1) {
      return res(
        ctx.status(400),
        ctx.json({ error: `Event with id ${eventId} not found.` })
      );
    }

    events[eventIndex] = { ...events[eventIndex], ...updatedEvent };

    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(events[eventIndex])),
      ctx.delay(1000)
    );
  }),
  // search events
  rest.get("/events/search", (req, res, ctx) => {
    const queryParams = new URLSearchParams(req.url.search);
    const q = queryParams.get("q")!;

    const filteredEvents = events.filter(
      event =>
        event.title.includes(q) ||
        event.description.includes(q)
    );
  
    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(filteredEvents)),
      ctx.delay(1000)
    );
  }),
];

