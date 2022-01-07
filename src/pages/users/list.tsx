import { IResourceComponentsProps, List, Table, useNavigation, useTable, useUpdate } from "@pankod/refine";
import { IUser } from "interfaces";
import React from "react";
import { Avatar } from "antd";

export const UsersList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable<Partial<IUser>>();
    const { mutate, isLoading } = useUpdate<Partial<IUser>>();
    const { push } = useNavigation();
    return (
        <List
            pageHeaderProps={{
                subTitle: "Manage all system users"
            }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column title="#" render={(...args) => args[2]} />
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column title="Name" dataIndex="name" />
                <Table.Column title="Email" dataIndex="email" render={(value) => {
                    return <a href={`mailto:${value}`}>{value}</a>;
                }} />
                <Table.Column title="Avatar" dataIndex="avatarUrl" render={(value) => {
                    return value ? <Avatar src={value} size={64} /> : 'N/A';
                }} />
                <Table.Column title="Actions" render={({ id }) => {
                    return (
                        <>
                            <a href="#" onClick={() => {
                                push(`/users/edit/${id}`);
                            }}>Edit</a>
                        </>
                    );
                }} />
            </Table>
        </List>
    )
}