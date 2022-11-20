import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react"
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSocket, useSocketEvent } from "socket.io-react-hook";

const {
  REACT_APP_CLOUDINARY_CLOUD_NAME,
  REACT_APP_CLOUDINARY_CLOUD_PRESET,
  REACT_APP_SOCKET,
  NODE_ENV
} = process.env;

const EditProfileDialog = (props) => {
    const {
        openDialog,
        setOpenDialog,
        onOpenPasswordDialog,
        profile
    } = props
    const [avatar, setAvatar] = useState("");
    const [preview, setPreview] = useState("");
    const { register, handleSubmit, reset } = useForm();
    const { socket } = useSocket(REACT_APP_SOCKET, {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("@acc_token") || null}`,
      },
      withCredentials: true,
      secure: NODE_ENV === "production",
    });
    const socketUpdateProfile = useSocketEvent(socket, 'profile:update');

    const uploadWidgetWindow = () => {
      if (window?.cloudinary) {
        toast.dismiss();

        return window.cloudinary.createUploadWidget(
          {
            cloudName: REACT_APP_CLOUDINARY_CLOUD_NAME,
            uploadPreset: REACT_APP_CLOUDINARY_CLOUD_PRESET,
            sources: [
              "local",
              "url",
              "camera",
              "shutterstock",
              "getty",
              "istock",
              "unsplash",
            ],
            showAdvancedOptions: false,
            cropping: false,
            multiple: false,
            defaultSource: "local",
            styles: {
              palette: {
                window: "#FFFFFF",
                windowBorder: "#7E98DF",
                tabIcon: "#7E98DF",
                menuIcons: "#5A616A",
                textDark: "#000000",
                textLight: "#FFFFFF",
                link: "#7E98DF",
                action: "#FF620C",
                inactiveTabIcon: "#0E2F5A",
                error: "#F44235",
                inProgress: "#7E98DF",
                complete: "#20B832",
                sourceBg: "#E4EBF1",
              },
              fonts: {
                default: null,
                "'Rubik', sans-serif": {
                  url: "https://fonts.googleapis.com/css?family=Rubik",
                  active: true,
                },
              },
            },
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              setPreview(result.info.secure_url);
              setAvatar(result.info.secure_url);
            }
          }
        );
      }
    };

    const onSubmitProfile = async (data) => {
      const profileData = avatar
        ? {
            avatar,
            ...data,
          }
        : data;

      await socketUpdateProfile.sendMessage(profileData);

      setOpenDialog((state) => ({
        ...state,
        setting: {
          ...state.setting,
          menu: !state.setting.menu,
        },
      }));
    };

    const onCancelEditProfile = () => {
      reset();

      setOpenDialog((state) => ({
        ...state,
        setting: {
          ...state.setting,
          menu: !state.setting.menu,
        },
      }));
    }

    const onSetAvatar = () => {
      toast.dismiss();
      toast.loading("Loading...");

      setTimeout(() => {
        if (window?.cloudinary) {
          uploadWidgetWindow().open();
        }
      }, 5000);
    };

    return (
      <Transition appear show={openDialog.setting.menu} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpenDialog((state) => state)}
          open={openDialog.setting.menu}
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
                  onSubmit={handleSubmit(onSubmitProfile)}
                  className="w-full max-w-md"
                >
                  <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="font-['Rubik'] text-lg font-medium leading-6 text-gray-900"
                    >
                      Edit profile
                    </Dialog.Title>
                    <div className="mt-2 flex w-full flex-col content-center items-center space-y-4">
                      <div className="cursor-pointer" onClick={onSetAvatar}>
                        <img
                          src={
                            !preview
                              ? profile?.read?.profile?.avatar ||
                                `https://avatars.dicebear.com/api/pixel-art/${profile?.read?.profile?.username}-${profile?.read?.profile?.id}.svg`
                              : preview
                          }
                          alt="User Avatar"
                          referrerPolicy="no-referrer"
                          className="h-[3.5cm] w-[3.5cm] rounded-3xl bg-cover bg-local bg-center"
                        />
                      </div>
                      <label
                        htmlFor="profile-name"
                        className="block w-full overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                      >
                        <span className="font-['Rubik'] text-xs font-medium text-gray-700">
                          {" "}
                          Name{" "}
                        </span>

                        <input
                          type="text"
                          id="profile-name"
                          {...register("name")}
                          defaultValue={profile?.read?.profile?.name}
                          placeholder={profile?.read?.profile?.name}
                          className="mt-1 w-full border-none p-0 font-['Rubik'] placeholder:font-['Rubik'] focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                        />
                      </label>
                      <label
                        htmlFor="profile-phone"
                        className="block w-full overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                      >
                        <span className="font-['Rubik'] text-xs font-medium text-gray-700">
                          {" "}
                          Phone{" "}
                        </span>

                        <input
                          type="text"
                          id="profile-phone"
                          {...register("phone")}
                          defaultValue={profile?.read?.profile?.phone}
                          placeholder={profile?.read?.profile?.phone}
                          className="mt-1 w-full border-none p-0 font-['Rubik'] placeholder:font-['Rubik'] focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                        />
                      </label>
                      <label
                        htmlFor="profile-bio"
                        className="block w-full overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                      >
                        <span className="font-['Rubik'] text-xs font-medium text-gray-700">
                          {" "}
                          Bio{" "}
                        </span>

                        <textarea
                          type="text"
                          id="profile-bio"
                          {...register("bio")}
                          defaultValue={profile?.read?.profile?.bio}
                          placeholder={profile?.read?.profile?.bio}
                          className="mt-1 h-[80px] w-full border-none p-0 font-['Rubik'] placeholder:font-['Rubik'] focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                        />
                      </label>
                    </div>

                    <div className="mt-4 hidden w-full flex-1 items-center justify-between md:inline-flex">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-[#7E98DF] px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-[#a4baf8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onOpenPasswordDialog}
                      >
                        Change Password
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
                          onClick={onCancelEditProfile}
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
                          onClick={onCancelEditProfile}
                        >
                          Cancel
                        </button>
                      </div>

                      <button
                        type="button"
                        className="rounded-md border border-transparent bg-[#7E98DF] px-4 py-2 font-['Rubik'] text-sm font-medium text-white shadow-sm drop-shadow-sm hover:bg-[#a4baf8] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onOpenPasswordDialog}
                      >
                        Change Password
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

export default EditProfileDialog
