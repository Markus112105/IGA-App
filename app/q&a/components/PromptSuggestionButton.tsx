const PromptSuggestionButton = ({ text, onClick }) => {
  return (
    <button
      className="prompt-suggestion-button"
      onClick={onClick}  // will run the function passed as a prop
    >
      {text}
    </button>
  );
};

export default PromptSuggestionButton;