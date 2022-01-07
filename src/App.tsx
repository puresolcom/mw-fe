import { Icons, Refine } from "@pankod/refine";
import routerProvider from "@pankod/refine-react-router";
import axios from "axios";

import "styles/antd.less";
import { authProvider, TOKEN_KEY } from "authProvider";
import {
  Title,
  Header,
  Sider,
  Footer,
  Layout,
  OffLayoutArea,
} from "components/layout";
import { UsersList } from "pages/users/list";
import { UserCreate } from "pages/users/create";
import RestProvider from "./RestDataProvider";
import { FeedList } from "pages/home/list";
import { UserEdit } from "pages/users/edit";
import { PostsList } from "pages/posts/list";
import { PostCreate } from "pages/posts/create";

export const API_URL = "http://localhost:3000";


function App() {

  const DataProvider = () => {
    const axiosInstance = axios.create();

    // Intercept axios response and in case of 401, logout user
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.reload();
        }
      });

    axiosInstance.interceptors.request.use(
      config => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

    return RestProvider(API_URL, axiosInstance);
  }

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={DataProvider()}
      resources={[
        {
          name: "users",
          list: UsersList,
          create: UserCreate,
          edit: UserEdit,
          icon: <Icons.UserOutlined />,
        },
        {
          name: "posts",
          list: PostsList,
          create: PostCreate,
          icon: <Icons.PaperClipOutlined />,
        },
        {
          name: "categories",
        },
        {
          name: "tags",
        }
      ]}
      routerProvider={{
        ...routerProvider,
        routes: [
          {
            exact: true,
            path: "/",
            component: FeedList,
          },
          // route for showing posts by user
          {
            exact: true,
            path: "/:userId/feed",
            component: FeedList,
          },
        ]
      }}
      Title={Title}
      Header={Header}
      Sider={Sider}
      Footer={Footer}
      Layout={Layout}
      OffLayoutArea={OffLayoutArea}
      configProviderProps={
        { componentSize: "large" }
      }
    ></Refine>
  );
}

export default App;
