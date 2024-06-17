import Editor, { Monaco } from "@monaco-editor/react";
import { Tab, Tabs } from "@nextui-org/react";
import type { editor } from "monaco-editor";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "#/store";
import FileExplorer from "./file-explorer/FileExplorer";
import { VscCode } from "react-icons/vsc";

function CodeEditor(): JSX.Element {
  const code = useSelector((state: RootState) => state.code.code);
  const activeFilepath = useSelector((state: RootState) => state.code.path);

  const selectedFileName = useMemo(() => {
    const paths = activeFilepath.split("/");
    return paths[paths.length - 1];
  }, [activeFilepath]);

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    // Define a custom theme
    monaco.editor.defineTheme("my-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#171717",
      },
    });

    // Apply custom theme
    monaco.editor.setTheme("my-theme");
  };

  return (
    <div className="flex h-full w-full bg-neutral-900 transition-all duration-500 ease-in-out">
      <FileExplorer />
      <div className="flex flex-col min-h-0 w-full">
        <Tabs
          disableCursorAnimation
          classNames={{
            base: "border-b border-divider border-neutral-600 mb-4",
            tabList:
              "w-full relative rounded-none bg-neutral-900 p-0 border-divider",
            cursor: "w-full bg-neutral-600 rounded-none",
            tab: "max-w-fit px-4 h-[36px]",
            tabContent: "group-data-[selected=true]:text-white",
          }}
          aria-label="Options"
        >
          <Tab
            key={selectedFileName.toLocaleLowerCase()}
            title={selectedFileName}
          />
        </Tabs>
        <div className="flex grow items-center justify-center">
          {selectedFileName === "" ? (
            <div className="flex flex-col items-center text-neutral-400">
              <VscCode size={100} />
              {/* Replace t(I18nKey.CODE_EDITOR$EMPTY_MESSAGE) with a static message */}
              <span>Empty message for code editor</span>
            </div>
          ) : (
            <Editor
              height="100%"
              path={selectedFileName.toLocaleLowerCase()}
              defaultValue=""
              value={code}
              onMount={handleEditorDidMount}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;
