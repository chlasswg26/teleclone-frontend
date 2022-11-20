import { Fragment } from "react";
import { useOutletContext } from "react-router-dom";

const EmptyPanel = () => {
    const { showSidebar } = useOutletContext();

    return (
      <Fragment>
        <div
          className={`${
            showSidebar === "AVAILABLE"
              ? "order-last hidden md:col-span-2 md:block lg:col-span-3"
              : showSidebar === "UNAVAILABLE"
              ? "col-span-1 hidden md:order-last md:col-span-3 lg:col-span-4"
              : "hidden md:flex items-center justify-center md:col-span-2 lg:col-span-3"
          } bg-[#FAFAFA] h-full w-full`}
        >
          <p className="text-[#848484] font-['Rubik'] font-normal text-2xl">
            Please select a chat to start messaging
          </p>
        </div>
      </Fragment>
    );
}

export default EmptyPanel;
