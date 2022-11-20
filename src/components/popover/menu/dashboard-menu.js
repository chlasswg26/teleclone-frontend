import { Fragment } from "react"
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { logoutActionCreator } from "../../../redux/action/creator/auth";
import CallBtnDashboardMenu from "../../../svg/call-btn-dashboard-menu";
import CloseBtnDashboardMenu from "../../../svg/close-btn-dashboard-menu";
import ContactBtnDashboardMenu from "../../../svg/contact-btn-dashboard-menu";
import InviteFriendBtnDashboardMenu from "../../../svg/invite-friend-btn-dashboard-menu";
import LogoutBtnTopbar from "../../../svg/logout-btn-topbar";
import OpenBtnDashboardMenu from "../../../svg/open-btn-dashboard-menu";
import SaveMessageBtnDashboardMenu from "../../../svg/save-message-btn-dashboard-menu";
import SettingBtnDashboardMenu from "../../../svg/setting-btn-dashboard-menu";
import TelecloneFaqBtnDashboardMenu from "../../../svg/teleclone-faq-btn-dashboard-menu";

const { REACT_APP_TITLE } = process.env;

const PopoverDashboardMenu = (props) => {
    const {
        showSidebar,
        setShowSidebar,
        setOpenDialog,
        close,
        defaultShow = false,
        className
    } = props
    const { contactUsername } = useParams();
    const dispatch = useDispatch();

    return (
      <Fragment>
        <div
          className={`${
            contactUsername ? "h-[390px]" : "h-[350px]"
          } w-[215px] bg-[#7E98DF] shadow drop-shadow sm:w-[240px] ${className}`}
        >
          <div className="flex h-full flex-col justify-around space-y-5 p-5">
            {contactUsername && (
              <div
                className="inline-flex flex-1 items-center space-x-4"
                onClick={() => {
                  setShowSidebar(
                    showSidebar === "AVAILABLE"
                      ? "UNAVAILABLE"
                      : showSidebar === "UNAVAILABLE"
                      ? "AVAILABLE"
                      : defaultShow
                      ? "AVAILABLE"
                      : "UNAVAILABLE"
                  );

                  close();
                }}
              >
                {showSidebar === "AVAILABLE" ? (
                  <CloseBtnDashboardMenu />
                ) : showSidebar === "UNAVAILABLE" ? (
                  <OpenBtnDashboardMenu />
                ) : defaultShow ? (
                  <OpenBtnDashboardMenu />
                ) : (
                  <CloseBtnDashboardMenu />
                )}

                <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                  {showSidebar === "AVAILABLE"
                    ? "Close Sidebar"
                    : showSidebar === "UNAVAILABLE"
                    ? "Open Sidebar"
                    : defaultShow
                    ? "Open Sidebar"
                    : "Close Sidebar"}
                </span>
              </div>
            )}
            <div
              className="inline-flex flex-1 cursor-pointer items-center space-x-4"
              onClick={() =>
                setOpenDialog((state) => ({
                  ...state,
                  setting: {
                    ...state.setting,
                    menu: !state.setting.menu,
                  },
                }))
              }
            >
              <SettingBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Settings
              </span>
            </div>
            <div
              className="inline-flex flex-1 cursor-pointer items-center space-x-4"
              onClick={() =>
                setOpenDialog((state) => ({
                  ...state,
                  contact: {
                    ...state.contact,
                    list: !state.contact.list,
                  },
                }))
              }
            >
              <ContactBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Contacts
              </span>
            </div>
            <div className="inline-flex flex-1 cursor-pointer items-center space-x-3">
              <CallBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Calls
              </span>
            </div>
            <div className="inline-flex flex-1 cursor-pointer items-center space-x-5">
              <SaveMessageBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Save messages
              </span>
            </div>
            <div
              className="inline-flex flex-1 cursor-pointer items-center space-x-3"
              onClick={() =>
                setOpenDialog((state) => ({
                  ...state,
                  contact: {
                    ...state.contact,
                    add: !state.contact.add,
                  },
                }))
              }
            >
              <InviteFriendBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Invite Friends
              </span>
            </div>
            <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
              <TelecloneFaqBtnDashboardMenu />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                {REACT_APP_TITLE} FAQ
              </span>
            </div>
            <div
              className="inline-flex flex-1 cursor-pointer items-center space-x-5"
              onClick={() => dispatch(logoutActionCreator())}
            >
              <LogoutBtnTopbar />

              <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                Logout
              </span>
            </div>
          </div>
        </div>
      </Fragment>
    );
}

export default PopoverDashboardMenu
