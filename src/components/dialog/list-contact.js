import { Dialog, Transition } from "@headlessui/react";
import { useUpdateEffect } from "ahooks";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const { REACT_APP_SOCKET, NODE_ENV } = process.env;

const ListContactDialog = (props) => {
  const { openDialog, setOpenDialog, profile } = props;
  const { socket } = useSocket(REACT_APP_SOCKET, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
    },
    withCredentials: true,
    secure: NODE_ENV === "production",
  });
  const socketDeleteContact = useSocketEvent(socket, "contact:delete");
  const [contacts, setContacts] = useState([]);
  const parentRef = useRef()
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate()

  const onDeleteContact = async (data) => {
    toast.remove()
    toast.loading("Loading...");

    await socketDeleteContact.sendMessage(data);
  };

  const onFindContact = (data) => {
    setContacts(
      profile?.read?.contacts?.filter(
        (value) =>
          value?.person?.profile?.name
            ?.toLowerCase()
            .includes(data.search.toLowerCase()) ||
          value?.person?.profile?.status
            ?.toLowerCase()
            .includes(data.search.toLowerCase()) ||
          value?.person?.profile?.username
            ?.toLowerCase()
            .includes(data.search.toLowerCase())
      )
    );
  }

  const onCancelListContact = () => {
    toast.remove();
    reset();

    setOpenDialog((state) => ({
      ...state,
      contact: {
        ...state.contact,
        list: !state.contact.list,
      },
    }));
  };

  useEffect(() => {
    setContacts(profile?.read?.contacts);
  }, [profile]);

  useUpdateEffect(() => {
    if (socketDeleteContact.lastMessage?.type === "info") {
      toast.dismiss();

      toast.success(socketDeleteContact.lastMessage?.message);
    }

    if (socketDeleteContact.lastMessage?.type === "err") {
      toast.dismiss();

      toast.error(socketDeleteContact.lastMessage?.message);
    }
  }, [socketDeleteContact.lastMessage]);

  return (
    <Transition appear show={openDialog.contact.list} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setOpenDialog((state) => state)}
        open={openDialog.contact.list}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="mb-5 font-['Rubik'] text-lg font-medium leading-6 text-gray-900"
                >
                  List contact
                </Dialog.Title>
                <form onSubmit={handleSubmit(onFindContact)}>
                  <div className="relative mb-5">
                    <span className="absolute inset-y-0 left-2 grid w-auto place-content-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>

                    <input
                      type="text"
                      {...register("search")}
                      placeholder="Find contact"
                      className="h-10 w-full rounded-md pl-8 pr-10 font-['Rubik'] shadow-sm placeholder:font-['Rubik'] focus-visible:outline-[#7E98DF] sm:text-sm"
                    />

                    <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
                      <button
                        type="submit"
                        className="rounded-full bg-[#7E98DF] text-white hover:bg-[#abc1ff]"
                      >
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5858 13.4142L7.75735 10.5858L6.34314 12L10.5858 16.2427L17.6568 9.1716L16.2426 7.75739L10.5858 13.4142Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </span>
                  </div>
                </form>
                <div className="container mx-auto mb-5 mt-10 flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-white shadow dark:bg-gray-800">
                  <div
                    className="h-[50vh] w-full divide-y overflow-y-auto"
                    ref={parentRef}
                  >
                    <Virtuoso
                      style={{ height: "50vh" }}
                      customScrollParent={parentRef.current}
                      data={contacts || []}
                      itemContent={(index, user) => (
                        <div key={index} className="flex flex-row items-center">
                          <div
                            className="flex flex-1 cursor-pointer select-none items-center p-4 hover:bg-gray-50"
                            onClick={() => {
                              navigate(`/message/${user?.person?.profile?.username}`);

                              setOpenDialog((state) => ({
                                ...state,
                                contact: {
                                  ...state.contact,
                                  list: !state.contact.list,
                                },
                              }));
                            }}
                          >
                            <div className="mr-4 flex h-10 w-10 flex-col items-center justify-center">
                              <div className="relative block cursor-pointer">
                                <img
                                  src={
                                    user?.person?.profile?.avatar ||
                                    `https://avatars.dicebear.com/api/pixel-art/${user?.person?.profile?.username}-${user?.person?.profile?.id}.svg`
                                  }
                                  alt={`${user?.person?.profile?.name} Avatar`}
                                  referrerPolicy="no-referrer"
                                  className="mx-auto h-10 w-10 rounded-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1 pl-1">
                              <div className="overflow-ellipsis font-['Rubik'] font-medium line-clamp-2 dark:text-white">
                                {user?.person?.profile?.name}
                              </div>
                              <div className="font-['Rubik'] text-sm text-[#7E98DF]">
                                {user?.person?.profile?.status}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="absolute right-5 rounded-full bg-red-500 text-white hover:bg-red-400"
                            onClick={() =>
                              toast.custom(
                                (t) => (
                                  <div
                                    className={`${
                                      t.visible
                                        ? "animate-enter"
                                        : "animate-leave"
                                    } pointer-events-auto flex w-full max-w-xs flex-col items-center rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5`}
                                  >
                                    <div className="flex w-full flex-1 p-4">
                                      <div className="flex w-full items-start">
                                        <div className="flex-shrink-0 pt-0.5">
                                          <img
                                            className="h-10 w-10 rounded-full"
                                            src={
                                              user?.person?.profile?.avatar ||
                                              `https://avatars.dicebear.com/api/pixel-art/${user?.person?.profile?.username}-${user?.person?.profile?.id}.svg`
                                            }
                                            alt={`${user?.person?.profile?.name} Avatar`}
                                            referrerPolicy="no-referrer"
                                          />
                                        </div>
                                        <div className="ml-3 flex-1">
                                          <p className="font-['Rubik'] text-sm font-medium text-gray-900">
                                            {user?.person?.profile?.name}
                                          </p>
                                          <p className="mt-1 w-[90%] overflow-ellipsis font-['Rubik'] text-sm text-[#7E98DF]">
                                            {user?.person?.profile?.status}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex w-full flex-1 items-center divide-x border-t border-gray-200">
                                      <div className="w-full">
                                        <button
                                          onClick={() =>
                                            onDeleteContact(user?.id)
                                          }
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
                              )
                            }
                          >
                            <svg
                              className="h-7 w-7"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.3394 9.32245C16.7434 8.94589 16.7657 8.31312 16.3891 7.90911C16.0126 7.50509 15.3798 7.48283 14.9758 7.85938L12.0497 10.5866L9.32245 7.66048C8.94589 7.25647 8.31312 7.23421 7.90911 7.61076C7.50509 7.98731 7.48283 8.62008 7.85938 9.0241L10.5866 11.9502L7.66048 14.6775C7.25647 15.054 7.23421 15.6868 7.61076 16.0908C7.98731 16.4948 8.62008 16.5171 9.0241 16.1405L11.9502 13.4133L14.6775 16.3394C15.054 16.7434 15.6868 16.7657 16.0908 16.3891C16.4948 16.0126 16.5171 15.3798 16.1405 14.9758L13.4133 12.0497L16.3394 9.32245Z"
                                fill="currentColor"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                                fill="currentColor"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="float-right w-[75px] rounded-md border border-transparent bg-rose-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-rose-200 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  onClick={onCancelListContact}
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ListContactDialog;
