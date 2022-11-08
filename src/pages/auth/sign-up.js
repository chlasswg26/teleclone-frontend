import { useTitle, useUpdateEffect } from "ahooks";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocketEvent } from "socket.io-react-hook";
import { registerActionCreator } from "../../redux/action/creator/auth";

const { REACT_APP_TITLE, REACT_APP_BACKEND_URL } = process.env;

const SignUp = (socket) => {
  useTitle(`${REACT_APP_TITLE} - Register`);

  const [showPassword, setShowPassword] = useState({
    type: "password",
    visible: false,
  });
  const [disabled, setDisabled] = useState(false);
  const [popup, setPopup] = useState();
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data) => dispatch(registerActionCreator(data));
  const navigate = useNavigate();
  const registration = useSelector(state => state.auth.register)

  const checkPopup = () => {
    const check = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        setDisabled(false);
      }
    }, 1000);
  };

  const openPopup = () => {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${REACT_APP_BACKEND_URL}/auth/google?socketId=${socket.id}`;

    return window.open(
      url,
      `${REACT_APP_TITLE} - Sign In with Google`,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
        height=${height}, top=${top}, left=${left}`
    );
  };

  const startAuth = (e) => {
    if (!disabled) {
      e.preventDefault();
      setPopup(openPopup());
      checkPopup();
      setDisabled(true);
    }
  };

  const handlersAuthGoogle = (data) => {
    localStorage.setItem("@acc_token", data.accessToken);

    setIsGoogleAuthenticated(true);
  };

  useSocketEvent(socket, "auth:google", { onMessage: handlersAuthGoogle });

  useUpdateEffect(() => {
    if (isGoogleAuthenticated) window.location.replace("/");

    if (registration?.isPending) {
      toast.dismiss();
      toast.loading("Loading...");
    }

    if (registration?.isRejected) {
      toast.dismiss();
      toast.error(registration?.errorMessage);
    }

    if (registration?.isFulfilled) {
      reset();
      toast.dismiss();
      toast.success("Registration successfully");
    }
  }, [isGoogleAuthenticated, registration, reset]);

  return (
    <Fragment>
      <div className="mx-auto flex h-full min-h-screen w-full items-center justify-center bg-[#E5E5E5] p-10 md:p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="animate__animated animate__delay-1s animate__bounceInDown animate__fast mx-auto flex h-[600px] w-[50vmax] flex-col space-y-5 rounded-3xl bg-white p-5 drop-shadow-lg sm:w-[65vmax] md:p-11 lg:w-[550px]">
            <div className="inline-flex w-full p-1 md:p-0">
              <button
                type="button"
                className="animate-[bounce_3s_linear] font-['Rubik'] text-[7E98DF] transition ease-in-out hover:scale-110 active:scale-90"
                onClick={() => navigate("/auth/signin")}
              >
                <svg
                  viewBox="0 0 11 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.20711 9.3271L9.22925 3.30496C9.24226 3.29283 9.2551 3.28044 9.26777 3.26777L9.97487 2.56066C10.5607 1.97487 10.5607 1.02513 9.97487 0.43934C9.38909 -0.146447 8.43934 -0.146447 7.85355 0.43934L7.52579 0.767105L7.52513 0.766442L0.732233 7.55933C-0.244077 8.53564 -0.244079 10.1186 0.732233 11.0949L7.14646 17.5091L7.52513 17.8878L7.85357 18.2162C8.43936 18.802 9.3891 18.802 9.97489 18.2162C10.5607 17.6304 10.5607 16.6807 9.97489 16.0949L9.64645 15.7664L9.26778 15.3878C9.26635 15.3863 9.2649 15.3849 9.26346 15.3835L3.20711 9.3271Z"
                    fill="#7E98DF"
                  />
                </svg>
              </button>
              <p className="animate__animated animate__rubberBand animate__delay-2s animate__fast mx-auto text-center font-['Rubik'] text-2xl font-semibold tracking-[-0.011] text-[#7E98DF]">
                Register
              </p>
            </div>
            <p className="animate__animated animate__backInDown animate__delay-2s animate__fast text-left font-['Rubik'] text-lg text-[#232323]">
              Let’s create your account!
            </p>
            <div className="flex flex-col space-y-4">
              <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col">
                <label
                  htmlFor="name"
                  className="font-['Rubik'] font-medium text-[#848484]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="h-[34px] border-b-[1.5px] border-b-[#232323] font-['Rubik'] text-base font-medium text-[#232323] placeholder:font-normal placeholder:text-[#949494] focus-visible:outline-0"
                  placeholder="Input your name"
                />
              </div>
              <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col">
                <label
                  htmlFor="email"
                  className="font-['Rubik'] font-medium text-[#848484]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="h-[34px] border-b-[1.5px] border-b-[#232323] font-['Rubik'] text-base font-medium text-[#232323] placeholder:font-normal placeholder:text-[#949494] focus-visible:outline-0"
                  placeholder="Input valid e-mail"
                />
              </div>
              <div className="animate__animated animate__fadeInUp animate__delay-2s animate__fast flex w-full flex-1 flex-col">
                <label
                  htmlFor="password"
                  className="font-['Rubik'] font-medium text-[#848484]"
                >
                  Password
                </label>
                <input
                  type={showPassword.type || "text"}
                  id="password"
                  {...register("password")}
                  className={`h-[34px] border-b-[1.5px] border-b-[#232323] font-['Rubik'] text-base font-medium text-[#232323] [padding-inline-end:2rem] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#949494] placeholder:[-webkit-text-stroke-width:0em] focus-visible:outline-0 ${
                    showPassword.type === "password"
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
            </div>
            <div className="flex flex-col items-center justify-center space-y-1">
              <button
                type="submit"
                className="h-[60px] w-[35vmax] animate-[bounce_3s_ease-in-out] rounded-[70px] bg-[#7E98DF] text-center font-['Rubik'] text-base font-medium leading-5 text-[#FFFFFF] drop-shadow-md transition ease-in-out hover:scale-105 active:scale-100 lg:w-[360px]"
              >
                Register
              </button>
              <div className="animate__animated animate__zoomIn animate__delay-3s animate__fast inline-flex w-full items-center justify-center">
                <hr className="my-8 w-[35vmax] rounded border-[1.5px] bg-gray-400 lg:w-[360px]" />
                <div className="absolute left-1/2 -translate-x-1/2 bg-white px-4 dark:bg-gray-900">
                  <span className="text-center font-['Rubik'] text-base font-normal text-[#848484]">
                    Register with
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="h-[60px] w-[35vmax] animate-[bounce_3s_ease-in-out] rounded-[70px] border-2 border-[#7E98DF] text-center font-['Rubik'] text-base font-medium leading-5 text-[#7E98DF] shadow transition ease-in-out hover:scale-105 active:scale-100 lg:w-[360px]"
                onClick={startAuth}
              >
                <div className="flex flex-row items-center justify-center space-x-4">
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M17.2825 7.35604H8.95553V10.807H13.7475C13.3015 13 11.4345 14.26 8.95553 14.26C8.26186 14.2612 7.57479 14.1255 6.93371 13.8605C6.29263 13.5956 5.71016 13.2067 5.21971 12.7161C4.72926 12.2256 4.34048 11.6431 4.07566 11.0019C3.81085 10.3608 3.67521 9.6737 3.67653 8.98003C3.67534 8.28645 3.81108 7.59946 4.07595 6.95845C4.34083 6.31743 4.72963 5.73501 5.22006 5.24457C5.7105 4.75414 6.29292 4.36533 6.93394 4.10046C7.57495 3.83559 8.26194 3.69985 8.95553 3.70104C10.2145 3.70104 11.3525 4.14804 12.2455 4.87904L14.8455 2.28004C13.2615 0.899035 11.2305 0.0470351 8.95553 0.0470351C7.78133 0.043603 6.61805 0.272345 5.53258 0.720105C4.4471 1.16786 3.46086 1.82581 2.63058 2.65609C1.8003 3.48637 1.14235 4.47261 0.694595 5.55808C0.246835 6.64356 0.0180933 7.80684 0.0215254 8.98104C0.0179605 10.1553 0.246612 11.3186 0.694325 12.4041C1.14204 13.4897 1.79997 14.476 2.63028 15.3063C3.46059 16.1366 4.44689 16.7945 5.53242 17.2422C6.61795 17.6899 7.7813 17.9186 8.95553 17.915C13.4225 17.915 17.4845 14.666 17.4845 8.98104C17.4845 8.45304 17.4035 7.88404 17.2825 7.35604Z"
                      fill="#7E98DF"
                    />
                  </svg>

                  <span className="text-center text-base font-medium">
                    Google
                  </span>
                </div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default SignUp;
