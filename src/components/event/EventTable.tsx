import { memo, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { BaseEventPlan, EventPlan } from './types'

import { Alert, Button, Form, Modal, Table, Tag, message } from 'antd';
import { GeneratedEventForm } from './GeneratedEventForm';
import { FormSchema, FormSubmit } from './Event';

const { Column } = Table;

const updateEvent = async ({ eventId, event }: { eventId: string, event: BaseEventPlan }) => {
  const response = await fetch(`/event/${eventId}`, {
    method: "PUT",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const eventResponse: EventPlan = await response.json();

  return {
    ...eventResponse,
    startDate: new Date(eventResponse.startDate),
    endDate: new Date(eventResponse.endDate),
  };
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

interface EventTableProps {
  data?: BaseEventPlan[];
  isFetching?: boolean;
  error?: unknown;
}
const EventTable = memo(
  function EventTable(props: EventTableProps) {
    const { data, isFetching, error } = props;

    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFailForm, setIsFailForm] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<EventPlan | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();



    const mutation = useMutation(updateEvent, {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
      },
    });

    const showModal = (event: EventPlan) => {
      setIsModalOpen(true);
      setCurrentEvent(event);
    };

    const handleOk = () => {
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      setIsModalOpen(false);
      setIsFailForm(false)
      form.resetFields()
    };

    const success = (messsageTitle: string) => {
      messageApi.open({
        type: 'success',
        content: messsageTitle,
      });
    };

    useEffect(() => {
      if (currentEvent) {
        form.setFieldsValue({
          title: currentEvent.title,
          type: currentEvent.type,
          description: currentEvent.description,

        });
      }
    }, [currentEvent, form]);

    const handleSubmit = async (values: FormSubmit) => {
      setIsSubmitting(true);
      const type = values?.type ? values.type : "generic"
      const startDate = values?.startDate?.endDate ? new Intl.DateTimeFormat().format(values.startDate.endDate[0]).toString() : new Date().toString()
      const endDate = values?.startDate?.endDate ? new Intl.DateTimeFormat().format(values.startDate.endDate[1]).toString() : new Date().toString()
      const description = values?.description ? values.description : ""

      const eventRequest = {
        ...values,
        type,
        startDate,
        endDate,
        description
      };
      // Perform the API request to create the event
      try {
        mutation.mutateAsync({ eventId: currentEvent!.id, event: eventRequest });
        setIsSubmitting(false);
        setIsFailForm(false)
        form.resetFields()
        setIsModalOpen(false);
        success(`${values.title} Event successfully edited`)
      } catch (error) {
        setIsSubmitting(false);
      }

    }

    const onFinishFailed = () => {
      setIsFailForm(true)
    };


    if (error) {
      return <div>{`Error: ${error}`}</div>
    }
    return (
      <>
        {contextHolder}

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
            title="Action"
            key="action"
            render={(text, event: EventPlan) => (
              <a href="/" onClick={(e) => {
                e.preventDefault()
                showModal(event)
              }}>Edit</a>
            )}
          />
        </Table>

        <Modal
          title={"Edit Event"}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={isSubmitting} onClick={form.submit} disabled={isSubmitting}>
              Save
            </Button>,
          ]}
        >

          <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed} layout={"vertical"}>
            <GeneratedEventForm schemas={FormSchema} />
            {isFailForm && <Alert message="There are errors in the form. Please correct before saving." type="error" showIcon />}
          </Form>
        </Modal>
      </>
    )
  })

export { EventTable }