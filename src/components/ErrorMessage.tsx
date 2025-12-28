import React from "react";
import { Box, Text } from "ink";
import { ErrorMessageProps } from "../types.js";

export default function ErrorMessage({ message, subtext }: ErrorMessageProps) {
  return (
    <Box flexDirection="column" width={60}>
      <Text color="yellow">{message}</Text>
      {subtext && <Text color="yellow">{subtext}</Text>}
    </Box>
  );
}
