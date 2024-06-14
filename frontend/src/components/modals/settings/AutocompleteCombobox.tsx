import React from "react";
import { Autocomplete, AutocompleteItem, Tooltip } from "@nextui-org/react";

type Label = "model" | "agent" | "language";

const LABELS: Record<Label, string> = {
  model: "Model Select Label",
  agent: "Agent Select Label",
  language: "Language Select Label",
};

const PLACEHOLDERS: Record<Label, string> = {
  model: "Model Select Placeholder",
  agent: "Agent Select Placeholder",
  language: "Language Select Placeholder",
};

type AutocompleteItemType = {
  value: string;
  label: string;
};

interface AutocompleteComboboxProps {
  ariaLabel: Label;
  items: AutocompleteItemType[];
  defaultKey: string;
  onChange: (key: string) => void;
  tooltip: string;
  allowCustomValue?: boolean;
  disabled?: boolean;
}

export function AutocompleteCombobox({
  ariaLabel,
  items,
  defaultKey,
  onChange,
  tooltip,
  allowCustomValue = false,
  disabled = false,
}: AutocompleteComboboxProps) {
  return (
    <Tooltip
      content={
        disabled
          ? `${tooltip} (Disabled)`
          : tooltip
      }
      closeDelay={100}
      delay={500}
    >
      <Autocomplete
        aria-label={ariaLabel}
        label={LABELS[ariaLabel]}
        placeholder={PLACEHOLDERS[ariaLabel]}
        defaultItems={items}
        defaultSelectedKey={defaultKey}
        inputValue={
          // Find the label for the default key, otherwise use the default key itself
          // This is useful when the default key is not in the list of items, in the case of a custom LLM model
          items.find((item) => item.value === defaultKey)?.label || defaultKey
        }
        onInputChange={(val: string) => {
          onChange(val);
        }}
        isDisabled={disabled}
        allowsCustomValue={allowCustomValue}
      >
        {(item: { value: any; label: any; }) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </Tooltip>
  );
}
