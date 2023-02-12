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
];

