import { createRoot, type Root } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const container = document.getElementById('root')!;

const rootKey = '__familiaSenseRoot__';
const globalScope = globalThis as typeof globalThis & { [rootKey]?: Root };

if (!globalScope[rootKey]) {
  globalScope[rootKey] = createRoot(container);
}

globalScope[rootKey]!.render(<App />);

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    globalScope[rootKey]?.render(<App />);
  });
}
