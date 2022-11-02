import { useTitle } from "ahooks"
import { Fragment } from "react"

const { PUBLIC_URL, REACT_APP_TITLE } = process.env

const Landing = () => {
    useTitle(`Welcome to ${REACT_APP_TITLE} App - Realtime Chat Applications`)

    return (
        <Fragment>
            <div className="flex flex-col justify-center mx-auto h-screen w-screen bg-[#39B3CA]">
                <img
                    src={`${PUBLIC_URL}/logo.png`}
                    alt={`${REACT_APP_TITLE} Logo`}
                    className="mx-auto animate__animated animate__rotateIn animate__delay-1s animate__faster animate__infinite"
                />
            </div>
        </Fragment>
    )
}

export default Landing
