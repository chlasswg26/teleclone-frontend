import { forwardRef, Fragment } from "react";
import EmojiPicker, { Theme, SuggestionMode } from "emoji-picker-react";

const forwardedRef = forwardRef;
const CustomEmojiPicker = forwardedRef(
  (
    { savedCurrentSelection, restoreCaretLatestPosition, listenChange },
    ref
  ) => {
    const onClickEmoji = (emojiData) => {
      if (savedCurrentSelection) {
        restoreCaretLatestPosition();
      } else {
        ref.current.focus();
      }

      listenChange(emojiData.emoji);
    };

    return (
      <Fragment>
        <EmojiPicker
          onEmojiClick={onClickEmoji}
          autoFocusSearch={false}
          theme={Theme.AUTO}
          lazyLoadEmojis={true}
          width="7.7cm"
          suggestedEmojisMode={SuggestionMode.RECENT}
          searchPlaceHolder="Search emoji"
          emojiStyle="google"
        />
      </Fragment>
    );
  }
);

export default CustomEmojiPicker;
