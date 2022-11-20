import { Dialog, Transition } from "@headlessui/react";
import { useUpdateEffect } from "ahooks";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const { REACT_APP_SOCKET, NODE_ENV } = process.env;

const AddContactDialog = (props) => {
  const { openDialog, setOpenDialog } = props;
  const { register, handleSubmit, reset } = useForm();
  const { socket } = useSocket(REACT_APP_SOCKET, {
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
    },
    withCredentials: true,
    secure: NODE_ENV === "production",
  });
  const socketFindContact = useSocketEvent(socket, "contact:find");
  const socketAddContact = useSocketEvent(socket, "contact:add");

  const onFindContact = async (data) => {
    toast.loading("Loading...");

    await socketFindContact.sendMessage(data.username);
  };

  const onAddContact = async (data) => {
    toast.loading('Loading...')

    await socketAddContact.sendMessage(data)
  }

  const onCancelAddContact = () => {
    toast.remove()

    reset();

    setOpenDialog((state) => ({
      ...state,
      contact: {
        ...state.contact,
        add: !state.contact.add,
      },
    }));
  };

  useUpdateEffect(() => {
    if (socketFindContact.lastMessage?.type === "done") {
      toast.dismiss();

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
                      socketFindContact.lastMessage?.data?.avatar ||
                      `https://avatars.dicebear.com/api/pixel-art/${socketFindContact.lastMessage?.data?.name}-${socketFindContact.lastMessage?.data?.id}.svg`
                    }
                    alt={`${socketFindContact.lastMessage?.data?.name} Avatar`}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-['Rubik'] font-medium text-gray-900">
                    {socketFindContact.lastMessage?.data?.name}
                  </p>
                  <p className="mt-1 w-[90%] font-['Rubik'] overflow-ellipsis text-sm text-gray-500 line-clamp-1">
                    {socketFindContact.lastMessage?.data?.bio ||
                      "You can invite me!"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-1 items-center divide-x border-t border-gray-200">
              <div className="w-full">
                <button
                  onClick={() =>
                    onAddContact(socketFindContact.lastMessage?.data?.user?.id)
                  }
                  className="w-full font-['Rubik'] rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Invite
                </button>
              </div>

              <div className="w-full">
                <button
                  onClick={() => toast.remove()}
                  className="w-full font-['Rubik'] rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ),
        { duration: 100000, position: "bottom-center" }
      );
    }

    if (socketFindContact.lastMessage?.type === "err") {
      toast.dismiss();

      toast.error(socketFindContact.lastMessage?.message);
    }

  }, [socketFindContact.lastMessage]);

  useUpdateEffect(() => {
    if (socketAddContact.lastMessage?.type === "info") {
      toast.dismiss();

      toast.success(socketAddContact.lastMessage?.message);
    }

    if (socketAddContact.lastMessage?.type === "err") {
      toast.dismiss();

      toast.error(socketAddContact.lastMessage?.message);
    }
  }, [socketAddContact.lastMessage]);

  return (
    <Transition appear show={openDialog.contact.add} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setOpenDialog((state) => state)}
        open={openDialog.contact.add}
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
              <form
                onSubmit={handleSubmit(onFindContact)}
                className="w-full max-w-xs"
              >
                <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mb-5 font-['Rubik'] text-lg font-medium leading-6 text-gray-900"
                  >
                    Add contact
                  </Dialog.Title>
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
                      {...register("username")}
                      id="username"
                      placeholder="Username"
                      className="h-10 w-full rounded-md pl-8 pr-10 font-['Rubik'] shadow-sm placeholder:font-['Rubik'] focus-visible:outline-[#7E98DF] sm:text-sm"
                    />

                    <span className="absolute inset-y-0 right-0 grid w-10 place-content-center">
                      <button
                        type="submit"
                        className="rounded-full bg-[#7E98DF] text-white hover:bg-[#abc1ff]"
                      >
                        <svg
                          className="w-6 h-6"
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

                  <button
                    type="button"
                    className="float-right w-[75px] rounded-md border border-transparent bg-rose-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-rose-200 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onCancelAddContact}
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </form>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddContactDialog;
