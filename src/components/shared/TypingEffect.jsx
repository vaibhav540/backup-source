import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "@mui/material/styles";

const TableWrapper = ({ node, ...props }) => {
  const theme = useTheme();
  const tableRef = useRef(null);
  const [columnCount, setColumnCount] = useState(0);

  useEffect(() => {
    if (!tableRef.current) return;

    const observer = new MutationObserver(() => {
      const columns = tableRef.current.querySelectorAll('th').length;
      setColumnCount(columns);
    });

    observer.observe(tableRef.current, { 
      childList: true, 
      subtree: true,
      attributes: true,
      characterData: true
    });

    const initialColumns = tableRef.current.querySelectorAll('th').length;
    setColumnCount(initialColumns);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`table-container ${columnCount > 5 ? 'scrollable' : ''}`}>
      <table 
        ref={tableRef} 
        className="custom-table"
        {...props}
        style={{
          borderLeft: `1px solid ${theme.palette.divider}`,
          borderRight: `1px solid ${theme.palette.divider}`,
          minWidth: columnCount > 5 ? `${(columnCount / 5) * 100}%` : '100%'
        }}
      />
    </div>
  );
};

const TypingEffect = ({
  text,
  speed,
  onComplete,
  isActive,
  messageId,
  onTextUpdate,
  oldChat,
  style,
}) => {
  const theme = useTheme();
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);
  const isCompleted = useRef(false);

  useEffect(() => {
    if (oldChat) {
      setDisplayedText(text);
      isCompleted.current = true;
    } else {
      setDisplayedText("");
      setIndex(0);
      isCompleted.current = false;
    }
  }, [text, oldChat]);

  useEffect(() => {
    if (!text || !isActive) return;

    if (index < text.length) {
      const timeout = setTimeout(() => {
        const newDisplayedText = displayedText + text[index];
        setDisplayedText(newDisplayedText);
        setIndex(index + 1);

        if (onTextUpdate) {
          onTextUpdate(messageId, newDisplayedText);
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else if (!isCompleted.current) {
      isCompleted.current = true;
      if (onComplete) {
        onComplete(messageId);
      }
    }
  }, [index, text, speed, onComplete, isActive, messageId, displayedText, onTextUpdate]);

  return (
    <div ref={containerRef} className="typing-effect-container" style={style}>
      <style jsx global>{`
        .table-container {
          width: 100%;
          margin: 20px 0;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          background: ${theme.palette.background.paper};
        }

        .table-container.scrollable {
          overflow-x: auto;
          padding-bottom: 6px;
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          table-layout: fixed;
          background: ${theme.palette.background.paper};
          color: ${theme.palette.text.primary};
        }

        .custom-table th,
        .custom-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid ${theme.palette.divider};
          /* Allow text to wrap and show full content */
          white-space: normal;
          word-break: break-word;
          /* Remove truncation styles */
          /* overflow: hidden; */
          /* text-overflow: ellipsis; */
          width: 20%;  // Show 5 columns in initial view
          min-width: 120px;
        }

        .custom-table th {
          font-weight: 600;
          background-color: ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.08)' 
            : 'rgba(0, 0, 0, 0.04)'};
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .custom-table tr:hover td {
          background-color: ${theme.palette.action.hover};
        }

        /* Scrollbar Styling */
        .table-container.scrollable::-webkit-scrollbar {
          height: 8px;
          background: ${theme.palette.background.default};
        }

        .table-container.scrollable::-webkit-scrollbar-thumb {
          background: ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 4px;
          border: 2px solid ${theme.palette.background.default};
        }

        .table-container.scrollable::-webkit-scrollbar-thumb:hover {
          background: ${theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.3)' 
            : 'rgba(0, 0, 0, 0.3)'};
        }

        /* Column Borders */
        .custom-table td:not(:last-child),
        .custom-table th:not(:last-child) {
          border-right: 1px solid ${theme.palette.divider};
        }
      `}</style>

      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => (
            <p style={{ padding: 0, margin: 0 }} {...props} />
          ),
          h1: ({ node, ...props }) => <h1 className="custom-h1" {...props} />,
          h2: ({ node, ...props }) => <h2 className="custom-h2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="custom-h3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="custom-h4" {...props} />,
          h5: ({ node, ...props }) => <h5 className="custom-h5" {...props} />,
          h6: ({ node, ...props }) => <h6 className="custom-h5" {...props} />,
          table: ({ node, ...props }) => <TableWrapper {...props} />,
          thead: ({ node, ...props }) => <thead className="custom-thead" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="custom-tbody" {...props} />,
          tr: ({ node, ...props }) => <tr className="custom-tr" {...props} />,
          th: ({ node, ...props }) => <th className="custom-th" {...props} />,
          td: ({ node, ...props }) => <td className="custom-td" {...props} />,
        }}
      >
        {displayedText}
      </Markdown>
    </div>
  );
};

export default TypingEffect;