import { Create, Form, Input, IResourceComponentsProps, useForm } from "@pankod/refine";
import { IUser } from "interfaces";

export const UserCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps } = useForm<IUser>();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Create>
    );
};
