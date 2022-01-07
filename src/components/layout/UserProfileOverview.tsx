import { Skeleton, useOne } from "@pankod/refine";
import { IUser } from "interfaces";
import { Avatar, Divider } from "antd";

export const UserProfileOverView: React.FC<any> = ({ userId }) => {
    const { data, isLoading } = useOne<IUser>({
        resource: "users",
        id: userId,
    })
    return (
        <div>
            <h1>User Profile</h1>
            {isLoading ? (
                <Skeleton avatar active />
            ) : (
                <>
                    <Avatar src={data?.data.avatarUrl} size={128} />
                    <h2>{data?.data.name}</h2>
                    <p>{data?.data.email}</p>

                    <Divider />
                </>
            )}


        </div>
    );
}