import { Input, Form } from "antd";
import { memo } from "react";
import { TextAreaForm } from "./types";

const { TextArea } = Input;

const TextAreaBox = memo(function TextAreaBox
  (props: TextAreaForm) {
  const { label, name } = props;
  return (
    <Form.Item label={label} name={name} >
      <TextArea />
    </Form.Item>
  );
}
);

export { TextAreaBox };

