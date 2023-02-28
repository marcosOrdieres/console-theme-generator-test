//@ts-nocheck
import { Button, ButtonGroup, Code, Flex, Input,Box, Stack, Tag, Tooltip } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

export type ThemeProps = {
  id: string;
  name: string;
  color: string;
};

const ColorThemes = (props: {
  caution?: (variable: ThemeProps) => { message: string; error: number } | undefined;
  themes: ThemeProps[];
  onChange: (t: ThemeProps) => void;
  onDelete: (index: number) => void;
}) => {
  const [theme, setTheme] = useState<ThemeProps>({});
  const [name, setName] = useState();
  const [color, setColor] = useState();

  const { themes, onDelete, caution } = props;

  const handleChange = () => {
    color && name && props.onChange(theme);
    setColor("");
    setName("");
  };

  return (
    <Stack spacing={8}>
      <Stack direction={"row"}>
        <Input
          value={name}
          placeholder="name"
          size="sm"
          onChange={({ target }) => {
            setName(target.value);
            setTheme({ ...theme, name: target.value });
          }}
        />
        <Input
          value={color}
          placeholder="color"
          size="sm"
          onChange={({ target }) => {
            setColor(target.value);
            setTheme({ ...theme, color: target.value });
          }}
        />
        <Button size="sm" rounded={0} onClick={handleChange}>
          Add
        </Button>
      </Stack>
      <Stack>
        {themes.map((theme, i) => {
          const c = caution?.(theme);
          const errorLevels = {
            1: "red",
            3: "orange",
          };

          return (
            <Stack direction="row" w="full" spacing={3}>
   
              <Tooltip display='block' hasArrow label={c?.message}>
                <Tag
                  outline={c ? `1px solid ${errorLevels[c?.error]}` : "none"}
                  sx={{ outlineStyle: "dashed" }}
                  borderRadius={2}
                  outlineOffset={2}
                  as={Flex}
                  w="full"
                  size="md"
                  rounded="none"
                  key={theme.id}
                  backgroundColor={theme.color}
                >
                  <Code>--{theme.name}</Code>
                </Tag>
              </Tooltip>
      
              <ButtonGroup>
                <Button size="sm" rounded={0} leftIcon={<FiEdit />}>
                  Edit
                </Button>
                <Button onClick={() => onDelete(i)} size="sm" rounded={0} leftIcon={<AiOutlineDelete />}>
                  Del
                </Button>
              </ButtonGroup>
              {/* <Button size='sm' rounded={0} leftIcon={<          BsCheckAll/>}>Save</Button> */}
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default ColorThemes;
