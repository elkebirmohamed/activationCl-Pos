import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Erreur critique: L'élément #root est introuvable dans le DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Erreur lors du rendu de l'application:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: sans-serif;">
        <h2>Désolé, une erreur est survenue</h2>
        <p>L'application n'a pas pu démarrer. Veuillez rafraîchir la page.</p>
      </div>
    `;
  }
}