import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react"
import { useForm } from "react-hook-form";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const { REACT_APP_SOCKET, NODE_ENV } = process.env

const EditPasswordDialog = (props) => {
    const {
        openDialog,
        setOpenDialog,
        onOpenProfileDialog
    } = props
    const { register, handleSubmit, reset } = useForm();
    const { socket } = useSocket(REACT_APP_SOCKET, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
      },
      withCredentials: true,
      secure: NODE_ENV === "production",
    });
    const socketUpdateProfile = useSocketEvent(socket, 'profile:update');
    const [showPassword, setShowPassword] = useState({
      type: "password",
      visible: false,
    });

    const onSubmitPassword = async (data) => {
      await socketUpdateProfile.sendMessage(data)

      setOpenDialog((state) => ({
        ...state,
        setting: {
          ...state.setting,
          password: !state.setting.password
        },
      }));
    };

    const onCancelEditPassword = () => {
      reset();

      setOpenDialog((state) => ({
        ...state,
        setting: {
          ...state.setting,
          password: !state.setting.password,
        },
      }));
    }

    return (
      <Transition appear show={openDialog.setting.password} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpenDialog((state) => state)}
          open={openDialog.setting.password}
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
                  onSubmit={handleSubmit(onSubmitPassword)}
                  className="w-full max-w-md"
                >
                  <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="font-['Rubik'] text-lg font-medium leading-6 text-gray-900"
                    >
                      Change password
                    </Dialog.Title>
                    <div className="mt-2 flex w-full flex-col content-center items-center space-y-4">
                      <label
                        htmlFor="profile-password"
                        className="block w-full overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                      >
                        <span className="font-['Rubik'] text-xs font-medium text-gray-700">
                          {" "}
                          New Password{" "}
                        </span>

                        <input
                          type={showPassword.type || "text"}
                          id="profile-password"
                          {...register("password")}
                          className="mt-1 w-full border-none p-0 font-['Rubik'] placeholder:font-['Rubik'] focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                        />

                        <div
                          className="absolute right-[2.7rem] top-[5rem] flex cursor-pointer items-center"
                          onClick={() =>
                            setShowPassword((state) => ({
                              type:
                                state.type === "password" ? "text" : "password",
                              visible: !state.visible,
                            }))
                          }
                        >
                          {showPassword.visible ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              className="h-5 w-5"
                              viewBox="0 0 16 16"
                            >
                              <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                              <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              className="h-5 w-5"
                              viewBox="0 0 16 16"
                            >
                              <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                              <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                          )}
                        </div>
                      </label>
                    </div>

                    <div className="mt-4 hidden w-full flex-1 items-center justify-between md:inline-flex">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#7E98DF] px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-[#a4baf8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onOpenProfileDialog}
                      >
                        Edit Profile
                      </button>

                      <div className="inline-flex items-center space-x-3">
                        <button
                          type="submit"
                          className="inline-flex w-[75px] justify-center rounded-md border border-transparent bg-emerald-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-emerald-200 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          className="inline-flex w-[75px] justify-center rounded-md border border-transparent bg-rose-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-rose-200 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={onCancelEditPassword}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex w-full flex-1 flex-col items-center space-y-5 md:hidden">
                      <div className="inline-flex items-center justify-evenly space-x-3">
                        <button
                          type="submit"
                          className="w-[75px] rounded-md border border-transparent bg-emerald-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-emerald-200 hover:text-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          className="w-[75px] rounded-md border border-transparent bg-rose-400 px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-rose-200 hover:text-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={onCancelEditPassword}
                        >
                          Cancel
                        </button>
                      </div>

                      <button
                        type="button"
                        className="rounded-md border border-transparent bg-[#7E98DF] px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-[#a4baf8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onOpenProfileDialog}
                      >
                        Edit Profile
                      </button>
                    </div>
                  </Dialog.Panel>
                </form>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
}

export default EditPasswordDialog
