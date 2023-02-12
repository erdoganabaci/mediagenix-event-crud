import { memo, useState } from 'react'
import { useQuery } from 'react-query';
import { BaseEventPlan, EventPlan } from './types'

import { Modal, Table, Tag } from 'antd';

const { Column } = Table;

const getEvents = async (): Promise<BaseEventPlan[]> => {
  const response = await fetch("/events");
  const eventResponses: EventPlan[] = await response.json();
  console.log("eventResponses", eventResponses)
  return eventResponses.map((eventResponse) => {
    return {
      ...eventResponse,
      startDate: new Date(eventResponse.startDate).toString(),
      endDate: new Date(eventResponse.endDate).toString(),
    };
  });
};

const displayEventType = (eventName: "generic" | "holiday") => {
  switch (eventName) {
    case "generic":
      return <Tag color="purple">Generic</Tag>;
    case "holiday":
      return <Tag color="red">Holiday</Tag>;
  }
};

function displayDate(date: string) {
  const eventDate = new Date(date);
  return <span>{new Intl.DateTimeFormat().format(eventDate)}</span>;
}


const EventTable = memo(
  function EventTable() {
    const { isFetching, error, data } = useQuery("events", getEvents);
    // const [visible, setVisible] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<BaseEventPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = (event: BaseEventPlan) => {
      console.log("current event", event)
      setIsModalOpen(true);
      setCurrentEvent(event);
    };

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
    };

    if (error) {
      return <div>{`Error: ${error}`}</div>
    }
    return (
      <>
        <Table dataSource={data} loading={isFetching} rowKey="id">
          <Column title="Title" dataIndex="title"></Column>
          <Column title="Type" dataIndex="type" render={displayEventType}></Column>
          <Column
            title="Start Date"
            dataIndex="startDate"
            render={displayDate}
          ></Column>
          <Column title="End Date" dataIndex="endDate" render={displayDate}></Column>
          <Column title="Description" dataIndex="description" />
          <Column
            title="Edit"
            key="edit"
            render={(text, event: BaseEventPlan) => (
              <a href="/" onClick={(e) => {
                e.preventDefault()
                showModal(event)
              }}>Edit</a>
            )}
          />
        </Table>
        <Modal
          title={currentEvent?.title}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>{currentEvent?.description}</p>
        </Modal>
      </>
    )
  })

export { EventTable }