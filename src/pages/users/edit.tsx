import { Edit, Form, Input, IResourceComponentsProps, Upload, useForm } from "@pankod/refine";
import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Space } from 'antd';
import { API_URL } from "App";
import { IUser } from "interfaces";

export const UserEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, form, queryResult } = useForm<IUser>();
    const { data, isLoading } = queryResult;


    return (
        <Edit saveButtonProps={saveButtonProps}
        >
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
                    label="Profile Avatar"
                    name="avatarUrl"
                >

                    {!isLoading && <Avatar src={data.data.avatarUrl} size={128} style={{
                        marginBottom: "20px"
                    }} />}
                    <Upload
                        name="file"
                        listType="picture-card"
                        showUploadList={true}
                        action={`${API_URL}/uploader/file`}
                        // allow images only
                        beforeUpload={(file) => {
                            const isImage = file.type.includes("image");
                            if (!isImage) {
                                alert("Please upload an image file");
                            }
                            return isImage;
                        }
                        }
                        onChange={({ file }) => {
                            if (file.status === 'done') {
                                form.setFieldsValue({
                                    avatarUrl: file.response.url
                                });
                            }

                            // handle error
                            if (file.status === 'error') {
                                alert("Something went wrong while uploading image");
                            }
                        }}
                    >
                        {
                            <>
                                <UploadOutlined />
                                <span>Upload</span>
                            </>
                        }
                    </Upload>

                </Form.Item>
            </Form>
        </Edit>
    );
};
