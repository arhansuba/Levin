import React from "react";
import { useSelector } from "react-redux";
import { IoIosGlobe } from "react-icons/io";
import { RootState } from "#/store";

function Browser(): JSX.Element {
  const { url, screenshotSrc } = useSelector(
    (state: RootState) => state.browser
  );

  const imgSrc =
    screenshotSrc && screenshotSrc.startsWith("data:image/png;base64,")
      ? screenshotSrc
      : `data:image/png;base64,${screenshotSrc || ""}`;

  return (
    <div className="h-full w-full flex flex-col text-neutral-400">
      <div className="w-full p-2 truncate border-b border-neutral-600">
        {url}
      </div>
      <div className="overflow-y-auto grow scrollbar-hide rounded-xl">
        {screenshotSrc ? (
          <img
            src={imgSrc}
            style={{ objectFit: "contain", width: "100%", height: "auto" }}
            className="rounded-xl"
            alt="Browser Screenshot"
          />
        ) : (
          <div className="flex flex-col items-center h-full justify-center">
            <IoIosGlobe size={100} />
            {/* Replace t(I18nKey.BROWSER$EMPTY_MESSAGE) with a static message */}
            <span>Empty message for browser</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Browser;
