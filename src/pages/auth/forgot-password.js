import { useTitle } from "ahooks"
import { Fragment } from "react"
const { REACT_APP_TITLE } = process.env

const ForgotPassword = () => {
    useTitle(`${REACT_APP_TITLE} - Forgot Password`)

    return (
        <Fragment>
            <div className="flex justify-center items-center mx-auto h-full min-h-screen w-full bg-[#E5E5E5] p-10 md:p-0">
                <div className="flex flex-col space-y-7 w-[50vmax] sm:w-[65vmax] lg:w-[550px] h-[600px] mx-auto bg-white drop-shadow-lg rounded-3xl p-5 md:p-11 animate__animated animate__delay-1s animate__bounceInDown animate__fast">
                    <div className="inline-flex w-full p-1 md:p-0">
                        <button type="button" className="font-['Rubik'] text-[7E98DF] transition ease-in-out hover:scale-110 active:scale-90 animate-[bounce_3s_linear]">
                            <svg viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.20711 9.3271L9.22925 3.30496C9.24226 3.29283 9.2551 3.28044 9.26777 3.26777L9.97487 2.56066C10.5607 1.97487 10.5607 1.02513 9.97487 0.43934C9.38909 -0.146447 8.43934 -0.146447 7.85355 0.43934L7.52579 0.767105L7.52513 0.766442L0.732233 7.55933C-0.244077 8.53564 -0.244079 10.1186 0.732233 11.0949L7.14646 17.5091L7.52513 17.8878L7.85357 18.2162C8.43936 18.802 9.3891 18.802 9.97489 18.2162C10.5607 17.6304 10.5607 16.6807 9.97489 16.0949L9.64645 15.7664L9.26778 15.3878C9.26635 15.3863 9.2649 15.3849 9.26346 15.3835L3.20711 9.3271Z" fill="#7E98DF" />
                            </svg>
                        </button>
                        <p className="font-['Rubik'] font-semibold text-2xl tracking-[-0.011] mx-auto text-center text-[#7E98DF] animate__animated animate__rubberBand animate__delay-2s animate__fast">
                            Forgot Password
                        </p>
                    </div>
                    <p className="font-['Rubik'] text-lg text-left text-[#232323] animate__animated animate__backInDown animate__delay-2s animate__fast">
                        You’ll get messages soon on your e-mail
                    </p>

                    <div className="flex flex-col w-full space-y-2 animate__animated animate__fadeInUp animate__delay-2s animate__fast">
                        <label htmlFor="email" className="font-['Rubik'] font-medium text-[#848484]">
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="font-['Rubik'] text-base font-medium placeholder:font-normal h-[34px] text-[#232323] placeholder:text-[#949494] focus-visible:outline-0 border-b-[1.5px] border-b-[#232323]"
                            placeholder="Input valid e-mail"
                        />
                    </div>

                    <button type="button" className="font-['Rubik'] inline-flex self-center justify-center items-center font-medium leading-5 text-base text-center text-[#FFFFFF] bg-[#7E98DF] rounded-[70px] w-[35vmax] lg:w-[360px] h-[60px] transition ease-in-out hover:scale-105 active:scale-100 drop-shadow-md animate-[bounce_3s_ease-in-out]">
                        Send
                    </button>
                </div>
            </div>
        </Fragment>
    )
}

export default ForgotPassword
