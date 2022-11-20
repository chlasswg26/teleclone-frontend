import { Popover } from "@headlessui/react";
import { useEventListener } from "ahooks";
import { Fragment, useEffect, useRef, useState } from "react"
import CustomContentEditable from "../input/content-editable";
import CustomEmojiPicker from "../emoji/emoji-picker";
import { caret } from "../../events/caret";
import { listenChange } from "../../events/selection";
import CustomGifPicker from "../gif/gif-picker";
import PlusBtnContentEditable from "../../svg/plus-btn-content-editable";
import ImageBtnPopup from "../../svg/image-btn-popup";
import DocumentBtnPopup from "../../svg/document-btn-popup";
import ContactBtnPopup from "../../svg/contact-btn-popup";
import LocationBtnPopup from "../../svg/location-btn-popup";
import EmojiBtnContentEditable from "../../svg/emoji-btn-content-editable";
import GifBtnContentEditable from "../../svg/gif-btn-content-editable";

const { REACT_APP_API_TENOR } = process.env;

const ChatWidget = (props) => {
    const { content, sendGif, contentEditableRef } = props
    const [selectionData, setSelectionData] = useState({
      saveSelection: () => {},
      restoreSelection: () => {},
    });
    const [savedCurrentSelection, setSavedCurrentSelection] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [categories, setCategories] = useState([]);
    const inputRef = useRef();

    const saveCaretLatestPosition = () => {
      caret(setSelectionData);

      setSavedCurrentSelection(
        selectionData.saveSelection(contentEditableRef.current)
      );
    };

    const restoreCaretLatestPosition = () => {
      setSavedCurrentSelection(
        selectionData.restoreSelection(
          contentEditableRef.current,
          savedCurrentSelection
        )
      );
    };

    const fetchGifs = async (url) => {
      const fetchedGifs = await fetch(url);
      const gifsData = await fetchedGifs.json();

      setSearchResults(gifsData.results);
    };

    const fetchCategories = async () => {
      const baseURL = `https://tenor.googleapis.com/v2/categories?&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;
      const fetchedGifs = await fetch(baseURL);
      const gifsData = await fetchedGifs.json();

      setCategories(gifsData.tags);
    };

    const openCategory = async (category) => {
      const url = `https://tenor.googleapis.com/v2/search?q=${category}&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;

      await fetchGifs(url);

      if (!inputRef.current) return;

      setSearchInput(category);

      inputRef.current.value = category;
    };

    const onSendGif = (url) => sendGif(url);

    useEventListener(
      "paste",
      (event) => {
        event.preventDefault();

        const text = (event.originalEvent || event).clipboardData.getData(
          "text/plain"
        );

        document.execCommand("insertText", false, text);
      },
      { target: contentEditableRef }
    );

    useEffect(() => {
      if (!searchInput) return setSearchResults(null);

      const url = `https://tenor.googleapis.com/v2/search?q=${searchInput}&key=${REACT_APP_API_TENOR}&limit=50&contentfilter=off`;

      fetchGifs(url);
    }, [searchInput]);

    useEffect(() => {
      if (searchResults) return;

      fetchCategories();
    }, [searchResults]);

    return (
      <Fragment>
        <div className="inline-flex w-full items-center justify-center px-2 py-2">
          <CustomContentEditable
            ref={contentEditableRef}
            content={content}
            saveCaretLatestPosition={saveCaretLatestPosition}
          />
          <Popover.Group className="absolute inset-y-5 right-9 bottom-5 inline-flex items-center space-x-4 text-[#7E98DF]">
            <Popover>
              <Popover.Button className="focus-visible:outline-0">
                <PlusBtnContentEditable />
              </Popover.Button>
              <Popover.Panel
                unmount={true}
                className="absolute bottom-14 right-[5rem] z-10"
              >
                <div className="h-[250px] w-[170px] rounded-l-3xl rounded-tr-3xl rounded-br bg-[#7E98DF] shadow drop-shadow sm:w-[250px]">
                  <div className="flex h-full flex-col justify-around space-y-5 p-5">
                    <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                      <ImageBtnPopup />

                      <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                        Image
                      </span>
                    </div>
                    <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                      <DocumentBtnPopup />

                      <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                        Documents
                      </span>
                    </div>
                    <div className="inline-flex flex-1 cursor-pointer items-center space-x-4">
                      <ContactBtnPopup />

                      <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                        Contacts
                      </span>
                    </div>
                    <div className="inline-flex flex-1 cursor-pointer items-center space-x-6">
                      <LocationBtnPopup />

                      <span className="font-['Rubik'] text-base font-normal tracking-[-0.17px] text-white">
                        Location
                      </span>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Popover>
            <Popover>
              <Popover.Button className="focus-visible:outline-0">
                <EmojiBtnContentEditable />
              </Popover.Button>
              <Popover.Panel
                unmount={true}
                className="absolute bottom-[4.5rem] right-[-1.5rem] z-10"
              >
                <CustomEmojiPicker
                  ref={contentEditableRef}
                  savedCurrentSelection={savedCurrentSelection}
                  restoreCaretLatestPosition={restoreCaretLatestPosition}
                  listenChange={listenChange}
                />
              </Popover.Panel>
            </Popover>
            <Popover>
              <Popover.Button className="focus-visible:outline-0">
                <GifBtnContentEditable />
              </Popover.Button>
              <Popover.Panel
                unmount={true}
                className="absolute bottom-[4.5rem] right-[-1.5rem] z-10"
              >
                <CustomGifPicker
                  setSearchInput={setSearchInput}
                  ref={inputRef}
                  searchResults={searchResults}
                  categories={categories}
                  openCategory={openCategory}
                  sendGif={onSendGif}
                />
              </Popover.Panel>
            </Popover>
          </Popover.Group>
        </div>
      </Fragment>
    );
}

export default ChatWidget
