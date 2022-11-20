import { Popover } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import CallBtnTopbar from "../svg/call-btn-topbar";
import DeleteChatBtnTopbar from "../svg/delete-chat-btn-topbar";
import ListBtnDashboard from "../svg/list-btn-dashboard";
import ListTopbarBtn from "../svg/list-topbar-btn";
import MuteBtnTopbar from "../svg/mute-btn-topbar";
import SearchBtnTopbar from "../svg/search-btn-topbar";
import PopoverDashboardMenu from "./popover/menu/dashboard-menu";
import ChatWidget from "./widgets/chat";
import { useKeyPress, useUpdateEffect } from "ahooks";
import ModalImage from "react-modal-image";
import moment from "moment/moment";
import toast from "react-hot-toast";
import 'moment/locale/id'

const { REACT_APP_SOCKET, NODE_ENV } = process.env;

const AlwaysScrollToBottom = () => {
  const elementRef = useRef();

  useEffect(() => elementRef.current.scrollIntoView());

  return (
    <Fragment>
      <div ref={elementRef} />
    </Fragment>
  );
};

const ChatPanel = () => {
  const { showSidebar, setShowSidebar, setOpenDialog, profile } =
    useOutletContext();
  const chatListRef = useRef();
  const { contactUsername } = useParams();
  const { socket } = useSocket(REACT_APP_SOCKET, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
    },
    withCredentials: true,
    secure: NODE_ENV === 'production'
  });
  const socketReadContact = useSocketEvent(socket, "contact:read");
  const socketReadChat = useSocketEvent(socket, "chat:read");
  const socketSendChat = useSocketEvent(socket, "chat:send");
  const socketDeleteContact = useSocketEvent(socket, "contact:delete");
  const [messages, setMessages] = useState([])
  const [contact, setContact] = useState({})
  const contentEditableRef = useRef();
  const zoneName = moment().locale("id");
  const navigate = useNavigate()

  const onGiftGif = async (data) => {
    const dataGif = {
      id:
        socketReadContact.lastMessage?.data?.personId === profile?.read?.id
          ? socketReadContact.lastMessage?.data?.user?.id
          : socketReadContact.lastMessage?.data?.person?.id,
      attachment: data,
      attachment_type: "gif",
    };

    await socketSendChat.sendMessage(dataGif);
  }
  
  const onDeleteContact = async (data) => {
    toast.remove()
    toast.loading("Loading...");

    await socketDeleteContact.sendMessage(data);
  };

  useEffect(() => {
    if (socketReadContact.lastMessage?.type === 'err') {
      navigate("/", { replace: true });
    }
  }, [socketReadContact.lastMessage, contact, navigate])

  useEffect(() => {
    socket.emit("contact:read", contactUsername);
  }, [contactUsername, socket, socketSendChat.lastMessage]);

  useEffect(() => {
    if (socketReadContact.lastMessage?.type === 'done') {

      socket.emit("chat:read", contact?.profile?.username);
  
      socket.emit(
        "join:room",
        socketReadContact.lastMessage?.data?.person?.profile?.username
      );
    }
  }, [socketReadContact.lastMessage, socket, contact]);

  useEffect(() => {
    if (socketReadContact.lastMessage?.type === "done") {
      setContact(
        socketReadContact.lastMessage?.data?.personId === profile?.read?.id
          ? socketReadContact.lastMessage?.data?.user
          : socketReadContact.lastMessage?.data?.person
      );
    }
  }, [socketReadContact.lastMessage, profile]);

  useEffect(() => {
    if (socketReadChat.lastMessage?.type === 'done') setMessages(socketReadChat.lastMessage?.data);
  }, [socketReadChat.lastMessage]);

  useUpdateEffect(() => {
    if (socketDeleteContact.lastMessage?.type === "info") {
      navigate('/', { replace: true })
    }
  }, [socketDeleteContact.lastMessage]);

  useKeyPress(
    "enter",
    async (event) => {
      event.preventDefault();

      if (!contentEditableRef.current.innerText) {
        toast.error('Please input message!')
      } else {
        const dataMessage = {
          id:
            socketReadContact.lastMessage?.data?.personId === profile?.read?.id
              ? socketReadContact.lastMessage?.data?.user?.id
              : socketReadContact.lastMessage?.data?.person?.id,
          content: contentEditableRef.current.innerText,
        };

        contentEditableRef.current.innerHTML = ''

        await socketSendChat.sendMessage(dataMessage);
      }
    },
    {
      target: contentEditableRef,
    }
  );

  useUpdateEffect(() => {
    if (socketSendChat.lastMessage?.type === "done") {
      setMessages(
        (state) => {
          const oldValue = new Array(...state)
          const newValue = new Array(socketSendChat.lastMessage?.data);
          const currentValue = [...oldValue, ...newValue]

          return currentValue
        }
      );
    }
  }, [socketSendChat.lastMessage?.type]);

  return (
    <Fragment>
      <div
        className={`${
          showSidebar === "AVAILABLE"
            ? "order-last hidden md:col-span-2 md:block lg:col-span-3"
            : showSidebar === "UNAVAILABLE"
            ? "order-first col-span-1 md:order-last md:col-span-3 lg:col-span-4"
            : "order-first md:order-last md:col-span-2 lg:col-span-3"
        }`}
      >
        <div className="grid h-screen grid-flow-row grid-rows-[85px_minmax(415px,_1fr)_50px]">
          <div className="row-span-1 inline-flex w-full items-center space-x-5 p-5 shadow-sm drop-shadow-sm focus-visible:outline-0 md:space-x-4">
            <Popover.Group className="relative text-[#7E98DF]">
              <Popover>
                <Popover.Button
                  className={`h-[18.7px] w-[22px] text-[#7E98DF] focus-visible:outline-0 ${
                    showSidebar === "AVAILABLE"
                      ? "hidden"
                      : showSidebar === "UNAVAILABLE"
                      ? "block"
                      : "block md:hidden"
                  }`}
                >
                  <ListBtnDashboard />
                </Popover.Button>
                <Popover.Panel
                  unmount={true}
                  className="absolute inset-x-0 top-12 left-[0.5rem] z-10"
                >
                  {({ close }) => (
                    <PopoverDashboardMenu
                      showSidebar={showSidebar}
                      setShowSidebar={setShowSidebar}
                      setOpenDialog={setOpenDialog}
                      close={close}
                      defaultShow={true}
                      className="rounded-r-3xl rounded-bl-3xl rounded-tl"
                    />
                  )}
                </Popover.Panel>
              </Popover>
            </Popover.Group>

            <div className="grid grid-flow-col-dense grid-cols-4 space-x-4 sm:grid-cols-9 md:grid-cols-10 md:space-x-6 lg:space-x-4">
              <div className="col-auto w-[55px] focus-visible:outline-0 md:w-[64px]">
                <img
                  src={
                    contact?.profile
                      ?.avatar ||
                    `https://avatars.dicebear.com/api/pixel-art/${contact?.profile?.username}-${contact?.profile?.id}.svg`
                  }
                  alt={`${contact?.profile?.name} Avatar`}
                  referrerPolicy="no-referrer"
                  className="rounded-[20px] bg-cover bg-local bg-center"
                />
              </div>

              <div className="col-span-3 flex flex-col items-start justify-evenly font-['Rubik'] sm:col-span-8 md:col-span-9">
                <div className="w-[79%] whitespace-pre-wrap break-all text-lg font-medium tracking-[-0.17px] text-[#232323] line-clamp-1 md:w-[80%] lg:w-[90%]">
                  {contact?.profile?.name}
                </div>
                <div className="text-base font-normal tracking-[-0.17px] text-[#7E98DF]">
                  {contact?.profile?.status}
                </div>
              </div>
            </div>

            <Popover.Group className="absolute inset-y-5 right-9 top-5 inline-flex items-center space-x-4 text-[#7E98DF]">
              <Popover>
                <Popover.Button className="focus-visible:outline-0">
                  <ListTopbarBtn />
                </Popover.Button>
                <Popover.Panel
                  unmount={true}
                  className="absolute top-9 right-[0.05rem] z-10"
                >
                  <div className="h-[250px] w-[215px] rounded-l-3xl rounded-br-3xl rounded-tr bg-[#7E98DF] shadow drop-shadow sm:w-[250px]">
                    <div className="flex h-full flex-col justify-around space-y-5 p-5">
                      <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                        <CallBtnTopbar />

                        <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                          Call
                        </span>
                      </div>
                      <div className="inline-flex flex-1 cursor-pointer items-center space-x-6">
                        <DeleteChatBtnTopbar />

                        <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                          Delete chat history
                        </span>
                      </div>
                      <div className="inline-flex flex-1 cursor-pointer items-center space-x-5">
                        <MuteBtnTopbar />

                        <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                          Mute notification
                        </span>
                      </div>
                      <div className="inline-flex flex-1 cursor-pointer items-center space-x-5">
                        <SearchBtnTopbar />

                        <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                          Search
                        </span>
                      </div>
                      <div
                        className="inline-flex flex-1 cursor-pointer items-center space-x-4"
                        onClick={() => {
                          toast.dismiss()

                          toast.custom(
                            (t) => (
                              <div
                                className={`${
                                  t.visible ? "animate-enter" : "animate-leave"
                                } pointer-events-auto flex w-full max-w-xs flex-col items-center rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
                              >
                                <div className="flex w-full flex-1 p-4">
                                  <div className="flex w-full items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                      <img
                                        className="h-10 w-10 rounded-full"
                                        src={
                                          contact?.profile?.avatar ||
                                          `https://avatars.dicebear.com/api/pixel-art/${contact?.profile?.username}-${contact?.profile?.id}.svg`
                                        }
                                        alt={`${socketReadContact.lastMessage?.data?.person?.profile?.name} Avatar`}
                                        referrerPolicy="no-referrer"
                                      />
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <p className="font-['Rubik'] text-sm font-medium text-gray-900">
                                        {contact?.profile?.name}
                                      </p>
                                      <p className="mt-1 w-[90%] overflow-ellipsis font-['Rubik'] text-sm text-[#7E98DF]">
                                        {contact?.profile?.status}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex w-full flex-1 items-center divide-x border-t border-gray-200">
                                  <div className="w-full">
                                    <button
                                      onClick={() => onDeleteContact(socketReadContact.lastMessage?.data?.id)}
                                      className="w-full rounded-none rounded-r-lg border border-transparent p-4 font-['Rubik'] text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                                    >
                                      Remove
                                    </button>
                                  </div>

                                  <div className="w-full">
                                    <button
                                      onClick={() => toast.remove()}
                                      className="w-full rounded-none rounded-r-lg border border-transparent p-4 font-['Rubik'] text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ),
                            {
                              duration: 100000,
                              position: "bottom-center",
                            }
                          );
                        }}
                      >
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                            fill="white"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                            fill="white"
                          />
                        </svg>

                        <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                          Remove contact
                        </span>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Popover>
            </Popover.Group>
          </div>
          <div
            ref={chatListRef}
            className="no-scrollbar row-span-4 flex flex-col space-y-10 overflow-y-auto bg-[#FAFAFA] p-5"
          >
            {messages.map((chat, index) => {
              const chatContent = chat?.content;
              const chatAttachment = chat?.attachment;
              const sendAt = chat?.created_at;
              const senderId = chat?.sender?.id;

              return (
                <div key={index}>
                  {senderId !== profile?.read?.id ? (
                    senderId !== profile?.read?.id &&
                    chatContent &&
                    chatAttachment ? (
                      <div className="flex flex-col space-y-1">
                        <div className="flex flex-col space-y-1.5">
                          <div className="h-auto w-fit max-w-lg overflow-hidden whitespace-pre-wrap break-all rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md bg-[#7E98DF] p-5 text-justify font-['Rubik'] text-base font-normal tracking-[-0.17px] text-[#FFFFFF]">
                            {chatContent}
                          </div>

                          <div className="w-fit max-w-lg cursor-pointer">
                            <ModalImage
                              small={chatAttachment}
                              large={chatAttachment}
                              alt={`${moment(sendAt)
                                .locale(zoneName)
                                .format("ddd. HH:mm")} Attachment`}
                              className="float-left h-[6cm] w-fit max-w-xs rounded-xl bg-cover bg-local bg-center"
                            />
                          </div>
                        </div>

                        <span className="font-['Rubik'] font-normal text-[#7E98DF]">
                          {moment(sendAt).locale(zoneName).format("ddd. HH:mm")}
                        </span>
                      </div>
                    ) : senderId !== profile?.read?.id &&
                      chatContent &&
                      !chatAttachment ? (
                      <div className="flex w-fit max-w-lg flex-col space-y-0.5">
                        <div className="h-auto overflow-hidden whitespace-pre-wrap break-all rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md bg-[#7E98DF] p-5 text-justify font-['Rubik'] text-base font-normal tracking-[-0.17px] text-[#FFFFFF]">
                          {chatContent}
                        </div>

                        <span className="font-['Rubik'] font-normal text-[#7E98DF]">
                          {moment(sendAt).locale(zoneName).format("ddd. HH:mm")}
                        </span>
                      </div>
                    ) : (
                      senderId !== profile?.read?.id &&
                      !chatContent &&
                      chatAttachment && (
                        <div className="flex flex-col space-y-0.5">
                          <div className="w-fit max-w-lg cursor-pointer">
                            <ModalImage
                              small={chatAttachment}
                              large={chatAttachment}
                              alt={`${moment(sendAt)
                                .locale(zoneName)
                                .format("ddd. HH:mm")} Attachment`}
                              className="float-left h-[6cm] w-fit max-w-xs rounded-xl bg-cover bg-local bg-center"
                            />
                          </div>

                          <span className="font-['Rubik'] font-normal text-[#7E98DF]">
                            {moment(sendAt)
                              .locale(zoneName)
                              .format("ddd. HH:mm")}
                          </span>
                        </div>
                      )
                    )
                  ) : (
                    senderId === profile?.read?.id &&
                    (senderId === profile?.read?.id &&
                    chatContent &&
                    chatAttachment ? (
                      <div className="flex flex-row-reverse items-start">
                        <div className="flex flex-col space-y-1">
                          <div className="flex flex-col space-y-1.5">
                            <div className="h-auto w-fit max-w-lg overflow-hidden whitespace-pre-wrap break-all rounded-l-[3rem] rounded-tr-[3rem] rounded-br-md bg-white p-5 text-justify font-['Rubik'] text-base font-normal tracking-[-0.17px] text-[#232323]">
                              {chatContent}
                            </div>

                            <div className="w-fit max-w-lg cursor-pointer">
                              <ModalImage
                                small={chatAttachment}
                                large={chatAttachment}
                                alt={`${moment(sendAt)
                                  .locale(zoneName)
                                  .format("ddd. HH:mm")} Attachment`}
                                className="float-right h-[6cm] w-fit max-w-xs rounded-xl bg-cover bg-local bg-center"
                              />
                            </div>
                          </div>

                          <span className="text-right font-['Rubik'] font-normal text-[#7E98DF]">
                            {moment(sendAt)
                              .locale(zoneName)
                              .format("ddd. HH:mm")}
                          </span>
                        </div>
                      </div>
                    ) : senderId === profile?.read?.id &&
                      chatContent &&
                      !chatAttachment ? (
                      <div className="flex flex-row-reverse items-start">
                        <div className="flex flex-col space-y-0.5">
                          <div className="h-auto w-fit max-w-lg overflow-hidden whitespace-pre-wrap break-all rounded-l-[3rem] rounded-tr-[3rem] rounded-br-md bg-white p-5 text-justify font-['Rubik'] text-base font-normal tracking-[-0.17px] text-[#232323]">
                            {chatContent}
                          </div>

                          <span className="text-right font-['Rubik'] font-normal text-[#7E98DF]">
                            {moment(sendAt)
                              .locale(zoneName)
                              .format("ddd. HH:mm")}
                          </span>
                        </div>
                      </div>
                    ) : (
                      senderId === profile?.read?.id &&
                      !chatContent &&
                      chatAttachment && (
                        <div className="flex flex-row-reverse items-start">
                          <div className="flex flex-col space-y-0.5">
                            <div className="w-fit max-w-lg cursor-pointer">
                              <ModalImage
                                small={chatAttachment}
                                large={chatAttachment}
                                alt={`${moment(sendAt)
                                  .locale(zoneName)
                                  .format("ddd. HH:mm")} Attachment`}
                                className="float-right h-[6cm] w-fit max-w-xs rounded-xl bg-cover bg-local bg-center"
                              />
                            </div>

                            <span className="font-['Rubik'] font-normal text-[#7E98DF]">
                              {moment(sendAt)
                                .locale(zoneName)
                                .format("ddd. HH:mm")}
                            </span>
                          </div>
                        </div>
                      )
                    ))
                  )}
                </div>
              );
            })}

            <AlwaysScrollToBottom />
          </div>
          <div className="row-span-2 flex w-full flex-row bg-[#FFFFFF] shadow-sm drop-shadow-sm">
            <ChatWidget
              sendGif={onGiftGif}
              contentEditableRef={contentEditableRef}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ChatPanel;
