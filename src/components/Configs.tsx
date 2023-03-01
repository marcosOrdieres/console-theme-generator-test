import React, { useState, useMemo } from "react";
import { Stack, Select, Button, ButtonGroup } from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { GrFormUpload } from "react-icons/gr";

import { ThemeProps } from "./Theme";

export type ConfigProps = {
  themes?: ThemeProps[];
  variables?: ThemeProps[];
  id: string;
};
export type Props = {
  config?: ConfigProps;
  setConfig: (config: ConfigProps) => void;
};

const Configs = (p: Props) => {
  const { config, setConfig } = p;
  const [selectedConfig, setSelectedConfig] = useState<ConfigProps>();

  const configs = useMemo<ConfigProps[]>(() => {
    const c = localStorage.getItem("theme-configs");
    try {
      const data = JSON.parse(c || "[]");
      return data;
    } catch {
      return [];
    }
  }, [config?.id]);

  useMemo(() => {
    if ((config?.id && config.themes) || config?.variables) {
      const exist = configs.findIndex((c) => c.id === config.id);
      if (exist !== -1) {
        configs[exist] = config;
      } else {
        configs.push(config);
      }
      localStorage.setItem("theme-configs", JSON.stringify(configs));
    }
  }, [config, configs]);

  return (
    <Stack>
      <Stack spacing={3}>
        <Select
          onChange={(v) => {
            setSelectedConfig(configs.find((c) => c.id === v.target.value));
          }}
          placeholder="select config"
          size="sm"
        >
          {configs.map((c) => (
            <option>{c.id}</option>
          ))}
        </Select>
      </Stack>
      <ButtonGroup>
        <Button onClick={() => selectedConfig && setConfig(selectedConfig)} w="fit-content" size="sm" rounded={0} leftIcon={<GrFormUpload />}>
          Load
        </Button>
        <Button onClick={() => {
          if (selectedConfig?.id) {
            const exist = configs.findIndex((c) => c.id === selectedConfig.id);
            configs.splice(exist, 1)
            localStorage.setItem("theme-configs", JSON.stringify(configs));
          }
        }} w="fit-content" size="sm" rounded={0} leftIcon={<AiOutlineDelete />}>
          Delete
        </Button>
      </ButtonGroup>
    </Stack>
  );
};
export default Configs;
