import { useTitle } from "ahooks";
import { Fragment, useState } from "react";
const { REACT_APP_TITLE } = process.env;

const ResetPassword = () => {
    useTitle(`${REACT_APP_TITLE} - Reset Password`);

    const [showPassword, setShowPassword] = useState({
        type: "password",
        visible: false,
    });
    const [showRepeatPassword, setShowRepeatPassword] = useState({
        type: "password",
        visible: false,
    });

    return (
        <Fragment>
            <div className="mx-auto flex h-full min-h-screen w-full items-center justify-center bg-[#E5E5E5] p-10 md:p-0">
                <div className="animate__animated animate__delay-1s animate__bounceInDown animate__fast mx-auto flex h-[600px] w-[50vmax] flex-col space-y-7 rounded-3xl bg-white p-5 drop-shadow-lg sm:w-[65vmax] md:space-y-5 md:p-11 lg:w-[550px]">
                    <p className="animate__animated animate__rubberBand animate__delay-2s animate__fast text-center font-['Rubik'] text-2xl font-semibold tracking-[-0.011] text-[#7E98DF]">
                        Reset Password
                    </p>
                    <p className="animate__animated animate__backInDown animate__delay-2s animate__fast text-left font-['Rubik'] text-lg text-[#232323]">
                        Update your old password with New Password
                    </p>
                    <div className="flex flex-col space-y-5">
                        <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col space-y-2">
                            <label
                                htmlFor="password"
                                className="font-['Rubik'] font-medium text-[#848484]"
                            >
                                Password
                            </label>
                            <input
                                type={showPassword.type || "text"}
                                id="password"
                                className={`h-[34px] border-b-[1.5px] border-b-[#232323] font-['Rubik'] text-base font-medium text-[#232323] [padding-inline-end:2rem] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#949494] placeholder:[-webkit-text-stroke-width:0em] focus-visible:outline-0 ${showPassword.type === "password"
                                        ? "tracking-[0.3em] [-webkit-text-stroke-width:0.2em]"
                                        : "tracking-normal"
                                    }`}
                                placeholder="Input trust password"
                            />
                            <div
                                className="absolute inset-y-5 right-1 bottom-0 flex cursor-pointer items-center"
                                onClick={() =>
                                    setShowPassword((state) => ({
                                        type: state.type === "password" ? "text" : "password",
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
                        </div>
                        <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col space-y-2">
                            <label
                                htmlFor="repeat-password"
                                className="font-['Rubik'] font-medium text-[#848484]"
                            >
                                Repeat Password
                            </label>
                            <input
                                type={showRepeatPassword.type || "text"}
                                id="repeat-password"
                                className={`h-[34px] border-b-[1.5px] border-b-[#232323] font-['Rubik'] text-base font-medium text-[#232323] [padding-inline-end:2rem] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#949494] placeholder:[-webkit-text-stroke-width:0em] focus-visible:outline-0 ${showRepeatPassword.type === "password"
                                        ? "tracking-[0.3em] [-webkit-text-stroke-width:0.2em]"
                                        : "tracking-normal"
                                    }`}
                                placeholder="Input repeat password"
                            />
                            <div
                                className="absolute inset-y-5 right-1 bottom-0 flex cursor-pointer items-center"
                                onClick={() =>
                                    setShowRepeatPassword((state) => ({
                                        type: state.type === "password" ? "text" : "password",
                                        visible: !state.visible,
                                    }))
                                }
                            >
                                {showRepeatPassword.visible ? (
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
                        </div>
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-[60px] w-[35vmax] animate-[bounce_3s_ease-in-out] items-center justify-center self-center rounded-[70px] bg-[#7E98DF] text-center font-['Rubik'] text-base font-medium leading-5 text-[#FFFFFF] drop-shadow-md transition ease-in-out hover:scale-105 active:scale-100 lg:w-[360px]"
                    >
                        Update
                    </button>
                </div>
            </div>
        </Fragment>
    );
};

export default ResetPassword;
