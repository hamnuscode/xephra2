import React from 'react';

const FloatingWhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/923396969698" // Replace with your number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg z-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16.72 11.06c-.22-.11-1.3-.64-1.5-.71-.2-.07-.34-.11-.49.11-.15.22-.56.71-.69.86-.13.15-.25.16-.47.05-.22-.11-.92-.34-1.75-1.08-.65-.58-1.1-1.3-1.23-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.25.34-.37.11-.12.15-.22.22-.36.07-.15.04-.27-.02-.38-.07-.11-.49-1.18-.67-1.63-.18-.44-.37-.38-.49-.38-.13 0-.27 0-.41 0s-.38.05-.58.27c-.2.22-.76.74-.76 1.8s.78 2.1.89 2.25c.11.15 1.53 2.33 3.7 3.27 1.4.61 1.94.66 2.64.56.42-.06 1.3-.53 1.48-1.05.18-.52.18-.97.13-1.06-.06-.1-.2-.15-.42-.26z"
        />
        <path
          fill="currentColor"
          d="M12 2a10 10 0 00-9.26 13.72l-1.2 4.39a1 1 0 001.23 1.23l4.39-1.2A10 10 0 1012 2zm0 18a7.95 7.95 0 01-4.1-1.13l-.29-.17-2.61.71.7-2.6-.17-.3A8 8 0 1112 20z"
        />
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;
