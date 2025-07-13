// import React, { useState, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';

// const TypingMarkdown = ({ text, isActive, onComplete, speed = 2 }) => {
//   const [currentText, setCurrentText] = useState('');

//   useEffect(() => {
//     if (!isActive) return;

//     let index = 0;
//     setCurrentText('');

//     const interval = setInterval(() => {
//       if (index < text.length) {
//         setCurrentText(prev => prev + text.charAt(index));
//         index++;
//       } else {
//         clearInterval(interval);
//         onComplete && onComplete();
//       }
//     }, speed);

//     return () => clearInterval(interval);
//   }, [text, isActive, speed, onComplete]);

//   return (
//     <ReactMarkdown
//       components={{
//         strong: ({ node, ...props }) => <strong style={{ color: '#0089cf' }} {...props} />,
//         ul: ({ node, ...props }) => <ul style={{ margin: '10px 0' }} {...props} />,
//         li: ({ node, ...props }) => <li style={{ marginBottom: '8px' }} {...props} />
//       }}
//     >
//       {currentText}
//     </ReactMarkdown>
//   );
// };

// export default TypingMarkdown;