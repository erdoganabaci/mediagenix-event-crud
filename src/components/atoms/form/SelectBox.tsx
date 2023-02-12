import { Select, Form } from "antd";
import { memo } from "react";
import { SelectForm } from "./types";

const SelectBox = memo(function SelectBox
  ({ label, name, options }: SelectForm) {
  return (
    <Form.Item label={label} name={name} >
      <Select options={options} />
    </Form.Item>
  );
}
);

export { SelectBox };

