import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #root {
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  input, select {
    font-family: inherit;
    font-size: inherit;
  }

  :root {
    --primary-100:#FF6600;
    --primary-200:#ff983f;
    --primary-300:#ffffa1;
    --accent-100:#F5F5F5;
    --accent-200:#929292;
    --text-100:#FFFFFF;
    --text-200:#e0e0e0;
    --bg-100:#1D1F21;
    --bg-200:#2c2e30;
    --bg-300:#444648;
      
}
[data-theme='ocean'] {
  --primary-100:#0085ff;
    --primary-200:#69b4ff;
    --primary-300:#e0ffff;
    --accent-100:#006fff;
    --accent-200:#e1ffff;
    --text-100:#FFFFFF;
    --text-200:#9e9e9e;
    --bg-100:#1E1E1E;
    --bg-200:#2d2d2d;
    --bg-300:#454545;
      
}
`;
