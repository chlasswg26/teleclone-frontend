import { forwardRef, Fragment } from "react"

const forwardedRef = forwardRef
const CustomGifPicker = forwardedRef(
  (
    { setSearchInput, searchResults, categories, openCategory, sendGif },
    ref
  ) => (
    <Fragment>
      <div className="inline-block h-auto w-auto rounded-xl bg-white p-5">
        <div className="h-[46px] border-b px-0 pb-4">
          <div className="rounded-middle flex h-[34px] w-full bg-gray-200">
            <input
              type="text"
              className="m-px h-[30px] w-full bg-transparent px-2 placeholder-gray-500"
              onChange={(e) => setSearchInput(e.target.value)}
              ref={ref}
              placeholder="Search GIF"
            />
          </div>
        </div>

        <div className="relative h-[380px] w-[230px] overflow-hidden hover:overflow-y-scroll sm:w-[480px]">
          <div className="absolute flex w-auto flex-wrap items-stretch justify-center justify-items-stretch gap-3 p-2">
            {!searchResults
              ? categories &&
                categories.map((result, index) => {
                  const url = result.image;

                  return (
                    <div
                      key={index}
                      className="hover:outline-primary relative h-fit w-fit cursor-pointer rounded-[5px] hover:outline hover:outline-[3px] hover:drop-shadow-md"
                      onClick={() => openCategory(result.searchterm)}
                    >
                      <div className="absolute top-1/2 left-1/2 z-50 w-max -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#7E98DF] p-1 font-semibold text-white shadow drop-shadow">
                        {result.searchterm}
                      </div>
                      <img
                        className="w-100 rounded-[5px] bg-contain bg-local"
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
                      className="hover:outline-primary relative h-fit w-fit cursor-pointer rounded-[5px] hover:outline hover:outline-[3px] hover:drop-shadow-md"
                      onClick={() => sendGif(result.media_formats.gif.url)}
                    >
                      <img
                        className="w-100 rounded-[5px] object-cover"
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
    </Fragment>
  )
);

export default CustomGifPicker
