import React, { useEffect, useMemo, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { IoIosGlobe } from "react-icons/io";
import { VscCode, VscListOrdered } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { initialState  as initialBrowserState} from "#/state/browserSlice";
import { initialState as initialCodeState } from "#/state/codeSlice";
import { RootState } from "#/store";
import { TabOption, TabType } from "#/types/TabOption";
import Browser from "./Browser";
import CodeEditor from "./CodeEditor";
import Planner from "./Planner";
import Jupyter from "./Jupyter";
import { getSettings } from "#/services/settings";

function Workspace() {
  const task = useSelector((state: RootState) => state.task.task);
  const code = useSelector((state: RootState) => state.code.code);

  const { AGENT } = getSettings();
  const baseTabs = [TabOption.CODE, TabOption.BROWSER];
  const extraTabsMap: { [key: string]: TabOption[] } = {
    CodeActAgent: [TabOption.JUPYTER],
    PlannerAgent: [TabOption.PLANNER],
  };
  const extraTabs = extraTabsMap[AGENT] || [];
  const showTabs = [...baseTabs, ...extraTabs];

  const screenshotSrc = useSelector(
    (state: RootState) => state.browser.screenshotSrc
  );
  const jupyterCells = useSelector((state: RootState) => state.jupyter.cells);
  const [activeTab, setActiveTab] = useState<TabType>(TabOption.CODE);
  const [changes, setChanges] = useState<Record<TabType, boolean>>({
    [TabOption.PLANNER]: false,
    [TabOption.CODE]: false,
    [TabOption.BROWSER]: false,
    [TabOption.JUPYTER]: false,
  });

  const iconSize = 18;
  const tabData = useMemo(
    () => ({
      [TabOption.PLANNER]: {
        name: "Planner", // Replace with your translated text or static text
        icon: <VscListOrdered size={iconSize} />,
        component: <Planner key="planner" />,
      },
      [TabOption.CODE]: {
        name: "Code Editor", // Replace with your translated text or static text
        icon: <VscCode size={iconSize} />,
        component: <CodeEditor key="code" />,
      },
      [TabOption.BROWSER]: {
        name: "Browser", // Replace with your translated text or static text
        icon: <IoIosGlobe size={iconSize} />,
        component: <Browser key="browser" />,
      },
      [TabOption.JUPYTER]: {
        name: "Jupyter", // Replace with your translated text or static text
        icon: <VscCode size={iconSize} />,
        component: <Jupyter key="jupyter" />,
      },
    }),
    []
  );

  useEffect(() => {
    if (activeTab !== TabOption.PLANNER && task) {
      setChanges((prev) => ({ ...prev, [TabOption.PLANNER]: true }));
    }
  }, [activeTab, task]);

  useEffect(() => {
    if (activeTab !== TabOption.CODE && code !== initialCodeState.code) {
      setChanges((prev) => ({ ...prev, [TabOption.CODE]: true }));
    }
  }, [activeTab, code]);

  useEffect(() => {
    if (
      activeTab !== TabOption.BROWSER &&
      screenshotSrc !== initialBrowserState.screenshotSrc
    ) {
      setChanges((prev) => ({ ...prev, [TabOption.BROWSER]: true }));
    }
  }, [activeTab, screenshotSrc]);

  useEffect(() => {
    if (activeTab !== TabOption.JUPYTER && jupyterCells.length > 0) {
      setChanges((prev) => ({ ...prev, [TabOption.JUPYTER]: true }));
    }
  }, [activeTab, jupyterCells]);

  return (
    <div className="flex flex-col min-h-0 grow">
      <div
        role="tablist"
        className="tabs tabs-bordered tabs-lg border-b border-neutral-600 flex"
      >
        <Tabs
          disableCursorAnimation
          classNames={{
            base: "w-full",
            tabList:
              "w-full relative rounded-none bg-neutral-900 p-0 gap-0 h-[36px] flex",
            tab: "rounded-none border-neutral-600 data-[selected=true]:bg-neutral-800 justify-start",
            tabContent: "group-data-[selected=true]:text-white",
          }}
          size="lg"
          onSelectionChange={(v) => {
            setChanges((prev) => ({ ...prev, [v as TabType]: false }));
            setActiveTab(v as TabType);
          }}
        >
          {showTabs.map((tab, index) => (
            <Tab
              key={tab}
              className={`flex-grow ${index + 1 === showTabs.length ? "" : "border-r"}`}
              title={
                <div className="flex grow items-center gap-2 justify-center text-xs">
                  {tabData[tab].icon}
                  <span>{tabData[tab].name}</span>
                  {changes[tab] && (
                    <div className="w-2 h-2 rounded-full animate-pulse bg-blue-500" />
                  )}
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
      <div className="grow w-full bg-neutral-800 flex min-h-0">
        {tabData[activeTab].component}
      </div>
    </div>
  );
}

export default Workspace;
