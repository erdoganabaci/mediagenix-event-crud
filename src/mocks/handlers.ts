import { rest } from "msw";
import { faker } from "@faker-js/faker";
import { RangePickerForm, SelectForm, TextAreaForm, TextForm } from "../components/atoms/form/types";
import dayjs from "dayjs";

const formSchema: (TextForm | SelectForm | RangePickerForm | TextAreaForm)[] = [
  {
    name: "title",
    label: "Title",
    component: "text",
    required: true,
  },
  {
    name: "type",
    component: "select",
    label: "Type",
    options: [
      {
        label: "Generic",
        value: "generic",
      },
      {
        label: "Holiday",
        value: "holiday",
      },
    ],
  },
  {
    name: ["startDate", "endDate"],
    // name: "startDateEndDate", // auto generate name from array in Range Picker component
    component: "range_picker",
    label: "Date",
  },
  {
    name: "description",
    label: "Description",
    component: "textarea",
  },
];

let events = Array(12).fill(0).map((_, i) => {
  const endDate = faker.date.between(new Date(), faker.date.future());
  const daysDiff = dayjs(endDate).diff(new Date(), 'day');
  const randomDaysToAdd = Math.floor(Math.random() * daysDiff);
  const startDate = dayjs(endDate).subtract(randomDaysToAdd, 'day').toDate();
  
  return {
    id: i.toString(),
    title: faker.lorem.words(),
    type: faker.helpers.arrayElement(["generic", "holiday"]),
    startDate: startDate,
    endDate: endDate,
    description: faker.lorem.words(),
  }
});
export const handlers = [

  rest.get("/eventFormSchema", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(formSchema)),
      ctx.delay(2000)
    );
  }),

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
  // update event and display it first
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
    const newEvent = { ...events[eventIndex], ...updatedEvent };
    events.splice(eventIndex,1); // remove the old event

    // events[eventIndex] = { ...events[eventIndex], ...updatedEvent };

    events = [newEvent, ...events];

    return res(
      ctx.status(200),
      ctx.body(JSON.stringify(events)),
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

