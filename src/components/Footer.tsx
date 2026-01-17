
import React from 'react';
import { InfoDialog } from './InfoDialog';

export const Footer = () => {
  return (
    <footer className="text-center text-gray-500 text-sm mt-16 py-2 mb-4">
      <p>
        <span className='pr-2'>v1.0.1</span>
 &#8226;
        <a
          href="https://rkarthik.co"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 cursor-pointer hover:text-gray-300"
        >
          &copy; 2025 Karthik
        </a>
       &#8226;
        <InfoDialog>
          <span className="pl-2 cursor-pointer hover:text-gray-300">Info</span>
        </InfoDialog>
      </p>
    </footer>
  );
};
