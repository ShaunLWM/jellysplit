import React from 'react';
import { Providers } from './lib/Providers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './pages/Home';
import { Box } from '@chakra-ui/react';

function App() {
  return (
    <Providers>
      <Box h="100vh" w="100vw">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Box>
    </Providers>
  );
}

export default App;
