import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider, Flex, Heading, Stack, Button, Link, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import ColorThemes, { ThemeProps } from "./Theme";
import uniqid from "uniqid";
import { GrShare } from "react-icons/gr";
import { FiCopy } from "react-icons/fi";
import { VscCode } from "react-icons/vsc";

import Configs, { ConfigProps } from "./Configs";

const formatDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return new Date().toLocaleString("en-US", options);
};

function isValidHost(text: string) {
  try {
    new URL(`http://${text}`);
    return text;
  } catch (error) {
    return false;
  }
}

const buildLink = (variables: ThemeProps[], themes: ThemeProps[], host: string) => {
  const t = themes.reduce((acc, next) => {
    //@ts-ignore
    acc[next.name] = next.color;
    return acc;
  }, {});

  const v = variables.reduce((acc, next) => {
    //@ts-ignore
    acc[next.name] = next.color;
    return acc;
  }, {});

  const data = {
    themes: t,
    variables: v,
  };
  const json = JSON.stringify(data);
  return { json, href: encodeURIComponent(json) };
};

const cautionVariable = (variableName: ThemeProps, themes: ThemeProps[]) => {
  const themeNamePtr = /^\w+-(.+)-\w+$/;
  const themeName = variableName.name?.match(themeNamePtr)?.["1"];
  if (!themeName) {
    return { error: 1, message: `--${variableName.name} is possibly an invalid variable name` };
  }
  const some = themes.some((t) => t.name === themeName);

  if (!some) {
    return { error: 3, message: `You may need theme name "--${themeName}"` };
  }
};

const Page = () => {
  const [themes, setThemes] = useState<ThemeProps[]>([{ id: "9", name: "primary", color: "green" }]);
  const [variables, setVariables] = useState<ThemeProps[]>([{ id: "9", name: "primary", color: "green" }]);
  const [consoleUrl, setConsoleUrl] = useState("console.platform.sh");
  const [configs, setConfigs] = useState<ConfigProps>({ id: formatDate() });

  useEffect(() => {
    configs.themes && setThemes(configs.themes);
    configs.variables && setVariables(configs.variables);
  }, [configs.id]);

  const onThemeChange = (theme: ThemeProps) => {
    if (!theme.id) {
      setThemes([{ ...theme, id: uniqid() }, ...themes]);
    }
  };

  const onDeleteTheme = (index: number) => {
    const t = themes;
    t.splice(index, 1);
    setThemes([...t]);
  };

  const onDeleteVariable = (index: number) => {
    const t = variables;
    t.splice(index, 1);
    setVariables([...t]);
  };

  const onVariableChange = (variable: ThemeProps) => {
    if (!variable.id) {
      setVariables([{ ...variable, id: uniqid() }, ...variables]);
    }
  };

  const data = useMemo(() => buildLink(variables, themes, ""), [themes, variables]);
  const url = `https://${isValidHost(consoleUrl) || "console.platform.sh"}/?themePreview=${data.href}`;
  return (
    <Box maxWidth="60rem" margin="5rem auto">
      <Stack justify="space-between" mb="2rem" direction="row">
        <Stack>
          <InputGroup size="sm" w="sm">
            <InputLeftAddon children="https://" />
            <Input onChange={({ target }) => setConsoleUrl(target.value)} value={consoleUrl} placeholder={consoleUrl} w="xs" />
          </InputGroup>
          <Flex gap={4}>
            <Button onClick={() => navigator.clipboard.writeText(data.json)} w="fit-content" size="sm" rounded={0} leftIcon={<VscCode />}>
              Copy
            </Button>
            <Link
              onClick={() =>
                setConfigs({
                  ...configs,
                  themes,
                  variables,
                })
              }
              display="flex"
              alignItems="center"
              gap="4px"
              href={url}
              isExternal
            >
              Preview in Console <GrShare />
            </Link>
          </Flex>
        </Stack>
        <Box>
          <Configs setConfig={setConfigs} config={configs} />
        </Box>
      </Stack>
      <Flex justify="space-between" flexBasis={1} wrap="wrap">
        <Stack spacing={10}>
          <Heading size="md" fontWeight={500}>
            Theme Variables Colors
          </Heading>
          <ColorThemes onDelete={onDeleteTheme} onChange={onThemeChange} themes={themes} />
        </Stack>

        <Stack spacing={10}>
          <Heading fontWeight={500} size="md">
            Custom CSS Variable
          </Heading>
          <ColorThemes
            caution={(variableName: ThemeProps) => {
              return cautionVariable(variableName, themes);
            }}
            onDelete={onDeleteVariable}
            onChange={onVariableChange}
            themes={variables}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Page;
