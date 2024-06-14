import React, { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { fetchAgents, fetchModels } from "#/services/options";
import { RootState } from "../../../store";
import AgentState from "../../../types/AgentState";
import {
  Settings,
  getSettings,
  getDefaultSettings,
  getSettingsDifference,
  settingsAreUpToDate,
  maybeMigrateSettings,
  saveSettings,
} from "#/services/settings";
import toast from "#/utils/toast";
import BaseModal from "../base-modal/BaseModal";
import SettingsForm from "./SettingsForm";

interface SettingsProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Example AvailableLanguages array
const AvailableLanguages = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  // Add more languages as needed
];

const REQUIRED_SETTINGS = ["LLM_MODEL", "AGENT"];

function SettingsModal({ isOpen, onOpenChange }: SettingsProps) {
  const [models, setModels] = useState<string[]>([]);
  const [agents, setAgents] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>({} as Settings);
  const [agentIsRunning, setAgentIsRunning] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { curAgentState } = useSelector((state: RootState) => state.agent);

  useEffect(() => {
    maybeMigrateSettings();
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    const isRunning =
      curAgentState === AgentState.RUNNING ||
      curAgentState === AgentState.PAUSED ||
      curAgentState === AgentState.AWAITING_USER_INPUT;
    setAgentIsRunning(isRunning);
  }, [curAgentState]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedModels = await fetchModels();
        const fetchedAgents = await fetchAgents();
        setModels(fetchedModels);
        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Error fetching models and agents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleModelChange = (model: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      LLM_MODEL: model,
    }));
  };

  const handleAgentChange = (agent: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      AGENT: agent,
    }));
  };

  const handleLanguageChange = (language: string) => {
    const key =
      AvailableLanguages.find((lang) => lang.label === language)?.value ||
      language;
    setSettings((prevSettings) => ({
      ...prevSettings,
      LANGUAGE: key,
    }));
  };

  const handleAPIKeyChange = (apiKey: string) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      LLM_API_KEY: apiKey,
    }));
  };

  const handleResetSettings = () => {
    setSettings(getDefaultSettings());
  };

  const handleSaveSettings = () => {
    const updatedSettings = getSettingsDifference(settings);
    saveSettings(settings);
    // Replace with your logic for language change
    // i18next.changeLanguage(settings.LANGUAGE);

    const sensitiveKeys = ["LLM_API_KEY"];

    Object.entries(updatedSettings).forEach(([key, value]) => {
      if (!sensitiveKeys.includes(key)) {
        toast.settingsChanged(`${key} set to "${value}"`);
      } else {
        toast.settingsChanged(`${key} has been updated securely.`);
      }
    });

    localStorage.setItem(
      `API_KEY_${settings.LLM_MODEL || models[0]}`,
      settings.LLM_API_KEY || ""
    );
  };

  let subtitle = "Modal subtitle";
  if (loading) {
    subtitle = "Loading agents and models...";
  } else if (agentIsRunning) {
    subtitle = "Agent is currently running.";
  } else if (!settingsAreUpToDate()) {
    subtitle = "Settings need to be updated.";
  }

  const saveIsDisabled = REQUIRED_SETTINGS.some(
    (key) => !settings[key as keyof Settings]
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Modal title"
      isDismissable={settingsAreUpToDate()}
      subtitle={subtitle}
      actions={[
        {
          label: "Save Settings",
          action: handleSaveSettings,
          isDisabled: saveIsDisabled,
          closeAfterAction: true,
          className: "bg-primary rounded-lg",
        },
        {
          label: "Reset Settings",
          action: handleResetSettings,
          closeAfterAction: false,
          className: "bg-neutral-500 rounded-lg",
        },
        {
          label: "Close",
          action: () => {
            setSettings(getSettings()); // reset settings from any changes
          },
          isDisabled: !settingsAreUpToDate(),
          closeAfterAction: true,
          className: "bg-rose-600 rounded-lg",
        },
      ]}
    >
      {loading && <Spinner />}
      {!loading && (
        <SettingsForm
          disabled={agentIsRunning}
          settings={settings}
          models={models}
          agents={agents}
          onModelChange={handleModelChange}
          onAgentChange={handleAgentChange}
          onLanguageChange={handleLanguageChange}
          onAPIKeyChange={handleAPIKeyChange}
        />
      )}
    </BaseModal>
  );
}

export default SettingsModal;
