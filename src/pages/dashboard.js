import { Fragment, useEffect, useRef } from "react"
import TopAvatar from '../assets/images/top-avatar.png'
import SidebarAvatar from '../assets/images/avatar-sidebar.png'
import UserOne from '../assets/images/user-1.png'
import UserTwo from '../assets/images/user-2.png'
import UserThree from '../assets/images/user-3.png'
import UserFour from '../assets/images/user-4.png'
import ImageCar from '../assets/images/car.png'
import { Tab, Popover } from "@headlessui/react"
import EmojiPicker, {
    Theme,
    SuggestionMode
} from "emoji-picker-react";
import { useState } from "react"

const { REACT_APP_TITLE, REACT_APP_API_TENOR } = process.env

const Dashboard = () => {
    const [selectedEmoji, setSelectedEmoji] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [categories, setCategories] = useState([]);
    const inputRef = useRef();
    const [showSidebar, setShowSidebar] = useState(false);

    const onClick = (emojiData, event) => {
        console.log(emojiData, event)
        setSelectedEmoji(emojiData.unified)
    }

    const fetchGifs = async (url) => {
        const fetchedGifs = await fetch(url);
        const gifsData = await fetchedGifs.json();
        console.log(gifsData)

        setSearchResults(gifsData.results);
    }

    const fetchCategories = async () => {
        const baseURL = `https://tenor.googleapis.com/v2/categories?&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;
        const fetchedGifs = await fetch(baseURL);
        const gifsData = await fetchedGifs.json();

        setCategories(gifsData.tags);
    }

    const openCategory = async (category) => {
        const url = `https://tenor.googleapis.com/v2/search?q=${category}&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;

        await fetchGifs(url);

        if (!inputRef.current) return;

        setSearchInput(category);
        
        inputRef.current.value = category;
    }

    const sendGif = (url) => console.log(url)

    useEffect(() => {
        if (!searchInput) return setSearchResults(null);

        const url = `https://tenor.googleapis.com/v2/search?q=${searchInput}&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;

        fetchGifs(url);
    }, [searchInput]);

    useEffect(() => {
        if (searchResults) return;

        fetchCategories();
    }, [searchResults]);

    console.log(showSidebar)

    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 grid-flow-col-dense h-screen">
                <div className={`${showSidebar === 'AVAILABLE' ? 'col-span-1 flex flex-col justify-between gap-4 order-first' : showSidebar === 'UNAVAILABLE' ? 'hidden order-last' : 'hidden md:flex flex-col justify-between gap-4'} h-full overflow-scroll`}>
                    <div className="grid grid-rows-12 grid-flow-row-dense gap-4 px-4 lg:px-6">
                        <div className="row-span-2 inline-flex justify-between items-baseline bg-white h-20 z-10 sticky pt-6 top-0 inset-x-5">
                            <p className="font-['Rubik'] font-medium text-3xl tracking-[-0.17px] text-center text-[#7E98DF]">
                                {REACT_APP_TITLE}
                            </p>

                            <Popover.Group className="relative text-[#7E98DF]">
                                <Popover>
                                    <Popover.Button>
                                        <svg className="w-[22px] h-[19px]" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                                            <rect y="7.69995" width="13.2" height="3.3" rx="1.65" fill="#7E98DF" />
                                            <rect y="15.4" width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                                        </svg>
                                    </Popover.Button>
                                    <Popover.Panel className="absolute z-10 top-7 left-[-13.7rem]">
                                        <div className="w-[215px] sm:w-[240px] h-[350px] bg-[#7E98DF] rounded-l-3xl rounded-br-3xl rounded-tr shadow drop-shadow">
                                            <div className="flex flex-col justify-around space-y-5 h-full p-5">
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer" onClick={() => setShowSidebar('UNAVAILABLE')}>
                                                    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16.929 5L18.3432 6.41421L12.6863 12.0711L18.3432 17.7279L16.929 19.1421L9.85789 12.0711L16.929 5Z" fill="white" />
                                                        <path d="M8 19V5H6V19H8Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Close Sidebar
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.9891 7.99223H19.4219C20.8435 7.99223 22 9.14878 22 10.5704V11.4297C22 12.8513 20.8435 14.0079 19.4219 14.0079H18.9891C18.8752 14.0079 18.772 14.0796 18.7262 14.1906L18.7197 14.2063C18.6734 14.3177 18.6955 14.4418 18.7761 14.5223L19.0821 14.8283C19.569 15.3153 19.8372 15.9627 19.8372 16.6513C19.8372 17.34 19.569 17.9874 19.0821 18.4743L18.4744 19.082C17.9874 19.569 17.34 19.8371 16.6514 19.8371C15.9627 19.8371 15.3153 19.569 14.8283 19.082L14.5223 18.776C14.4418 18.6955 14.3177 18.6734 14.2063 18.7196L14.1895 18.7266C14.0795 18.772 14.0078 18.8752 14.0078 18.989V19.4219C14.0078 20.8435 12.8513 22 11.4297 22H10.5703C9.14873 22 7.99219 20.8435 7.99219 19.4219V18.989C7.99219 18.8752 7.92052 18.772 7.80953 18.7262L7.79333 18.7195C7.68234 18.6734 7.55812 18.6954 7.47764 18.776L7.17166 19.082C6.68473 19.569 6.03732 19.8371 5.34862 19.8371C4.66 19.8371 4.01255 19.569 3.52559 19.082L2.91792 18.4743C2.431 17.9874 2.16283 17.34 2.16283 16.6513C2.16283 15.9627 2.431 15.3153 2.91796 14.8283L3.22395 14.5223C3.30447 14.4418 3.3266 14.3177 3.28032 14.2062L3.27267 14.1877C3.22794 14.0795 3.12477 14.0078 3.01091 14.0078H2.57812C1.15655 14.0078 0 12.8512 0 11.4296V10.5703C0 9.14869 1.15655 7.99214 2.57812 7.99214H3.01095C3.12477 7.99214 3.22803 7.92043 3.27383 7.80944L3.27903 7.79689C3.3266 7.68225 3.30451 7.5582 3.22399 7.47764L2.91801 7.17166C1.91275 6.1664 1.91275 4.53084 2.91796 3.52559L3.52563 2.91801C4.01259 2.43104 4.66 2.16287 5.34866 2.16287C6.03732 2.16287 6.68478 2.43104 7.1717 2.91801L7.47772 3.22403C7.5582 3.30455 7.68238 3.32668 7.79371 3.28036L7.81052 3.2734C7.92056 3.22798 7.99223 3.12482 7.99223 3.01099V2.57812C7.99223 1.15655 9.14878 0 10.5704 0H11.4297C12.8513 0 14.0079 1.15655 14.0079 2.57812V3.01099C14.0079 3.12482 14.0795 3.22798 14.1905 3.27383L14.2067 3.28054C14.3177 3.32664 14.4418 3.30455 14.5224 3.22399L14.8284 2.91801C15.3153 2.43104 15.9627 2.16287 16.6514 2.16287C17.34 2.16287 17.9875 2.43104 18.4745 2.91801L19.0821 3.52567C20.0873 4.53088 20.0873 6.16649 19.0821 7.1717L18.7761 7.47772C18.6956 7.55825 18.6734 7.6823 18.7197 7.79376L18.7274 7.81232C18.7721 7.92052 18.8753 7.99223 18.9891 7.99223ZM19.4219 12.2891C19.8957 12.2891 20.2812 11.9035 20.2812 11.4297V10.5703C20.2812 10.0965 19.8957 9.71094 19.4219 9.71094H18.9891C18.1768 9.71094 17.45 9.22213 17.1376 8.46557L17.1311 8.44989C16.8182 7.69661 16.9863 6.83676 17.5606 6.26235L17.8667 5.95629C18.2018 5.62121 18.2018 5.07603 17.8667 4.74096L17.259 4.13329C17.0967 3.971 16.8809 3.88158 16.6513 3.88158C16.4218 3.88158 16.206 3.97096 16.0437 4.13325L15.7376 4.43932C15.1632 5.01364 14.3033 5.18169 13.547 4.86759L13.5354 4.86277C12.7779 4.55005 12.2891 3.82332 12.2891 3.01099V2.57812C12.2891 2.10427 11.9035 1.71875 11.4297 1.71875H10.5703C10.0965 1.71875 9.71094 2.10427 9.71094 2.57812V3.01099C9.71094 3.82332 9.22208 4.55005 8.46553 4.86243L8.45341 4.86746C7.69678 5.18182 6.83684 5.01372 6.26239 4.4394L5.95633 4.13334C5.79403 3.971 5.57825 3.88162 5.34866 3.88162C5.11912 3.88162 4.90334 3.97104 4.74096 4.13334L4.13334 4.741C3.79822 5.07607 3.79822 5.62126 4.13334 5.95637L4.43932 6.26235C5.01368 6.83676 5.18177 7.69665 4.86759 8.45307L4.86359 8.46282C4.55 9.22213 3.82327 9.71094 3.01095 9.71094H2.57812C2.10427 9.71094 1.71875 10.0965 1.71875 10.5703V11.4297C1.71875 11.9035 2.10427 12.2891 2.57812 12.2891H3.01095C3.82323 12.2891 4.54996 12.7779 4.86243 13.5344L4.86802 13.5479C5.18164 14.3041 5.01346 15.1635 4.43936 15.7376L4.13334 16.0437C3.971 16.206 3.88162 16.4218 3.88162 16.6513C3.88162 16.8809 3.971 17.0967 4.13334 17.259L4.741 17.8667C4.90329 18.029 5.11912 18.1184 5.34866 18.1184C5.57825 18.1184 5.79399 18.029 5.95633 17.8667L6.26235 17.5606C6.64456 17.1785 7.15331 16.9761 7.6737 16.9761C7.93538 16.9761 8.19994 17.0272 8.45303 17.1324L8.46463 17.1372C9.22208 17.45 9.71094 18.1767 9.71094 18.989V19.4219C9.71094 19.8957 10.0965 20.2812 10.5703 20.2812H11.4297C11.9035 20.2812 12.2891 19.8957 12.2891 19.4219V18.989C12.2891 18.1767 12.7779 17.45 13.5345 17.1376L13.5466 17.1325C14.3033 16.8183 15.1632 16.9863 15.7376 17.5606L16.0437 17.8667C16.206 18.029 16.4218 18.1184 16.6513 18.1184C16.8809 18.1184 17.0967 18.029 17.259 17.8667L17.8667 17.259C18.029 17.0967 18.1184 16.8809 18.1184 16.6513C18.1184 16.4218 18.029 16.206 17.8667 16.0437L17.5606 15.7376C16.9866 15.1635 16.8184 14.3041 17.132 13.5479L17.1376 13.5344C17.45 12.7779 18.1767 12.2891 18.9891 12.2891H19.4219ZM13.9867 11.0001C13.9867 12.6495 12.6495 13.9867 11 13.9867C9.35051 13.9867 8.01333 12.6495 8.01333 11.0001C8.01333 9.35056 9.35051 8.01339 11 8.01339C12.6495 8.01339 13.9867 9.35056 13.9867 11.0001ZM15.9867 11.0001C15.9867 13.7541 13.7541 15.9867 11 15.9867C8.24594 15.9867 6.01333 13.7541 6.01333 11.0001C6.01333 8.24599 8.24594 6.01339 11 6.01339C13.7541 6.01339 15.9867 8.24599 15.9867 11.0001Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Settings
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M14.8511 6.08511C14.8511 8.34125 13.0221 10.1702 10.766 10.1702C8.50982 10.1702 6.68085 8.34125 6.68085 6.08511C6.68085 3.82896 8.50982 2 10.766 2C13.0221 2 14.8511 3.82896 14.8511 6.08511ZM13.4184 11.5632C15.4502 10.5776 16.8511 8.49497 16.8511 6.08511C16.8511 2.7244 14.1267 0 10.766 0C7.40525 0 4.68085 2.7244 4.68085 6.08511C4.68085 8.49497 6.08171 10.5776 8.11352 11.5632C4.08379 12.5842 0.95984 15.8777 0.185422 20C0.0636773 20.6481 0 21.3166 0 22H2H19.5319H21.5319C21.5319 21.3166 21.4682 20.6481 21.3465 20C20.5721 15.8777 17.4481 12.5842 13.4184 11.5632ZM2.22919 20C3.13408 16.1224 6.61271 13.234 10.766 13.234C14.9192 13.234 18.3978 16.1224 19.3027 20H2.22919Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Contacts
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-3 items-center cursor-pointer">
                                                    <svg className="w-[27px] h-[12px]" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.4822 11.2383L6.34996 11.2383C7.41627 11.2383 8.28384 10.3707 8.28384 9.30444L8.28384 7.54638C8.28384 6.73855 8.94122 6.08141 9.74863 6.08129L17.3721 6.08454C18.1818 6.08454 18.8371 6.73976 18.8371 7.5496C18.8371 7.83278 18.8371 8.6459 18.8371 9.30765C18.8371 10.3693 19.6946 11.2416 20.772 11.2415L24.6327 11.2354C25.699 11.2354 26.5665 10.3679 26.5665 9.30437C26.57 8.51203 26.5711 8.25644 26.5726 7.90117C26.5727 4.05586 23.4443 0.927484 19.5991 0.927484L7.52203 0.924326C3.66767 0.924297 0.548349 4.04332 0.548377 7.89798L0.548349 9.30447C0.548347 10.3708 1.41586 11.2383 2.4822 11.2383ZM25.2773 9.30158C25.2773 9.657 24.9882 9.94616 24.6317 9.94622L20.771 9.9523C20.4147 9.9523 20.1264 9.66399 20.1264 9.30768L20.1264 8.66304L25.2801 8.66304L25.2773 9.30158ZM7.52182 2.21359L19.599 2.21678C22.574 2.21678 24.9915 4.47075 25.2589 7.37377L20.1202 7.37377C20.03 5.93332 18.8356 4.79525 17.3723 4.79525L9.74918 4.79206C9.74912 4.79206 9.749 4.79206 9.74893 4.79206C8.28715 4.79203 7.09104 5.92822 7.0008 7.37053H1.86198C2.12659 4.47482 4.52631 2.21359 7.52182 2.21359ZM1.83755 9.3045V8.65982L6.99458 8.65985L6.99461 9.30444C6.99458 9.65989 6.70545 9.94908 6.34996 9.94908H2.4822C2.12671 9.94908 1.83752 9.65989 1.83755 9.3045Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Calls
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-5 items-center cursor-pointer">
                                                    <svg className="w-[17px] h-[20px]" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 2.11206C1 1.55978 1.44771 1.11206 2 1.11206H14.2963C14.8486 1.11206 15.2963 1.55978 15.2963 2.11206V17.9788C15.2963 18.8148 14.3313 19.2818 13.6757 18.7629L10.0098 15.8618C8.91886 14.9985 7.37743 14.9985 6.28646 15.8618L2.62056 18.7629C1.96497 19.2818 1 18.8148 1 17.9788V2.11206Z" stroke="white" strokeWidth="2" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Save messages
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-3 items-center cursor-pointer">
                                                    <svg className="w-[27px] h-[23px]" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M24.2124 6.19717C24.2124 8.45331 22.3834 10.2823 20.1273 10.2823C17.8711 10.2823 16.0422 8.45331 16.0422 6.19717C16.0422 3.94103 17.8711 2.11206 20.1273 2.11206C22.3834 2.11206 24.2124 3.94103 24.2124 6.19717ZM22.7797 11.6753C24.8115 10.6897 26.2124 8.60703 26.2124 6.19717C26.2124 2.83646 23.488 0.112061 20.1273 0.112061C16.7666 0.112061 14.0422 2.83646 14.0422 6.19717C14.0422 8.60703 15.443 10.6897 17.4748 11.6753C13.4451 12.6963 10.3212 15.9898 9.54675 20.1121C9.42501 20.7601 9.36133 21.4287 9.36133 22.1121H11.3613H28.8932H30.8932C30.8932 21.4287 30.8296 20.7601 30.7078 20.1121C29.9334 15.9898 26.8095 12.6963 22.7797 11.6753ZM11.5905 20.1121C12.4954 16.2345 15.974 13.3461 20.1273 13.3461C24.2805 13.3461 27.7592 16.2345 28.6641 20.1121H11.5905Z" fill="white" />
                                                        <rect x="3.74512" y="6.66522" width="1.87234" height="9.3617" rx="0.93617" fill="white" />
                                                        <rect y="12.2823" width="1.87234" height="9.3617" rx="0.93617" transform="rotate(-90 0 12.2823)" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Invite Friends
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[22px] h-[23px]" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="11" cy="11.1121" r="10" stroke="white" strokeWidth="2" />
                                                        <path d="M12.08 14.1121H10.24C10.24 13.6854 10.336 13.2854 10.528 12.9121C10.72 12.5281 10.9547 12.2027 11.232 11.9361C11.5094 11.6587 11.7867 11.3974 12.064 11.1521C12.3414 10.8961 12.576 10.6187 12.768 10.3201C12.96 10.0214 13.056 9.71741 13.056 9.40808C13.056 8.97075 12.9014 8.62941 12.592 8.38408C12.2827 8.13875 11.8667 8.01608 11.344 8.01608C10.8427 8.01608 10.4107 8.14408 10.048 8.40008C9.68537 8.65608 9.42404 9.01875 9.26404 9.48808L7.68004 8.59208C7.96804 7.84541 8.44271 7.26408 9.10404 6.84808C9.77604 6.43208 10.5387 6.22408 11.392 6.22408C12.352 6.22408 13.1734 6.49608 13.856 7.04008C14.5494 7.58408 14.896 8.33608 14.896 9.29608C14.896 9.73341 14.8 10.1494 14.608 10.5441C14.416 10.9387 14.1814 11.2747 13.904 11.5521C13.6267 11.8294 13.3494 12.1014 13.072 12.3681C12.7947 12.6241 12.56 12.9014 12.368 13.2001C12.176 13.4987 12.08 13.8027 12.08 14.1121ZM11.168 15.4241C11.4987 15.4241 11.7814 15.5414 12.016 15.7761C12.2507 16.0107 12.368 16.2934 12.368 16.6241C12.368 16.9547 12.2507 17.2374 12.016 17.4721C11.7814 17.7067 11.4987 17.8241 11.168 17.8241C10.8374 17.8241 10.5547 17.7067 10.32 17.4721C10.0854 17.2374 9.96804 16.9547 9.96804 16.6241C9.96804 16.2934 10.08 16.0107 10.304 15.7761C10.5387 15.5414 10.8267 15.4241 11.168 15.4241Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Telegram FAQ
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </Popover.Group>
                        </div>

                        <div className="row-span-10 flex flex-col items-center space-y-5">
                            <div className="rounded-[20px]">
                                <img src={SidebarAvatar} alt="User Avatar" className="w-[82px] h-[82px] bg-local bg-center bg-cover" />
                            </div>
                            <div className="flex flex-col space-y-1 justify-center items-center">
                                <div className="font-['Rubik'] font-medium text-xl tracking-[-0.17px]">
                                    Gloria Mckinney
                                </div>
                                <div className="font-['Rubik'] font-normal text-base tracking-[1.34px] text-[#848484]">
                                    @wdlam
                                </div>
                            </div>
                            <div className="inline-flex justify-between items-center w-full">
                                <div className="flex flex-1 flex-col w-full space-y-2 animate__animated animate__fadeInUp animate__delay-2s animate__fast">
                                    <div className="flex absolute inset-y-5 left-3 bottom-2 items-center cursor-pointer">
                                        <svg className="w-[24px] h-[23px]" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="9.5" cy="9.5" r="8" stroke="#848484" strokeWidth="3" />
                                            <rect x="14" y="16.1213" width="3" height="8.74773" rx="1.5" transform="rotate(-45 14 16.1213)" fill="#848484" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="search-chat"
                                        className={`font-['Rubik'] w-[92.5%] text-base font-medium placeholder:font-normal h-[60px] bg-[#FAFAFA] text-[#232323] placeholder:text-[#848484] focus-visible:outline-0 [padding-inline-start:2.8rem] [padding-inline-end:1rem] rounded-2xl placeholder:tracking-normal placeholder:[-webkit-text-stroke-width:0em]`}
                                        placeholder="Type your message..."
                                    />
                                </div>

                                <button type="button" className="text-[#7E98DF]">
                                    <svg className="w-[23px] h-[23px]" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="10" width="3" height="23" rx="1.5" fill="#7E98DF" />
                                        <rect x="23" y="10" width="3" height="23" rx="1.5" transform="rotate(90 23 10)" fill="#7E98DF" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 p-4">
                        <Tab.Group as={Fragment}>
                            <Tab.List className="font-['Rubik'] font-medium text-lg leading-5 tracking-[-0.17px] h-[50px] text-center inline-flex w-full space-x-2">
                                <Tab className="ui-selected:bg-[#7E98DF] w-full focus-visible:outline-0 ui-selected:text-white ui-selected:rounded-[20px] ui-not-selected:bg-inherit ui-not-selected:text-[#232323] p-1">
                                    All
                                </Tab>
                                <Tab className="ui-selected:bg-[#7E98DF] w-full focus-visible:outline-0 ui-selected:text-white ui-selected:rounded-[20px] ui-not-selected:bg-inherit ui-not-selected:text-[#232323] p-1">
                                    Important
                                </Tab>
                                <Tab className="ui-selected:bg-[#7E98DF] w-full focus-visible:outline-0 ui-selected:text-white ui-selected:rounded-[20px] ui-not-selected:bg-inherit ui-not-selected:text-[#232323] p-1">
                                    Unread
                                </Tab>
                            </Tab.List>
                            <Tab.Panels className="pt-5 font-['Rubik']">
                                <Tab.Panel className="w-full flex flex-col space-y-4 pr-1 mx-2">
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserThree} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Gregory Bell
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Will you stop ignoring me?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                164
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserOne} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Theresa Webb
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Why did you do that?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserTwo} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Calvin Flores
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Hi, bro! Come to my house!
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Mother ❤
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Me: Yes, of course come, ... 
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                7:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                0
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserOne} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Theresa Webb
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Why did you do that?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserTwo} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Calvin Flores
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Hi, bro! Come to my house!
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="w-full flex flex-col space-y-4 pr-1 mx-2">
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserOne} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Theresa Webb
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Why did you do that?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserTwo} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Calvin Flores
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Hi, bro! Come to my house!
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserThree} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Gregory Bell
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Will you stop ignoring me?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                164
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Mother ❤
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Me: Yes, of course come, ... 
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                7:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                0
                                            </span>
                                        </div>
                                    </div>
                                </Tab.Panel>
                                <Tab.Panel className="w-full flex flex-col space-y-4 pr-1 mx-2">
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserThree} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Gregory Bell
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Will you stop ignoring me?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                164
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Mother ❤
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Me: Yes, of course come, ...
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                7:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                0
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserOne} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Theresa Webb
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Why did you do that?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserThree} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Gregory Bell
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Will you stop ignoring me?
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                164
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Mother ❤
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Me: Yes, of course come, ...
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                7:20
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                0
                                            </span>
                                        </div>
                                    </div>
                                    <div className="inline-flex justify-between cursor-pointer transition ease-in-out hover:drop-shadow-md active:scale-95">
                                        <div className="inline-flex space-between space-x-3">
                                            <div className="rounded-[20px]">
                                                <img src={UserTwo} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                            </div>

                                            <div className="flex flex-col justify-evenly font-['Rubik']">
                                                <span className="font-medium text-base text-[#232323] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Calvin Flores
                                                </span>
                                                <span className="font-normal text-sm text-[#7E98DF] tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-auto">
                                                    Hi, bro! Come to my house!
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-evenly items-center font-['Rubik']">
                                            <span className="font-normal text-sm text-[#848484] tracking-[-0.17px]">
                                                15:13
                                            </span>
                                            <span className="font-normal px-3 py-1 text-sm bg-[#7E98DF] text-white text-center tracking-[-0.17px] rounded-full">
                                                1
                                            </span>
                                        </div>
                                    </div>
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>

                <div className={`${showSidebar === 'AVAILABLE' ? 'hidden md:block md:col-span-2 lg:col-span-3 order-last' : showSidebar === 'UNAVAILABLE' ? 'col-span-1 md:col-span-3 lg:col-span-4 order-first md:order-last' : 'md:col-span-2 lg:col-span-3 order-first md:order-last'}`}>
                    <div className="grid grid-rows-[85px_minmax(415px,_1fr)_50px] grid-flow-row h-screen">
                        <div className="row-span-1 w-full drop-shadow-sm shadow-sm p-5 inline-flex space-x-5 md:space-x-4 items-center">
                            <Popover.Group className="relative text-[#7E98DF]">
                                <Popover>
                                    <Popover.Button className={`text-[#7E98DF] w-[22px] h-[18.7px] ${showSidebar === 'AVAILABLE' ? 'hidden' : showSidebar === 'UNAVAILABLE' ? 'block' : 'block md:hidden'}`}>
                                        <svg className="w-[22px] h-[19px]" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                                            <rect y="7.69995" width="13.2" height="3.3" rx="1.65" fill="#7E98DF" />
                                            <rect y="15.4" width="22" height="3.3" rx="1.65" fill="#7E98DF" />
                                        </svg>
                                    </Popover.Button>
                                    <Popover.Panel unmount={true} className="absolute z-10 top-12 inset-x-0 left-[0.5rem]">
                                        {({ close }) => (
                                            <div className="w-[215px] sm:w-[240px] h-[350px] bg-[#7E98DF] rounded-r-3xl rounded-bl-3xl rounded-lr shadow drop-shadow">
                                                <div className="flex flex-col justify-around space-y-5 h-full p-5">
                                                    <div className="inline-flex flex-1 space-x-3 items-center cursor-pointer" onClick={() => {
                                                        setShowSidebar((showSidebar === 'UNAVAILABLE' || !showSidebar) ? 'AVAILABLE' : showSidebar === 'AVAILABLE' ? 'UNAVAILABLE' : false)
                                                        close()
                                                    }}>
                                                        <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M7.41421 5L6 6.41421L11.6569 12.0711L6 17.7279L7.41421 19.1421L14.4853 12.0711L7.41421 5Z" fill="white" />
                                                            <path d="M16.3432 19V5H18.3432V19H16.3432Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Open Sidebar
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M18.9891 7.99223H19.4219C20.8435 7.99223 22 9.14878 22 10.5704V11.4297C22 12.8513 20.8435 14.0079 19.4219 14.0079H18.9891C18.8752 14.0079 18.772 14.0796 18.7262 14.1906L18.7197 14.2063C18.6734 14.3177 18.6955 14.4418 18.7761 14.5223L19.0821 14.8283C19.569 15.3153 19.8372 15.9627 19.8372 16.6513C19.8372 17.34 19.569 17.9874 19.0821 18.4743L18.4744 19.082C17.9874 19.569 17.34 19.8371 16.6514 19.8371C15.9627 19.8371 15.3153 19.569 14.8283 19.082L14.5223 18.776C14.4418 18.6955 14.3177 18.6734 14.2063 18.7196L14.1895 18.7266C14.0795 18.772 14.0078 18.8752 14.0078 18.989V19.4219C14.0078 20.8435 12.8513 22 11.4297 22H10.5703C9.14873 22 7.99219 20.8435 7.99219 19.4219V18.989C7.99219 18.8752 7.92052 18.772 7.80953 18.7262L7.79333 18.7195C7.68234 18.6734 7.55812 18.6954 7.47764 18.776L7.17166 19.082C6.68473 19.569 6.03732 19.8371 5.34862 19.8371C4.66 19.8371 4.01255 19.569 3.52559 19.082L2.91792 18.4743C2.431 17.9874 2.16283 17.34 2.16283 16.6513C2.16283 15.9627 2.431 15.3153 2.91796 14.8283L3.22395 14.5223C3.30447 14.4418 3.3266 14.3177 3.28032 14.2062L3.27267 14.1877C3.22794 14.0795 3.12477 14.0078 3.01091 14.0078H2.57812C1.15655 14.0078 0 12.8512 0 11.4296V10.5703C0 9.14869 1.15655 7.99214 2.57812 7.99214H3.01095C3.12477 7.99214 3.22803 7.92043 3.27383 7.80944L3.27903 7.79689C3.3266 7.68225 3.30451 7.5582 3.22399 7.47764L2.91801 7.17166C1.91275 6.1664 1.91275 4.53084 2.91796 3.52559L3.52563 2.91801C4.01259 2.43104 4.66 2.16287 5.34866 2.16287C6.03732 2.16287 6.68478 2.43104 7.1717 2.91801L7.47772 3.22403C7.5582 3.30455 7.68238 3.32668 7.79371 3.28036L7.81052 3.2734C7.92056 3.22798 7.99223 3.12482 7.99223 3.01099V2.57812C7.99223 1.15655 9.14878 0 10.5704 0H11.4297C12.8513 0 14.0079 1.15655 14.0079 2.57812V3.01099C14.0079 3.12482 14.0795 3.22798 14.1905 3.27383L14.2067 3.28054C14.3177 3.32664 14.4418 3.30455 14.5224 3.22399L14.8284 2.91801C15.3153 2.43104 15.9627 2.16287 16.6514 2.16287C17.34 2.16287 17.9875 2.43104 18.4745 2.91801L19.0821 3.52567C20.0873 4.53088 20.0873 6.16649 19.0821 7.1717L18.7761 7.47772C18.6956 7.55825 18.6734 7.6823 18.7197 7.79376L18.7274 7.81232C18.7721 7.92052 18.8753 7.99223 18.9891 7.99223ZM19.4219 12.2891C19.8957 12.2891 20.2812 11.9035 20.2812 11.4297V10.5703C20.2812 10.0965 19.8957 9.71094 19.4219 9.71094H18.9891C18.1768 9.71094 17.45 9.22213 17.1376 8.46557L17.1311 8.44989C16.8182 7.69661 16.9863 6.83676 17.5606 6.26235L17.8667 5.95629C18.2018 5.62121 18.2018 5.07603 17.8667 4.74096L17.259 4.13329C17.0967 3.971 16.8809 3.88158 16.6513 3.88158C16.4218 3.88158 16.206 3.97096 16.0437 4.13325L15.7376 4.43932C15.1632 5.01364 14.3033 5.18169 13.547 4.86759L13.5354 4.86277C12.7779 4.55005 12.2891 3.82332 12.2891 3.01099V2.57812C12.2891 2.10427 11.9035 1.71875 11.4297 1.71875H10.5703C10.0965 1.71875 9.71094 2.10427 9.71094 2.57812V3.01099C9.71094 3.82332 9.22208 4.55005 8.46553 4.86243L8.45341 4.86746C7.69678 5.18182 6.83684 5.01372 6.26239 4.4394L5.95633 4.13334C5.79403 3.971 5.57825 3.88162 5.34866 3.88162C5.11912 3.88162 4.90334 3.97104 4.74096 4.13334L4.13334 4.741C3.79822 5.07607 3.79822 5.62126 4.13334 5.95637L4.43932 6.26235C5.01368 6.83676 5.18177 7.69665 4.86759 8.45307L4.86359 8.46282C4.55 9.22213 3.82327 9.71094 3.01095 9.71094H2.57812C2.10427 9.71094 1.71875 10.0965 1.71875 10.5703V11.4297C1.71875 11.9035 2.10427 12.2891 2.57812 12.2891H3.01095C3.82323 12.2891 4.54996 12.7779 4.86243 13.5344L4.86802 13.5479C5.18164 14.3041 5.01346 15.1635 4.43936 15.7376L4.13334 16.0437C3.971 16.206 3.88162 16.4218 3.88162 16.6513C3.88162 16.8809 3.971 17.0967 4.13334 17.259L4.741 17.8667C4.90329 18.029 5.11912 18.1184 5.34866 18.1184C5.57825 18.1184 5.79399 18.029 5.95633 17.8667L6.26235 17.5606C6.64456 17.1785 7.15331 16.9761 7.6737 16.9761C7.93538 16.9761 8.19994 17.0272 8.45303 17.1324L8.46463 17.1372C9.22208 17.45 9.71094 18.1767 9.71094 18.989V19.4219C9.71094 19.8957 10.0965 20.2812 10.5703 20.2812H11.4297C11.9035 20.2812 12.2891 19.8957 12.2891 19.4219V18.989C12.2891 18.1767 12.7779 17.45 13.5345 17.1376L13.5466 17.1325C14.3033 16.8183 15.1632 16.9863 15.7376 17.5606L16.0437 17.8667C16.206 18.029 16.4218 18.1184 16.6513 18.1184C16.8809 18.1184 17.0967 18.029 17.259 17.8667L17.8667 17.259C18.029 17.0967 18.1184 16.8809 18.1184 16.6513C18.1184 16.4218 18.029 16.206 17.8667 16.0437L17.5606 15.7376C16.9866 15.1635 16.8184 14.3041 17.132 13.5479L17.1376 13.5344C17.45 12.7779 18.1767 12.2891 18.9891 12.2891H19.4219ZM13.9867 11.0001C13.9867 12.6495 12.6495 13.9867 11 13.9867C9.35051 13.9867 8.01333 12.6495 8.01333 11.0001C8.01333 9.35056 9.35051 8.01339 11 8.01339C12.6495 8.01339 13.9867 9.35056 13.9867 11.0001ZM15.9867 11.0001C15.9867 13.7541 13.7541 15.9867 11 15.9867C8.24594 15.9867 6.01333 13.7541 6.01333 11.0001C6.01333 8.24599 8.24594 6.01339 11 6.01339C13.7541 6.01339 15.9867 8.24599 15.9867 11.0001Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Settings
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.8511 6.08511C14.8511 8.34125 13.0221 10.1702 10.766 10.1702C8.50982 10.1702 6.68085 8.34125 6.68085 6.08511C6.68085 3.82896 8.50982 2 10.766 2C13.0221 2 14.8511 3.82896 14.8511 6.08511ZM13.4184 11.5632C15.4502 10.5776 16.8511 8.49497 16.8511 6.08511C16.8511 2.7244 14.1267 0 10.766 0C7.40525 0 4.68085 2.7244 4.68085 6.08511C4.68085 8.49497 6.08171 10.5776 8.11352 11.5632C4.08379 12.5842 0.95984 15.8777 0.185422 20C0.0636773 20.6481 0 21.3166 0 22H2H19.5319H21.5319C21.5319 21.3166 21.4682 20.6481 21.3465 20C20.5721 15.8777 17.4481 12.5842 13.4184 11.5632ZM2.22919 20C3.13408 16.1224 6.61271 13.234 10.766 13.234C14.9192 13.234 18.3978 16.1224 19.3027 20H2.22919Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Contacts
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-3 items-center cursor-pointer">
                                                        <svg className="w-[27px] h-[12px]" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M2.4822 11.2383L6.34996 11.2383C7.41627 11.2383 8.28384 10.3707 8.28384 9.30444L8.28384 7.54638C8.28384 6.73855 8.94122 6.08141 9.74863 6.08129L17.3721 6.08454C18.1818 6.08454 18.8371 6.73976 18.8371 7.5496C18.8371 7.83278 18.8371 8.6459 18.8371 9.30765C18.8371 10.3693 19.6946 11.2416 20.772 11.2415L24.6327 11.2354C25.699 11.2354 26.5665 10.3679 26.5665 9.30437C26.57 8.51203 26.5711 8.25644 26.5726 7.90117C26.5727 4.05586 23.4443 0.927484 19.5991 0.927484L7.52203 0.924326C3.66767 0.924297 0.548349 4.04332 0.548377 7.89798L0.548349 9.30447C0.548347 10.3708 1.41586 11.2383 2.4822 11.2383ZM25.2773 9.30158C25.2773 9.657 24.9882 9.94616 24.6317 9.94622L20.771 9.9523C20.4147 9.9523 20.1264 9.66399 20.1264 9.30768L20.1264 8.66304L25.2801 8.66304L25.2773 9.30158ZM7.52182 2.21359L19.599 2.21678C22.574 2.21678 24.9915 4.47075 25.2589 7.37377L20.1202 7.37377C20.03 5.93332 18.8356 4.79525 17.3723 4.79525L9.74918 4.79206C9.74912 4.79206 9.749 4.79206 9.74893 4.79206C8.28715 4.79203 7.09104 5.92822 7.0008 7.37053H1.86198C2.12659 4.47482 4.52631 2.21359 7.52182 2.21359ZM1.83755 9.3045V8.65982L6.99458 8.65985L6.99461 9.30444C6.99458 9.65989 6.70545 9.94908 6.34996 9.94908H2.4822C2.12671 9.94908 1.83752 9.65989 1.83755 9.3045Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Calls
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-5 items-center cursor-pointer">
                                                        <svg className="w-[17px] h-[20px]" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1 2.11206C1 1.55978 1.44771 1.11206 2 1.11206H14.2963C14.8486 1.11206 15.2963 1.55978 15.2963 2.11206V17.9788C15.2963 18.8148 14.3313 19.2818 13.6757 18.7629L10.0098 15.8618C8.91886 14.9985 7.37743 14.9985 6.28646 15.8618L2.62056 18.7629C1.96497 19.2818 1 18.8148 1 17.9788V2.11206Z" stroke="white" strokeWidth="2" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Save messages
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-3 items-center cursor-pointer">
                                                        <svg className="w-[27px] h-[23px]" viewBox="0 0 31 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M24.2124 6.19717C24.2124 8.45331 22.3834 10.2823 20.1273 10.2823C17.8711 10.2823 16.0422 8.45331 16.0422 6.19717C16.0422 3.94103 17.8711 2.11206 20.1273 2.11206C22.3834 2.11206 24.2124 3.94103 24.2124 6.19717ZM22.7797 11.6753C24.8115 10.6897 26.2124 8.60703 26.2124 6.19717C26.2124 2.83646 23.488 0.112061 20.1273 0.112061C16.7666 0.112061 14.0422 2.83646 14.0422 6.19717C14.0422 8.60703 15.443 10.6897 17.4748 11.6753C13.4451 12.6963 10.3212 15.9898 9.54675 20.1121C9.42501 20.7601 9.36133 21.4287 9.36133 22.1121H11.3613H28.8932H30.8932C30.8932 21.4287 30.8296 20.7601 30.7078 20.1121C29.9334 15.9898 26.8095 12.6963 22.7797 11.6753ZM11.5905 20.1121C12.4954 16.2345 15.974 13.3461 20.1273 13.3461C24.2805 13.3461 27.7592 16.2345 28.6641 20.1121H11.5905Z" fill="white" />
                                                            <rect x="3.74512" y="6.66522" width="1.87234" height="9.3617" rx="0.93617" fill="white" />
                                                            <rect y="12.2823" width="1.87234" height="9.3617" rx="0.93617" transform="rotate(-90 0 12.2823)" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Invite Friends
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[23px]" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="11" cy="11.1121" r="10" stroke="white" strokeWidth="2" />
                                                            <path d="M12.08 14.1121H10.24C10.24 13.6854 10.336 13.2854 10.528 12.9121C10.72 12.5281 10.9547 12.2027 11.232 11.9361C11.5094 11.6587 11.7867 11.3974 12.064 11.1521C12.3414 10.8961 12.576 10.6187 12.768 10.3201C12.96 10.0214 13.056 9.71741 13.056 9.40808C13.056 8.97075 12.9014 8.62941 12.592 8.38408C12.2827 8.13875 11.8667 8.01608 11.344 8.01608C10.8427 8.01608 10.4107 8.14408 10.048 8.40008C9.68537 8.65608 9.42404 9.01875 9.26404 9.48808L7.68004 8.59208C7.96804 7.84541 8.44271 7.26408 9.10404 6.84808C9.77604 6.43208 10.5387 6.22408 11.392 6.22408C12.352 6.22408 13.1734 6.49608 13.856 7.04008C14.5494 7.58408 14.896 8.33608 14.896 9.29608C14.896 9.73341 14.8 10.1494 14.608 10.5441C14.416 10.9387 14.1814 11.2747 13.904 11.5521C13.6267 11.8294 13.3494 12.1014 13.072 12.3681C12.7947 12.6241 12.56 12.9014 12.368 13.2001C12.176 13.4987 12.08 13.8027 12.08 14.1121ZM11.168 15.4241C11.4987 15.4241 11.7814 15.5414 12.016 15.7761C12.2507 16.0107 12.368 16.2934 12.368 16.6241C12.368 16.9547 12.2507 17.2374 12.016 17.4721C11.7814 17.7067 11.4987 17.8241 11.168 17.8241C10.8374 17.8241 10.5547 17.7067 10.32 17.4721C10.0854 17.2374 9.96804 16.9547 9.96804 16.6241C9.96804 16.2934 10.08 16.0107 10.304 15.7761C10.5387 15.5414 10.8267 15.4241 11.168 15.4241Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Telegram FAQ
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popover.Panel>
                                </Popover>
                            </Popover.Group>

                            <div className="grid md:grid-cols-10 grid-cols-4 grid-flow-col-dense sm:grid-cols-9 space-x-4 md:space-x-8 lg:space-x-4">
                                <div className="md:w-[64px] col-auto w-[55px] h-[64px] rounded-[20px]">
                                    <img src={TopAvatar} alt="User Avatar" className="bg-local bg-center bg-cover" />
                                </div>

                                <div className="md:col-span-9 col-span-3 sm:col-span-8 grid grid-rows-2 font-['Rubik']">
                                    <div className="text-[#232323] col-span-1 font-medium text-lg tracking-[-0.17px] line-clamp-1 whitespace-pre-wrap break-all w-[79%] md:w-[80%] lg:w-[90%]">
                                        Mother
                                    </div>
                                    <div className="text-[#7E98DF] col-span-1 font-normal text-base tracking-[-0.17px]">
                                        Online
                                    </div>
                                </div>
                            </div>

                            <Popover.Group className="inline-flex space-x-4 absolute inset-y-5 right-9 top-5 items-center text-[#7E98DF]">
                                <Popover>
                                    <Popover.Button>
                                        <svg className="w-[20px] h-[19px]" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="5" height="5" rx="2.5" fill="#7E98DF" />
                                            <rect x="15" width="5" height="5" rx="2.5" fill="#7E98DF" />
                                            <rect y="14" width="5" height="5" rx="2.5" fill="#7E98DF" />
                                            <rect x="15" y="14" width="5" height="5" rx="2.5" fill="#7E98DF" />
                                        </svg>
                                    </Popover.Button>
                                    <Popover.Panel className="absolute z-10 top-9 right-[0.05rem]">
                                        <div className="w-[215px] sm:w-[250px] h-[250px] bg-[#7E98DF] rounded-l-3xl rounded-br-3xl rounded-tr shadow drop-shadow">
                                            <div className="flex flex-col justify-around space-y-5 h-full p-5">
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[27px] h-[12px]" viewBox="0 0 27 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.4822 11.2383L6.34996 11.2383C7.41627 11.2383 8.28384 10.3707 8.28384 9.30444L8.28384 7.54638C8.28384 6.73855 8.94122 6.08141 9.74863 6.08129L17.3721 6.08454C18.1818 6.08454 18.8371 6.73976 18.8371 7.5496C18.8371 7.83278 18.8371 8.6459 18.8371 9.30765C18.8371 10.3693 19.6946 11.2416 20.772 11.2415L24.6327 11.2354C25.699 11.2354 26.5665 10.3679 26.5665 9.30437C26.57 8.51203 26.5711 8.25644 26.5726 7.90117C26.5727 4.05586 23.4443 0.927484 19.5991 0.927484L7.52203 0.924326C3.66767 0.924297 0.548349 4.04332 0.548377 7.89798L0.548349 9.30447C0.548347 10.3708 1.41586 11.2383 2.4822 11.2383ZM25.2773 9.30158C25.2773 9.657 24.9882 9.94616 24.6317 9.94622L20.771 9.9523C20.4147 9.9523 20.1264 9.66399 20.1264 9.30768L20.1264 8.66304L25.2801 8.66304L25.2773 9.30158ZM7.52182 2.21359L19.599 2.21678C22.574 2.21678 24.9915 4.47075 25.2589 7.37377L20.1202 7.37377C20.03 5.93332 18.8356 4.79525 17.3723 4.79525L9.74918 4.79206C9.74912 4.79206 9.749 4.79206 9.74893 4.79206C8.28715 4.79203 7.09104 5.92822 7.0008 7.37053H1.86198C2.12659 4.47482 4.52631 2.21359 7.52182 2.21359ZM1.83755 9.3045V8.65982L6.99458 8.65985L6.99461 9.30444C6.99458 9.65989 6.70545 9.94908 6.34996 9.94908H2.4822C2.12671 9.94908 1.83752 9.65989 1.83755 9.3045Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Call
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[19px] h-[23px]" viewBox="0 0 19 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M7.92537 1.75627C7.98594 1.08343 8.5514 0.556152 9.24 0.556152C9.92861 0.556152 10.4941 1.08343 10.5546 1.75627H16.12C17.5559 1.75627 18.72 2.92033 18.72 4.35627C18.72 5.65638 17.7658 6.73361 16.5194 6.92578L15.7661 19.7324C15.6728 21.3181 14.3597 22.5562 12.7713 22.5562H5.94872C4.36029 22.5562 3.04718 21.3181 2.9539 19.7324L2.20057 6.92578C0.954257 6.73362 0 5.65638 0 4.35627C0 2.92033 1.16406 1.75627 2.6 1.75627H7.92537ZM16.12 3.75627H2.6C2.26863 3.75627 2 4.0249 2 4.35627C2 4.57852 2.12084 4.77254 2.3004 4.87623H4.08347H14.6366H16.4196C16.5992 4.77254 16.72 4.57852 16.72 4.35627C16.72 4.0249 16.4514 3.75627 16.12 3.75627ZM4.95045 19.615L4.20582 6.95627H14.5142L13.7696 19.615C13.7385 20.1435 13.3008 20.5562 12.7713 20.5562H5.94872C5.41925 20.5562 4.98154 20.1435 4.95045 19.615ZM6.24003 10.076C6.24003 9.50166 6.70565 9.03604 7.28003 9.03604C7.85441 9.03604 8.32003 9.50166 8.32003 10.076V17.356C8.32003 17.9304 7.85441 18.396 7.28003 18.396C6.70565 18.396 6.24003 17.9304 6.24003 17.356V10.076ZM11.44 9.03604C10.8657 9.03604 10.4 9.50166 10.4 10.076V17.356C10.4 17.9304 10.8657 18.396 11.44 18.396C12.0144 18.396 12.48 17.9304 12.48 17.356V10.076C12.48 9.50166 12.0144 9.03604 11.44 9.03604Z" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Delete chat history
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                    <svg className="w-[22px] h-[23px]" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <mask id="path-1-inside-1_149_4684" fill="white">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.9127 0.556152C9.88357 0.556152 9.04932 1.39039 9.04932 2.41948C9.04932 2.52061 9.05738 2.61986 9.07289 2.71662C6.87056 3.46686 5.28641 5.55307 5.28641 8.00929C5.28641 8.41858 5.33039 8.8176 5.4139 9.20188C5.54575 9.80862 5.52516 10.4557 5.2147 10.9934L0.270933 19.5563C-0.498867 20.8896 0.463381 22.5563 2.00298 22.5563H19.818C21.3576 22.5563 22.3199 20.8896 21.5501 19.5563L16.5579 10.9095C16.2521 10.38 16.2274 9.7437 16.351 9.1449C16.4266 8.7782 16.4664 8.39839 16.4664 8.00929C16.4664 5.57863 14.915 3.51031 12.7484 2.74047C12.7665 2.63619 12.776 2.52894 12.776 2.41948C12.776 1.39039 11.9417 0.556152 10.9127 0.556152Z" />
                                                        </mask>
                                                        <path d="M9.07289 2.71662L9.71781 4.60978L11.3146 4.06582L11.0477 2.40015L9.07289 2.71662ZM5.4139 9.20188L3.45951 9.62658L5.4139 9.20188ZM5.2147 10.9934L3.48265 9.99341H3.48265L5.2147 10.9934ZM0.270933 19.5563L2.00298 20.5563H2.00298L0.270933 19.5563ZM21.5501 19.5563L19.818 20.5563H19.818L21.5501 19.5563ZM16.5579 10.9095L18.2899 9.90946L18.2899 9.90946L16.5579 10.9095ZM16.351 9.1449L14.3922 8.74069L14.3922 8.7407L16.351 9.1449ZM12.7484 2.74047L10.7779 2.39833L10.4894 4.06026L12.0788 4.62503L12.7484 2.74047ZM11.0493 2.41948C11.0493 2.49496 10.9881 2.55615 10.9127 2.55615V-1.44385C8.779 -1.44385 7.04932 0.285824 7.04932 2.41948H11.0493ZM11.0477 2.40015C11.0489 2.40765 11.0493 2.41422 11.0493 2.41948H7.04932C7.04932 2.627 7.06587 2.83207 7.09808 3.03308L11.0477 2.40015ZM8.42797 0.823451C5.4401 1.84129 3.28641 4.67118 3.28641 8.00929H7.28641C7.28641 6.43496 8.30101 5.09242 9.71781 4.60978L8.42797 0.823451ZM3.28641 8.00929C3.28641 8.56227 3.34588 9.10366 3.45951 9.62658L7.36829 8.77717C7.31491 8.53155 7.28641 8.27489 7.28641 8.00929H3.28641ZM3.45951 9.62658C3.49071 9.77014 3.49426 9.87716 3.48824 9.944C3.48261 10.0064 3.471 10.0136 3.48265 9.99341L6.94675 11.9934C7.59084 10.8778 7.56306 9.67347 7.36829 8.77717L3.45951 9.62658ZM3.48265 9.99341L-1.46112 18.5563L2.00298 20.5563L6.94676 11.9934L3.48265 9.99341ZM-1.46112 18.5563C-3.00072 21.2229 -1.07622 24.5563 2.00298 24.5563V20.5563H2.00298L-1.46112 18.5563ZM2.00298 24.5563H19.818V20.5563H2.00298V24.5563ZM19.818 24.5563C22.8972 24.5563 24.8217 21.2229 23.2821 18.5563L19.818 20.5563V20.5563V24.5563ZM23.2821 18.5563L18.2899 9.90946L14.8258 11.9095L19.818 20.5563L23.2821 18.5563ZM18.2899 9.90946C18.3014 9.9294 18.2901 9.9223 18.2842 9.86108C18.2779 9.7956 18.2805 9.69061 18.3097 9.54909L14.3922 8.7407C14.2095 9.62625 14.1916 10.811 14.8258 11.9095L18.2899 9.90946ZM18.3097 9.5491C18.4126 9.05019 18.4664 8.53496 18.4664 8.00929H14.4664C14.4664 8.26182 14.4406 8.50622 14.3922 8.74069L18.3097 9.5491ZM18.4664 8.00929C18.4664 4.70585 16.3571 1.90021 13.4181 0.8559L12.0788 4.62503C13.473 5.12041 14.4664 6.4514 14.4664 8.00929H18.4664ZM10.776 2.41948C10.776 2.41376 10.7765 2.40655 10.7779 2.39833L14.719 3.0826C14.7566 2.86582 14.776 2.64411 14.776 2.41948H10.776ZM10.9127 2.55615C10.8372 2.55615 10.776 2.49496 10.776 2.41948H14.776C14.776 0.285824 13.0463 -1.44385 10.9127 -1.44385V2.55615Z" fill="white" mask="url(#path-1-inside-1_149_4684)" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Mute notification
                                                    </span>
                                                </div>
                                                <div className="inline-flex flex-1 space-x-6 items-center cursor-pointer">
                                                    <svg className="w-[22px] h-[23px]" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="9.36929" cy="9.92544" r="8.36929" stroke="white" strokeWidth="2" />
                                                        <rect x="13.8076" y="16.4554" width="1.97248" height="8.62737" rx="0.986241" transform="rotate(-45 13.8076 16.4554)" fill="white" />
                                                    </svg>

                                                    <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                        Search
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                </Popover>
                            </Popover.Group>
                        </div>
                        <div className="row-span-4 flex flex-col space-y-10 bg-[#FAFAFA] p-5 overflow-auto">
                            <div className="inline-flex space-x-5 items-center">
                                <div className="inline-flex items-start space-x-4">
                                    <div className="rounded-[20px]">
                                        <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                    </div>
                                    <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-[#7E98DF] text-[#FFFFFF] text-justify w-[7cm] h-auto p-5 rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                        Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car. Hi, son, how are you doing? Today, my father and I went to buy a car, bought a cool car.
                                    </div>
                                </div>

                                <span className="font-['Rubik'] font-normal text-base text-[#7E98DF]">
                                    Wed. 20:32
                                </span>
                            </div>
                            <div className="flex flex-row-reverse items-start space-x-5 space-x-reverse">
                                <div className="rounded-[20px]">
                                    <img src={SidebarAvatar} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                </div>
                                <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-white text-[#232323] text-justify w-[7cm] h-auto p-5 rounded-l-[3rem] rounded-tr-[3rem] rounded-br-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                    Oh! Cool Send me photo :)
                                </div>
                            </div>
                            <div className="inline-flex space-x-5 items-center">
                                <div className="inline-flex items-start space-x-4">
                                    <div className="rounded-[20px]">
                                        <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-[#7E98DF] text-[#FFFFFF] text-justify w-[7cm] h-auto p-5 rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                            Okay 😉
                                        </div>

                                        <div className="rounded-r-full rounded-l-2xl">
                                            <img src={ImageCar} alt="User Avatar" className="w-[6cm] h-auto float-left bg-local bg-center bg-cover" />
                                        </div>
                                    </div>
                                </div>

                                <span className="font-['Rubik'] font-normal text-base text-[#7E98DF]">
                                    Wed. 21:00
                                </span>
                            </div>
                            <div className="inline-flex space-x-5 items-center">
                                <div className="inline-flex items-start space-x-4">
                                    <div className="rounded-[20px]">
                                        <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                    </div>
                                    <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-[#7E98DF] text-[#FFFFFF] text-justify w-[7cm] h-auto p-5 rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                        Will we arrive tomorrow?
                                    </div>
                                </div>

                                <span className="font-['Rubik'] font-normal text-base text-[#7E98DF]">
                                    Wed. 21:10
                                </span>
                            </div>
                            <div className="flex flex-row-reverse items-start space-x-5 space-x-reverse">
                                <div className="rounded-[20px]">
                                    <img src={SidebarAvatar} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                </div>
                                <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-white text-[#232323] text-justify w-[7cm] h-auto p-5 rounded-l-[3rem] rounded-tr-[3rem] rounded-br-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                    Oh! Cool Send me photo :)
                                </div>
                            </div>
                            <div className="inline-flex space-x-5 items-center">
                                <div className="inline-flex items-start space-x-4">
                                    <div className="rounded-[20px]">
                                        <img src={UserFour} alt="User Avatar" className="w-[45px] h-[45px] md:w-[50px] md:h-[50px] lg:w-[62px] lg:h-[62px] bg-local bg-center bg-cover" />
                                    </div>
                                    <div className="font-['Rubik'] font-normal tracking-[-0.17px] bg-[#7E98DF] text-[#FFFFFF] text-justify w-[7cm] h-auto p-5 rounded-r-[3rem] rounded-tl-[3rem] rounded-bl-md text-base whitespace-pre-wrap break-all overflow-hidden">
                                        Thankyou
                                    </div>
                                </div>

                                <span className="font-['Rubik'] font-normal text-base text-[#7E98DF]">
                                    Wed. 21:30
                                </span>
                            </div>
                        </div>
                        <div className="row-span-2 flex flex-row bg-[#FFFFFF] shadow-sm drop-shadow-sm w-full">
                            <div className="inline-flex justify-center w-full px-2 py-2">
                                <div
                                    className={`font-['Rubik'] editableContent inline-flex ${selectedEmoji && `after:[content:'${selectedEmoji}']`} items-center py-5 overflow-x-hidden overflow-y-auto text-base whitespace-pre-wrap break-all font-medium w-[98.5%] h-[70px] bg-[#FAFAFA] text-[#232323] focus-visible:outline-0 [padding-inline-start:1rem] [padding-inline-end:8.5rem] md:[padding-inline-end:8rem] rounded-2xl`}
                                    contentEditable={true}
                                    placeholder="Type your message...">
                                </div>
                                <Popover.Group className="inline-flex space-x-4 absolute inset-y-5 right-9 bottom-5 items-center text-[#7E98DF]">
                                    <Popover>
                                        <Popover.Button>
                                            <svg className="w-[23px] h-[23px]" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="10" width="3" height="23" rx="1.5" fill="#7E98DF" />
                                                <rect x="23" y="10" width="3" height="23" rx="1.5" transform="rotate(90 23 10)" fill="#7E98DF" />
                                            </svg>
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-10 bottom-14 right-[5rem]">
                                            <div className="w-[170px] sm:w-[250px] h-[250px] bg-[#7E98DF] rounded-l-3xl rounded-tr-3xl rounded-br shadow drop-shadow">
                                                <div className="flex flex-col justify-around space-y-5 h-full p-5">
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="1" y="1" width="20" height="20" rx="2" stroke="white" strokeWidth="2" />
                                                            <path d="M8.96843 12.4268L2.85567 19.0952C2.63309 19.338 2.78297 19.7307 3.11073 19.7635L8.10539 20.263H12.737L18.8449 19.7077C19.0031 19.6933 19.1379 19.5866 19.1881 19.4359L20.2428 16.2719C20.2564 16.2312 20.2633 16.1884 20.2633 16.1454V12.1051L20.734 6.97043C20.7689 6.58905 20.2996 6.38131 20.0408 6.66363L12.4529 14.9413C12.2944 15.1143 12.0217 15.1143 11.8632 14.9413L9.55815 12.4268C9.39961 12.2538 9.12696 12.2538 8.96843 12.4268Z" fill="white" stroke="white" strokeWidth="2" />
                                                        </svg>
                                                        
                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Image
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="1" y="1" width="20" height="20" rx="2" stroke="white" strokeWidth="2" />
                                                            <path d="M19.684 9.26335L1.15771 2.31598H19.684V9.26335Z" fill="white" stroke="white" strokeWidth="2" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Documents
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-4 items-center cursor-pointer">
                                                        <svg className="w-[22px] h-[22px]" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M14.8511 6.08512C14.8511 8.34127 13.0221 10.1702 10.766 10.1702C8.5098 10.1702 6.68083 8.34127 6.68083 6.08512C6.68083 3.82897 8.5098 2 10.766 2C13.0221 2 14.8511 3.82897 14.8511 6.08512ZM13.4186 11.5632C15.4503 10.5775 16.8511 8.4949 16.8511 6.08512C16.8511 2.7244 14.1267 0 10.766 0C7.40523 0 4.68083 2.7244 4.68083 6.08512C4.68083 8.49491 6.08159 10.5775 8.11329 11.5632C4.08368 12.5842 0.959824 15.8777 0.185422 19.9999C0.0636771 20.6479 0 21.3165 0 21.9999H2H19.532H21.532C21.532 21.3165 21.4683 20.6479 21.3465 19.9999C20.5721 15.8777 17.4483 12.5842 13.4186 11.5632ZM2.22919 19.9999C3.13408 16.1223 6.61273 13.2339 10.766 13.2339C14.9192 13.2339 18.3979 16.1223 19.3028 19.9999H2.22919Z" fill="white" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Contacts
                                                        </span>
                                                    </div>
                                                    <div className="inline-flex flex-1 space-x-6 items-center cursor-pointer">
                                                        <svg className="w-[15px] h-[22px]" viewBox="0 0 15 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="7.33333" cy="7.33333" r="7.33333" fill="white" />
                                                            <path d="M7.33317 22.0001L0.982318 11.0001L13.684 11.0001L7.33317 22.0001Z" fill="white" />
                                                            <circle cx="7.33329" cy="7.33329" r="3.14286" fill="#7E98DF" />
                                                        </svg>

                                                        <span className="font-['Rubik'] font-normal text-base tracking-[-0.17px] text-white">
                                                            Location
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Popover>
                                    <Popover>
                                        <Popover.Button>
                                            <svg className="w-[24px] h-[23px]" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.9908 0C5.7635 0 0.720703 5.04 0.720703 11.25C0.720703 17.46 5.7635 22.5 11.9908 22.5C18.2295 22.5 23.2836 17.46 23.2836 11.25C23.2836 5.04 18.2295 0 11.9908 0ZM8.05363 6.75C8.98999 6.75 9.74584 7.50375 9.74584 8.4375C9.74584 9.37125 8.98999 10.125 8.05363 10.125C7.11727 10.125 6.36142 9.37125 6.36142 8.4375C6.36142 7.50375 7.11727 6.75 8.05363 6.75ZM12.0021 18C11.2945 18 10.616 17.8587 9.9857 17.599C7.42091 16.5422 9.22814 13.5 12.0021 13.5C14.7761 13.5 16.5833 16.5422 14.0186 17.599C13.3883 17.8587 12.7097 18 12.0021 18ZM15.9506 10.125C15.0143 10.125 14.2584 9.37125 14.2584 8.4375C14.2584 7.50375 15.0143 6.75 15.9506 6.75C16.887 6.75 17.6428 7.50375 17.6428 8.4375C17.6428 9.37125 16.887 10.125 15.9506 10.125Z" fill="#7E98DF" />
                                            </svg>
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-10 bottom-[4.5rem] right-[-1.5rem]">
                                            <EmojiPicker
                                                onEmojiClick={onClick}
                                                autoFocusSearch={false}
                                                theme={Theme.AUTO}
                                                lazyLoadEmojis={true}
                                                width="7.7cm"
                                                suggestedEmojisMode={SuggestionMode.RECENT}
                                                searchPlaceHolder="Search emoji"
                                                emojiStyle="twitter"
                                            />
                                        </Popover.Panel>
                                    </Popover>
                                    <Popover>
                                        <Popover.Button>
                                            <svg className="w-[19px] h-[19px]" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="1" y="1" width="17" height="17" rx="2" fill="#7E98DF" stroke="#7E98DF" strokeWidth="2" />
                                                <circle cx="9.5" cy="9.5" r="4.5" fill="#FAFAFA" stroke="#7E98DF" strokeWidth="2" />
                                            </svg>
                                            {/* <ChevronDownIcon className="ui-open:rotate-180 ui-open:transform" /> */}
                                        </Popover.Button>
                                        <Popover.Panel className="absolute z-10 bottom-[4.5rem] right-[-1.5rem]">
                                            <div className="inline-block p-5 bg-white rounded-xl w-auto h-auto">
                                                <div className="px-4 pb-4 border-b h-[46px]">
                                                    <div className="flex w-full h-[34px] bg-gray-200 rounded-middle">
                                                        <input
                                                            type="text"
                                                            className="w-full h-[30px] m-px px-2 bg-transparent placeholder-gray-500"
                                                            onChange={(e) =>
                                                                setSearchInput(e.target.value)
                                                            }
                                                            ref={inputRef}
                                                            placeholder="Search GIF"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="relative w-[230px] sm:w-[480px] h-[380px] overflow-hidden hover:overflow-y-scroll">
                                                    <div className="absolute flex flex-wrap justify-center justify-items-stretch items-stretch gap-3 p-2 w-auto">
                                                        {!searchResults
                                                            ? categories &&
                                                            categories.map((result, index) => {
                                                                const url = result.image;

                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="relative w-fit h-fit rounded-[5px] cursor-pointer hover:outline hover:outline-[3px] hover:outline-primary hover:drop-shadow-md"
                                                                        onClick={() => openCategory(result.searchterm)}>
                                                                        <div className="absolute w-max top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white bg-[#7E98DF] rounded-lg p-1 drop-shadow shadow font-semibold z-50">
                                                                            {result.searchterm}
                                                                        </div>
                                                                        <img
                                                                            className="bg-contain bg-local rounded-[5px] w-100"
                                                                            src={url}
                                                                            loading="lazy"
                                                                            alt="Category Thumb"
                                                                        />
                                                                    </div>
                                                                );
                                                            })
                                                            : searchResults.map((result) => {
                                                                const url = result.media_formats.tinygif.url;

                                                                return (
                                                                    <div
                                                                        key={result.id}
                                                                        className="relative w-fit h-fit rounded-[5px] cursor-pointer hover:outline hover:outline-[3px] hover:outline-primary hover:drop-shadow-md"
                                                                        onClick={() => sendGif(result.media_formats.gif.url)}>
                                                                        <img
                                                                            className="object-cover rounded-[5px] w-100"
                                                                            src={url}
                                                                            loading="lazy"
                                                                            alt="Category Thumb"
                                                                        />
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                            </div>
                                        </Popover.Panel>
                                    </Popover>
                                </Popover.Group>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default Dashboard
