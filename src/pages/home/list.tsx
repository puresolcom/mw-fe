import { Authenticated, Divider, LayoutWrapper, Show, useCustom, useGetIdentity, useNavigation, useRouterContext } from "@pankod/refine"
import { List, Avatar, Skeleton, Button, Badge, Tag } from "antd";
import { API_URL } from "App";
import { UserProfileOverView } from "components/layout/UserProfileOverview";
import { IPost } from "interfaces";
import { useState } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import { TOKEN_KEY } from "authProvider";

export const FeedList = () => {
    const { push } = useNavigation();

    const params = useRouterContext().useParams<any>();
    const [limit, setLimit] = useState(1);
    const { data: userData } = useGetIdentity();
    const { data, isLoading, refetch } = useCustom<IPost[]>({
        url: `${API_URL}/posts`,
        method: "get",
        config: {
            query: {
                page: 1,
                perPage: limit,
                sort: "createdAt",
                authorId: params.userId || undefined,
            }
        }
    });

    const loadMoreData = () => {
        if (isLoading) {
            return;
        }
        setLimit((limit) => limit + 1);
    };

    const likePost = async (postId: string) => {
        // submit like using axios and add bearer token
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return;
        }

        const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        refetch();
        return response.data;
    };

    const unlikePost = async (postId: string) => {
        // submit like using axios and add bearer token
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
            return;
        }

        const response = await axios.post(`${API_URL}/posts/${postId}/unlike`, {}, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });
        refetch();
        return response.data;
    }

    return (
        <Authenticated>
            <LayoutWrapper>
                <Show
                    title="Social Feed"
                >
                    {params.userId && <UserProfileOverView userId={params.userId} />}

                    <div
                        id="scrollableDiv"
                        style={{
                            overflow: 'auto',
                            padding: '0 16px',
                            border: '1px solid rgba(140, 140, 140, 0.35)',
                        }}
                    >
                        <InfiniteScroll
                            dataLength={data?.data.length || 0}
                            next={loadMoreData}
                            hasMore={limit <= data?.data.length}
                            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                        >
                            <List
                                dataSource={data?.data as unknown as IPost[]}
                                renderItem={item => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            avatar={
                                                (item.author.avatarUrl === "") ?
                                                    <Avatar
                                                        style={{
                                                            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                                        }}
                                                        size="large"
                                                    >
                                                        {item.author.name.split(" ").map(name => name[0]).join("")}
                                                    </Avatar> :
                                                    <Avatar src={item.author.avatarUrl} size="large" />
                                            }
                                            title={
                                                <div style={
                                                    {
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "space-between",
                                                    }
                                                }>
                                                    <Button
                                                        type="link"
                                                        onClick={() => push(`/${item.author.id}/feed`)}>
                                                        By: {item.author.name} on {item.createdAt}
                                                    </Button>

                                                    <div>
                                                        <span
                                                            style={
                                                                {
                                                                    marginRight: "8px",

                                                                }
                                                            }
                                                        > Tags: </span>
                                                        {item.tags.map(tag => (
                                                            <Tag
                                                                key={tag.id}
                                                                color="blue"
                                                                style={{
                                                                    marginRight: "8px",
                                                                }}
                                                            >
                                                                {tag.name}
                                                            </Tag>
                                                        ))}
                                                    </div>

                                                    <div>
                                                        <span
                                                            style={{
                                                                marginRight: "8px",
                                                            }}
                                                        > Categories: </span>
                                                        {item.categories.map(category => (
                                                            <Tag
                                                                key={category.id}
                                                                color="green"
                                                                style={{
                                                                    marginRight: "8px",
                                                                }}
                                                            >
                                                                {category.name}
                                                            </Tag>
                                                        ))}
                                                    </div>
                                                </div>

                                            }
                                            description={
                                                <>
                                                    {item.imageUrl && <img
                                                        style={{
                                                            width: '100%',
                                                            height: 'auto',
                                                            maxWidth: '100%',
                                                            maxHeight: '100%'
                                                        }}

                                                        src={item.imageUrl} alt={item.content} />}
                                                    <div
                                                        style={{
                                                            marginTop: "16px",
                                                            marginBottom: "16px",
                                                        }}
                                                    >
                                                        {item.content}
                                                        <Divider />
                                                        <div style={{
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            gap: "8px",
                                                            alignItems: "start",
                                                            flexDirection: "row",
                                                        }}>
                                                            <span><Badge count={item.likesCount} showZero={true} /> likes</span>
                                                            {
                                                                // if liked already show unlike button
                                                                item.likes.find((like) => {
                                                                    return like.userId === userData.id;
                                                                }) ? (<Button size="small"
                                                                    onClick={() => unlikePost(item.id)}
                                                                >Unlike</Button>) : (<Button type="primary" size="small" onClick={() => likePost(item.id)}>Like</Button>)
                                                            }
                                                        </div>

                                                    </div>
                                                </>
                                            }
                                        >
                                        </List.Item.Meta>
                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll>
                    </div>
                </Show>
            </LayoutWrapper>
        </Authenticated >
    )
}