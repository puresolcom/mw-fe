import { IResourceComponentsProps, List, Table, useTable } from "@pankod/refine";
import { IPost } from "interfaces";
import React from "react";
import { Tag } from "antd";

export const PostsList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<Partial<IPost>>();
    return (
        <List
            pageHeaderProps={{
                subTitle: "Manage posts"
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column title="#" render={(...args) => args[2]} />
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="Image" dataIndex="imageUrl" render={(imageUrl) => (
                    // handle in case no image
                    imageUrl ? <img src={imageUrl} alt="post" style={{ width: "100px" }} /> : 'No image'
                )} />
                <Table.Column title="Content" dataIndex="content" />
                <Table.Column title="Categories" dataIndex="categories" render={(categories) => (
                    <>
                        {categories.map((category) => (
                            <Tag color="green" key={category.id}>{category.name}</Tag>
                        ))}
                    </>
                )} />
                <Table.Column title="Tags" dataIndex="tags" render={(tags) => (
                    <>
                        {tags.map((tag) => (
                            <Tag color="blue" key={tag.id}>{tag.name}</Tag>
                        ))}
                    </>
                )} />
            </Table>
        </List>
    )
}