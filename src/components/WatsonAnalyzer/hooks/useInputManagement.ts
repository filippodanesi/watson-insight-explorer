
import { useState } from 'react';
import { calculateTextStats } from '../utils/mockDataUtils';

export interface TextStats {
  wordCount: number;
  sentenceCount: number;
  charCount: number;
}

export const useInputManagement = () => {
  // Input state
  const [text, setText] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const [targetKeywords, setTargetKeywords] = useState("");
  
  // Text statistics
  const [textStats, setTextStats] = useState<TextStats>({
    wordCount: 0,
    sentenceCount: 0,
    charCount: 0,
  });
  
  // Calculate text stats
  const updateTextStats = (text: string) => {
    const stats = calculateTextStats(text);
    setTextStats(stats);
    return stats;
  };
  
  // Process target keywords into an array
  const getTargetKeywordsList = () => {
    return targetKeywords
      .split(',')
      .map(kw => kw.trim())
      .filter(Boolean);
  };
  
  return {
    text,
    setText,
    inputMethod,
    setInputMethod,
    targetKeywords,
    setTargetKeywords,
    textStats,
    updateTextStats,
    getTargetKeywordsList,
  };
};
