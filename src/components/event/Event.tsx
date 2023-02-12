import { Button, Divider, Input, Modal, Form, message, Alert } from 'antd';
import { memo, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { RangePickerForm, SelectForm, TextAreaForm, TextForm } from '../atoms/form/types';
import { EventTable } from './EventTable';
import { GeneratedEventForm } from "./GeneratedEventForm"
import { BaseEventPlan, EventPlan } from './types';

interface FormSubmit {
  title: string;
  type?: "generic" | "holiday";
  startDate?: {
    endDate: [Date, Date]
  };
  description?: string;
}

// it will come from backend in future
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
    component: "range_picker",
    label: "Date",
  },
  {
    name: "description",
    label: "Description",
    component: "textarea",
  },
];

const createEvent = async (event: BaseEventPlan) => {
  const response = await fetch("/event", {
    method: "POST",
    body: JSON.stringify(event),
    headers: {
      "Content-Type": "application/json",
    }
  }
  );
  const eventResponse: EventPlan = await response.json();

  return {
    ...eventResponse,
    startDate: new Date(eventResponse.startDate),
    endDate: new Date(eventResponse.endDate),
  };

};

const Event = memo(
  function Event() {
    const queryClient = useQueryClient();
    const [isFailForm, setIsFailForm] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const mutation = useMutation(createEvent, {
      onSuccess: () => {
        queryClient.invalidateQueries("events");
      },
    });

    const showModal = () => {
      setIsModalOpen(true);
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
        await mutation.mutateAsync(eventRequest);
        setIsSubmitting(false);
        setIsFailForm(false)
        form.resetFields()
        setIsModalOpen(false);
        success(`${values.title} Event successfully created`)
      } catch (error) {
        setIsSubmitting(false);
      }

    }

    const onFinishFailed = () => {
      setIsFailForm(true)
    };

    return (
      <>
        {contextHolder}

        <div className="header">
          <Input placeholder="Search Events" className="search" />
          <Button type="primary" className="button" onClick={showModal}>Create Event</Button>
        </div>
        <div className="table-container">
          <EventTable />

          <Modal title="Create new event" open={isModalOpen} onOk={form.submit} okText={"Save"} onCancel={handleCancel}

            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" loading={isSubmitting} onClick={form.submit} disabled={isSubmitting}>
                Save
              </Button>,
            ]}
          >
            <Form form={form} onFinish={handleSubmit} onFinishFailed={onFinishFailed} layout={"vertical"}
            >
              <Divider />
              <GeneratedEventForm schemas={formSchema} />
            </Form>
            {isFailForm && <Alert message="There are errors in the form. Please correct before saving." type="error" showIcon />}
          </Modal>
        </div>

      </>
    )
  })

export { Event }