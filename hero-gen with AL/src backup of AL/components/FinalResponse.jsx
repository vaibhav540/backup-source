// import React, { useState, useEffect } from 'react';
// import ReactMarkdown from 'react-markdown';
// import TypingMarkdown from './TypingMarkdown';
// import { LinearProgress } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { setSessionID } from '../redux/actions';
// import { FaFilePdf } from 'react-icons/fa';

// const Card = ({ citation }) => {
//   const styles = {
//     card: {
//       backgroundColor: 'transparent',
//       borderRadius: '8px',
//       boxShadow: '0 2px 4px transparent',
//       padding: '10px',
//       margin: '10px',
//       border: '1px solid #e0e0e0',
//       maxHeight: '220px',
//       maxWidth: '170px',
//       overflow: 'hidden',
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'space-between',
//       alignItems: 'center'
//     },
//     titleLink: {
//       color: '#2c7be5',
//       textDecoration: 'none',
//       fontWeight: '600',
//       fontSize: '12px',
//       margin: '5px 10px',
//       display: 'flex',
//       alignItems: 'center',
//       overflow: 'hidden',
//       whiteSpace: 'nowrap',
//       textOverflow: 'ellipsis'
//     },
//     pdfIcon: {
//       marginRight: '5px',
//       color: '#d32f2f'
//     },
//     imageLink: {
//       display: 'block',
//       borderRadius: '6px',
//       overflow: 'hidden',
//       textDecoration: 'none',
//       marginBottom: '10px',
//       width: '100%',
//       maxWidth: '150px'
//     },
//     image: {
//       width: '100%',
//       height: 'auto',
//       objectFit: 'cover',
//       border: '1px solid #eee'
//     }
//   };

//   const truncatedTitle = citation.title.split(' ').slice(0, 3).join(' ') + '...';

//   return (
//     <div style={styles.card}>
//       <a
//         href={citation.actionLink}
//         style={styles.titleLink}
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <FaFilePdf style={styles.pdfIcon} />
//         <span>{truncatedTitle}</span>
//       </a>
//       {citation.imageLink && (
//         <a
//           href={citation.imageLink}
//           style={styles.imageLink}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <img
//             src={citation.imageLink}
//             alt="Document preview"
//             style={styles.image}
//           />
//         </a>
//       )}
//     </div>
//   );
// };

// const FinalResponse = ({ question, session_id, sub_segment, segment, keyword }) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentTypingIndex, setCurrentTypingIndex] = useState({});
//   const [cardPage, setCardPage] = useState(0);
//   const dispatch = useDispatch();
//   const cardsPerPage = 4;

//   useEffect(() => {
//     if (data?.status === "success") {
//       const initial = {};
//       data.data.responses.forEach((_, index) => {
//         initial[index] = 0;
//       });
//       setCurrentTypingIndex(initial);

//       if (data.data.session_id) {
//         dispatch(setSessionID(data.data.session_id));
//       }
//     }
//   }, [data, dispatch]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch('https://al-genai-api-v1-gateway-a8d67j5q.uc.gateway.dev/master/functions', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'x-api-key': 'AIzaSyC9s3SJxJNLgWdRotkB52UTHzEsfuU3mWo'
//           },
//           body: JSON.stringify({ question, session_id, sub_segment, segment, keyword })
//         });

//         if (!response.ok) throw new Error('Failed to fetch data');
//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [question, sub_segment, session_id, segment, keyword]);

//   const styles = {
//     loading: {
//       color: '#666',
//       fontStyle: 'italic',
//       padding: '10px',
//       textAlign: 'center'
//     },
//     error: {
//       color: '#cc0000',
//       fontWeight: 'bold',
//       padding: '10px',
//       border: '1px solid #ffb3b3',
//       borderRadius: '4px',
//       margin: '10px 0',
//       backgroundColor: '#ffe6e6'
//     },
//     docsResponse: {
//       padding: '14px',
//       margin: '10px 0',
//       borderRadius: '6px',
//       fontSize: '15px',
//       lineHeight: '1.5'
//     },
//     cardRow: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(4, minmax(100px, 1fr))',
//       gap: '1px',
//       margin: '20px 0'
//     },
//     suggestedQuestions: {
//       marginTop: '30px',
//       paddingTop: '20px',
//       borderTop: '1px solid #eee'
//     },
//     questionButton: {
//       display: 'block',
//       background: 'transparent',
//       color: '#0089cf',
//       border: 'none',
//       padding: '10px 0',
//       cursor: 'pointer',
//       fontSize: '14px',
//       textAlign: 'left',
//       width: '100%'
//     },
//     paginationControls: {
//       display: 'flex',
//       justifyContent: 'center',
//       gap: '10px',
//       marginTop: '10px'
//     },
//     pageButton: {
//       background: '#f0f0f0',
//       border: '1px solid #ccc',
//       padding: '5px 10px',
//       cursor: 'pointer',
//       borderRadius: '4px'
//     }
//   };

//   return (
//     <div>
//       {loading && <div style={styles.loading}><LinearProgress /></div>}
//       {error && <div style={styles.error}>Error: {error}</div>}

//       {data?.status === "success" && data.data.responses.map((response, index) => {
//         const hasDocs = response.official_docs_responses?.length > 0;
//         const hasExternal = response.external_sources_responses?.length > 0;
//         const allCitations = response.payload_messages?.flatMap(m =>
//           m.richContent?.flatMap(group =>
//             group.flatMap(item => item.citations || [])
//           ) || []
//         ) || [];

//         const paginatedCards = allCitations.slice(
//           cardPage * cardsPerPage,
//           (cardPage + 1) * cardsPerPage
//         );

//         const totalPages = Math.ceil(allCitations.length / cardsPerPage);

//         const markdownComponents = {
//           strong: ({ node, ...props }) => <strong style={{ color: '#0089cf' }} {...props} />,
//           ul: ({ node, ...props }) => <ul style={{ margin: '10px 0' }} {...props} />,
//           li: ({ node, ...props }) => <li style={{ marginBottom: '8px' }} {...props} />
//         };

//         return (
//           <div key={index}>
//             {hasDocs && response.official_docs_responses.map((text, textIndex) => (
//               <div key={`docs-${textIndex}`} style={styles.docsResponse}>
//                 {currentTypingIndex[index] > textIndex ? (
//                   <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
//                 ) : (
//                   <TypingMarkdown
//                     text={text}
//                     isActive={currentTypingIndex[index] === textIndex}
//                     onComplete={() => {
//                       setCurrentTypingIndex(prev => ({
//                         ...prev,
//                         [index]: (prev[index] || 0) + 1
//                       }));
//                     }}
//                     speed={20}
//                     components={markdownComponents}
//                   />
//                 )}
//               </div>
//             ))}

//             {hasExternal && response.external_sources_responses.map((text, textIndex) => (
//               <div key={`external-${textIndex}`} style={styles.docsResponse}>
//                 {currentTypingIndex[index] > textIndex ? (
//                   <ReactMarkdown components={markdownComponents}>{text}</ReactMarkdown>
//                 ) : (
//                   <TypingMarkdown
//                     text={text}
//                     isActive={currentTypingIndex[index] === textIndex}
//                     onComplete={() => {
//                       setCurrentTypingIndex(prev => ({
//                         ...prev,
//                         [index]: (prev[index] || 0) + 1
//                       }));
//                     }}
//                     speed={20}
//                     components={markdownComponents}
//                   />
//                 )}
//               </div>
//             ))}

//             <div style={styles.cardRow}>
//               {paginatedCards.map((citation, idx) => (
//                 <Card key={idx} citation={citation} />
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <div style={styles.paginationControls}>
//                 {Array.from({ length: totalPages }).map((_, i) => (
//                   <button
//                     key={i}
//                     onClick={() => setCardPage(i)}
//                     style={{
//                       ...styles.pageButton,
//                       backgroundColor: i === cardPage ? '#0089cf' : '#f0f0f0',
//                       color: i === cardPage ? '#fff' : '#000'
//                     }}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {response.suggested_questions?.length > 0 && (
//               <div style={styles.suggestedQuestions}>
//                 <p><strong>Questions you may have...</strong></p>
//                 {response.suggested_questions.map((q, i) => (
//                   <button
//                     key={i}
//                     style={styles.questionButton}
//                     onClick={() => { /* Add click handler */ }}
//                   >
//                     {q}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default FinalResponse;