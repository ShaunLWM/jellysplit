import { ChakraProvider } from "@chakra-ui/react";

interface Props {
  children: JSX.Element;
}

export function Providers(props: Props) {
  const { children } = props;
  return <ChakraProvider>{children}</ChakraProvider>
}