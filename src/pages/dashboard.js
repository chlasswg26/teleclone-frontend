import { Fragment, useEffect, useState, useContext } from "react";
import { Tab, Popover } from "@headlessui/react";
import { useSelector } from "react-redux";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { Outlet, useNavigate } from "react-router-dom";
import { SocketContext } from "../contexts/socket-context";
import { readProfile } from "../contexts/types/socket";
import { useDebounceFn } from "ahooks";
import toast from "react-hot-toast";
import ListBtnDashboard from "../svg/list-btn-dashboard";
import PopoverDashboardMenu from "../components/popover/menu/dashboard-menu";
import SearchBtnInputSearchKeyword from "../svg/search-btn-input-search-keyword";
import PlusBtnInputSearchKeyword from "../svg/plus-btn-input-search-keyword";
import NewChatBtn from "../svg/new-chat-btn";
import NewGroupBtn from "../svg/new-group-btn";
import EditProfileDialog from "../components/dialog/edit-profile";
import EditPasswordDialog from "../components/dialog/edit-password";
import AddContactDialog from "../components/dialog/add-contact";
import ListContactDialog from "../components/dialog/list-contact";
import moment from "moment";
import 'moment/locale/id'

const { REACT_APP_TITLE, REACT_APP_SOCKET, NODE_ENV } = process.env;

const Dashboard = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const logout = useSelector(state => state.auth.logout)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("chat");
    const [openDialog, setOpenDialog] = useState({
      setting: {
        menu: false,
        password: false,
      },
      contact: {
        add: false,
        list: false
      }
    })
    const { socket } = useSocket(REACT_APP_SOCKET, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
      },
      withCredentials: true,
      secure: NODE_ENV === "production",
    });
    const [context, dispatchcontext] = useContext(SocketContext);
    const { profile } = context;
    const [messages, setMessages] = useState([])
    const latestMessageList = new Set();
    const [groups, setGroups] = useState([])
    const zoneName = moment().locale("id");

    const searchItemOnActiveTab = useDebounceFn(
      (e) => {
        e.preventDefault();

        if (activeTab === "group") {
          socket.emit("group:filter", e.target.value);
        } else {
          socket.emit("chat:filter", e.target.value);
        }
      },
      {
        wait: 1000,
      }
    );

    const handlersSocketProfile = (message) => {
      if (message?.type === 'done') {
        dispatchcontext({
          type: readProfile,
          payload: message?.data
        })

        setMessages([...message.data.recipients, ...message.data.senders])
        setGroups(message.data.groups);
      }
    }

    useSocketEvent(socket, "profile:read", {
      onMessage: handlersSocketProfile,
    });

    useEffect(() => {
      toast.dismiss()

      if (logout?.isFulfilled) {
        navigate('/auth/signin', { replace: true })
      }
    }, [logout, navigate])

    return (
      <Fragment>
        <div className="grid h-screen grid-flow-col-dense grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
          <div
            className={`${
              showSidebar === "AVAILABLE"
                ? "order-first col-span-1 flex flex-col justify-between gap-4"
                : showSidebar === "UNAVAILABLE"
                ? "order-last hidden"
                : "order-first flex-col justify-between gap-4 md:flex"
            } h-full overflow-scroll`}
          >
            <div className="grid-rows-12 grid grid-flow-row-dense gap-4 px-4 lg:px-6">
              <div className="sticky inset-x-5 top-0 z-10 row-span-2 inline-flex h-20 items-baseline justify-between bg-white pt-6">
                <p className="text-center font-['Rubik'] text-3xl font-medium tracking-[-0.17px] text-[#7E98DF]">
                  {REACT_APP_TITLE}
                </p>

                <Popover.Group className="relative text-[#7E98DF]">
                  <Popover>
                    <Popover.Button className="focus-visible:outline-0">
                      <ListBtnDashboard />
                    </Popover.Button>
                    <Popover.Panel
                      unmount={true}
                      className="absolute top-7 left-[-13.7rem] z-10"
                    >
                      {({ close }) => (
                        <PopoverDashboardMenu
                          showSidebar={showSidebar}
                          setShowSidebar={setShowSidebar}
                          setOpenDialog={setOpenDialog}
                          close={close}
                          className="rounded-l-3xl rounded-br-3xl rounded-tr"
                        />
                      )}
                    </Popover.Panel>
                  </Popover>
                </Popover.Group>
              </div>

              <div className="row-span-10 flex flex-col items-center space-y-5">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setOpenDialog((state) => ({
                      ...state,
                      setting: {
                        ...state.setting,
                        menu: !state.setting.menu,
                      },
                    }))
                  }
                >
                  <img
                    src={
                      profile?.read?.profile?.avatar ||
                      `https://avatars.dicebear.com/api/pixel-art/${profile?.read?.profile?.username}-${profile?.read?.profile?.id}.svg`
                    }
                    alt="User Avatar"
                    referrerPolicy="no-referrer"
                    className="h-[82px] w-[82px] rounded-[20px] bg-cover bg-local bg-center"
                  />
                </div>
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="font-['Rubik'] text-xl font-medium tracking-[-0.17px]">
                    {profile?.read?.profile?.name}
                  </div>
                  <div className="font-['Rubik'] text-base font-normal tracking-[1.34px] text-[#848484]">
                    @{profile?.read?.profile?.username}
                  </div>
                </div>
                <div className="inline-flex w-full items-center justify-between">
                  <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col space-y-2">
                    <div className="absolute inset-y-5 left-3 bottom-2 flex cursor-pointer items-center">
                      <SearchBtnInputSearchKeyword />
                    </div>
                    <input
                      type="text"
                      id="search-chat"
                      className={`h-[60px] w-[92.5%] rounded-2xl bg-[#FAFAFA] font-['Rubik'] text-base font-medium text-[#232323] [padding-inline-start:2.8rem] [padding-inline-end:1rem] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#848484] placeholder:[-webkit-text-stroke-width:0em] focus-visible:outline-0`}
                      placeholder="Type your keyword..."
                      onChange={searchItemOnActiveTab.run}
                    />
                  </div>

                  <Popover.Group className="relative text-[#7E98DF]">
                    <Popover>
                      <Popover.Button className="focus-visible:outline-0">
                        <PlusBtnInputSearchKeyword />
                      </Popover.Button>
                      <Popover.Panel
                        unmount={true}
                        className="absolute inset-x-0 top-7 left-[-10.5rem] z-10"
                      >
                        <div className="h-[100px] w-[180px] rounded-l-3xl rounded-br-3xl rounded-tr bg-[#7E98DF] shadow drop-shadow">
                          <div className="flex h-full flex-col justify-around space-y-5 p-5">
                            <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                              <NewChatBtn />

                              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                                New Chat
                              </span>
                            </div>
                            <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                              <NewGroupBtn />

                              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                                New Group
                              </span>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Popover>
                  </Popover.Group>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <Tab.Group as={Fragment}>
                <Tab.List className="inline-flex h-[50px] w-full space-x-2 text-center font-['Rubik'] text-lg font-medium leading-5 tracking-[-0.17px]">
                  <Tab
                    className="w-full p-1 focus-visible:outline-0 ui-selected:rounded-[20px] ui-selected:bg-[#7E98DF] ui-selected:text-white ui-not-selected:bg-inherit ui-not-selected:text-[#232323]"
                    onClick={() => setActiveTab("chat")}
                  >
                    Messages
                  </Tab>
                  <Tab
                    className="w-full p-1 focus-visible:outline-0 ui-selected:rounded-[20px] ui-selected:bg-[#7E98DF] ui-selected:text-white ui-not-selected:bg-inherit ui-not-selected:text-[#232323]"
                    onClick={() => setActiveTab("group")}
                  >
                    Groups
                  </Tab>
                </Tab.List>
                <Tab.Panels className="pt-5 font-['Rubik']">
                  <Tab.Panel className="mx-2 flex w-full flex-col space-y-4 pr-1">
                    {messages
                      ?.filter((item) => {
                        const duplicate = latestMessageList.has(
                          profile?.read?.profile?.id ===
                            item?.sender?.profile?.id
                            ? item?.recipient?.profile?.name
                            : item?.sender?.profile?.name
                        );
                        latestMessageList.add(
                          profile?.read?.profile?.id ===
                            item?.sender?.profile?.id
                            ? item?.recipient?.profile?.name
                            : item?.sender?.profile?.name
                        );

                        return !duplicate;
                      })
                      ?.map((item, index) => {
                        const recipientProfile =
                          profile?.read?.profile?.id ===
                          item?.sender?.profile?.id
                            ? item?.recipient?.profile
                            : item?.sender?.profile;

                        return (
                          <div
                            key={index}
                            className="inline-flex cursor-pointer justify-between transition ease-in-out hover:drop-shadow-md active:scale-95"
                            onClick={() =>
                              navigate(
                                `/message/${
                                  profile?.read?.profile?.id ===
                                  item?.sender?.profile?.id
                                    ? item?.recipient?.profile?.username
                                    : item?.sender?.profile?.username
                                }`
                              )
                            }
                          >
                            <div className="space-between inline-flex space-x-3">
                              <div className="cursor-pointer">
                                <img
                                  src={
                                    recipientProfile?.avatar ||
                                    `https://avatars.dicebear.com/api/pixel-art/${recipientProfile?.username}-${recipientProfile?.id}.svg`
                                  }
                                  referrerPolicy="no-referrer"
                                  alt="User Avatar"
                                  className="h-[45px] w-[45px] rounded-[20px] bg-cover bg-local bg-center md:h-[50px] md:w-[50px] lg:h-[62px] lg:w-[62px]"
                                />
                              </div>

                              <div className="flex flex-col justify-evenly font-['Rubik']">
                                <span className="w-auto whitespace-pre-wrap break-all text-base font-medium tracking-[-0.17px] text-[#232323] line-clamp-1">
                                  {recipientProfile?.name}
                                </span>
                                <span className="w-auto whitespace-pre-wrap break-all text-sm font-normal tracking-[-0.17px] text-[#7E98DF] line-clamp-1">
                                  {item?.content
                                    ? item?.content
                                    : item?.attachment_type === "gif"
                                    ? "send you sticker..."
                                    : "send you image"}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-center justify-evenly font-['Rubik']">
                              <span className="text-sm font-normal tracking-[-0.17px] text-[#848484]">
                                {moment(item?.created_at)
                                  .locale(zoneName)
                                  .format("HH:mm")}
                              </span>
                              {/* <span className="rounded-full bg-[#7E98DF] px-3 py-1 text-center text-sm font-normal tracking-[-0.17px] text-white">
                                  2
                                </span> */}
                            </div>
                          </div>
                        );
                      })}
                  </Tab.Panel>
                  <Tab.Panel className="mx-2 flex w-full flex-col space-y-4 pr-1">
                    {groups?.map((item, index) => {
                      const conversation = item?.conversations?.pop();

                      return (
                        <div
                          key={index}
                          className="inline-flex cursor-pointer justify-between transition ease-in-out hover:drop-shadow-md active:scale-95"
                        >
                          <div className="space-between inline-flex space-x-3">
                            <div className="rounded-[20px]">
                              <img
                                src={
                                  item?.thumbnail ||
                                  `https://avatars.dicebear.com/api/pixel-art/${Math.random()}${Math.random()}${Math.random()}.svg`
                                }
                                alt="User Avatar"
                                className="h-[45px] w-[45px] bg-cover bg-local bg-center md:h-[50px] md:w-[50px] lg:h-[62px] lg:w-[62px]"
                              />
                            </div>

                            <div className="flex flex-col justify-evenly font-['Rubik']">
                              <span className="w-auto whitespace-pre-wrap break-all text-base font-medium tracking-[-0.17px] text-[#232323] line-clamp-1">
                                {item?.name}
                              </span>
                              <span className="w-auto whitespace-pre-wrap break-all text-sm font-normal tracking-[-0.17px] text-[#7E98DF] line-clamp-1">
                                {conversation?.content}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-evenly font-['Rubik']">
                            <span className="text-sm font-normal tracking-[-0.17px] text-[#848484]">
                              {/* {format(conversation?.created_at, "h:m")} */}
                            </span>
                            <span className="rounded-full bg-[#7E98DF] px-3 py-1 text-center text-sm font-normal tracking-[-0.17px] text-white">
                              2
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>

          <Outlet
            context={{
              showSidebar,
              setShowSidebar,
              setOpenDialog,
              profile,
            }}
          />
        </div>
        <EditProfileDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenPasswordDialog={() => {
            setOpenDialog((state) => ({
              ...state,
              setting: {
                menu: false,
                password: true,
              },
            }));
          }}
          profile={profile}
        />
        <EditPasswordDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          onOpenProfileDialog={() => {
            setOpenDialog((state) => ({
              ...state,
              setting: {
                password: false,
                menu: true,
              },
            }));
          }}
        />
        <ListContactDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          profile={profile}
        />
        <AddContactDialog
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      </Fragment>
    );
};

export default Dashboard;
