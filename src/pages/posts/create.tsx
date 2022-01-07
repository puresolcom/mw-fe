import { Create, Form, Input, IResourceComponentsProps, useForm, useSelect, Select, useCheckboxGroup } from "@pankod/refine";
import { ICategory, IPost, ITag } from "interfaces";
import { Upload, Space, } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { API_URL } from "App";

export const PostCreate: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, form } = useForm<IPost>();
    const { selectProps } = useSelect<ICategory>({
        resource: "categories",
        optionLabel: "name",
        optionValue: "id"
    });
    const { selectProps: selectPropsTags } = useSelect<ITag>({
        resource: "tags",
        optionLabel: "name",
        optionValue: "id"
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item label="Image URL" name="imageUrl">
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
                                    imageUrl: file.response.url
                                });
                            }

                            // handle error
                            if (file.status === 'error') {
                                alert("Something went wrong while uploading image");
                            }
                        }
                        }
                    >
                        <Space>
                            <UploadOutlined />
                            <span>Upload</span>
                        </Space>
                    </Upload>
                </Form.Item>

                <Form.Item label="Content" name="content">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Categories" name="categories">
                    <Select
                        {...selectProps}
                        mode="multiple"
                    />
                </Form.Item>

                <Form.Item label="Tags" name="tags">
                    <Select
                        mode="tags"
                        {...selectPropsTags}
                    />
                </Form.Item>
            </Form>
        </Create>
    );
};
