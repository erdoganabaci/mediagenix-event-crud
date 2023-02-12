import { Input, Form } from "antd";
import { memo } from "react";
import { TextForm } from "./types";

const InputBox = memo(function InputBox
  ({ label, name, required }: TextForm) {
  return (
    <Form.Item label={label} name={name} rules={[{ required, message: 'Required' }]}>
      <Input />
    </Form.Item>
  );
}
);

export { InputBox };

