import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BrowserState {
  url: string;
  screenshotSrc: string;
}

const initialState: BrowserState = {
  url: "https://github.com/arhansuba/Levin", // Placeholder URL
  screenshotSrc: "", // Placeholder for screenshot source
};

const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setScreenshotSrc: (state, action: PayloadAction<string>) => {
      state.screenshotSrc = action.payload;
    },
  },
});

export const { setUrl, setScreenshotSrc } = browserSlice.actions;

export default browserSlice.reducer;
