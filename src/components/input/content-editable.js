import { forwardRef, Fragment } from "react"

const forwardedRef = forwardRef
const CustomContentEditable = forwardedRef(
  ({ saveCaretLatestPosition, content }, ref) => (
    <Fragment>
      <div
        ref={ref}
        className={`editableContent no-scrollbar h-auto max-h-[3cm] min-h-[64px] w-[98.5%] overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all rounded-2xl bg-[#FAFAFA] py-5 font-['Rubik'] font-medium text-[#232323] [padding-inline-start:1rem] [padding-inline-end:8.5rem] focus-visible:outline-0 md:[padding-inline-end:8rem]`}
        contentEditable={true}
        suppressContentEditableWarning={true}
        placeholder="Type your message..."
        onBlur={saveCaretLatestPosition}
      ></div>
    </Fragment>
  )
);

export default CustomContentEditable
