import { Fragment } from "react"

const PlusBtnContentEditable = () => (
  <Fragment>
    <svg
      className="h-[23px] w-[23px]"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" width="3" height="23" rx="1.5" fill="#7E98DF" />
      <rect
        x="23"
        y="10"
        width="3"
        height="23"
        rx="1.5"
        transform="rotate(90 23 10)"
        fill="#7E98DF"
      />
    </svg>
  </Fragment>
);

export default PlusBtnContentEditable
