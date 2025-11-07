import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({onPromptClick}) => {
  const prompts = [
    "Tell me about International Girls Academy",
    "What is the International Girls Academy Scholarship?",
    "What are the events hosted by International Girls Academy",
  ]

    return (
    <div className="prompt-suggestion-row">
        {prompts.map((prompt, index) =>
        <PromptSuggestionButton
            key={`suggestion-${index}`}
            text={prompt}
            onClick={() => onPromptClick(prompt)}
        />
        )}
    </div>
    )
}

export default PromptSuggestionsRow