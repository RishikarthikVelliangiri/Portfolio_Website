
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make sure we're properly rendering to the root element
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

console.log("Initializing React app");
const root = createRoot(rootElement);

// Render the app
root.render(<App />);

// Log to confirm rendering has completed
console.log("React app render initiated");
