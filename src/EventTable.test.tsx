// import React from 'react';
// import { render, fireEvent } from '@testing-library/react';
// import { EventTable } from '../src/components/event/EventTable';
// import { EventPlan } from './components/event/types';

// const events: EventPlan[] = [
//   { id: "1", title: 'Event 1', type: 'generic', description: "lorem ipsum", startDate: new Date().toString(), endDate: new Date().toString() },
//   { id: "2", title: 'Event 2', type: 'holiday', description: "lorem ipsum", startDate: new Date().toString(), endDate: new Date().toString() },
// ];


// describe('EventTable component', () => {
//   it('renders the correct data on load', () => {
//     const { getByText } = render(<EventTable data={events} isFetching={false} />);

//     events.forEach((event) => {
//       expect(getByText(event.title)).toBeInTheDocument();
//       expect(getByText(event.type)).toBeInTheDocument();
//     });
//   });

//   it('filters the table data correctly', () => {
//     const { getByText, queryByText } = render(<EventTable data={events} isFetching={false} />);

//     fireEvent.change(getByText('Filter by Title'), { target: { value: 'Event 1' } });
//   });

//   it('shows Event 1 after filtering by title', () => {
//     const { getByText } = render(<EventTable data={events} isFetching={false} />);
//     expect(getByText('Event 1')).toBeInTheDocument();
//     expect(getByText('generic')).toBeInTheDocument();
//   });

//   it('does not show Event 2 after filtering by title', () => {
//     const { queryByText } = render(<EventTable data={events} isFetching={false} />);
//     expect(queryByText('Event 2')).not.toBeInTheDocument();
//     expect(queryByText('holiday')).not.toBeInTheDocument();
//   });
// });