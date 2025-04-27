export const DEFAULT_OPTIONS = {
  minWidth: 16,
  minHeight: 16,
  handleStyles: {
    position: "absolute",
    width: "15px",
    height: "15px",
    backgroundColor: "#AED2FF",
    border: "1px solid #687EFF",
  },
  overlayStyles: {
    position: "absolute",
    boxSizing: "border-box",
    border: "1px dashed #777",
    zIndex: 8,
  },
  positions: [
    { top: "0", left: "0", clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)" },
    { top: "0", right: "0", clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)" },
    { bottom: "0", left: "0", clipPath: "polygon(0% 100%, 100% 100%, 0% 0%)" },
    { bottom: "0", right: "0", clipPath: "polygon(100% 100%, 0% 100%, 100% 0%)" },
  ],
  displaySizeStyles: {
    position: 'absolute',
    fontSize: '12px',
    backgroundColor: '#AED2FF',
    color: '#191825',
    padding: '2px 4px',
    borderRadius: '4px',
    userSelect: 'none',
    pointerEvents: 'none',
  },
  displaySizePositionStyles: {
    right: '20px',
    bottom: '5px',
    left: 'auto',
  },
};
