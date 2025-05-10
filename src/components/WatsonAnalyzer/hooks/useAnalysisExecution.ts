
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { TextStats } from './useInputManagement';
import { WatsonFeatures, WatsonLimits } from './useAnalysisFeatures';

interface AnalysisExecutionProps {
  text: string;
  features: WatsonFeatures;
  limits: WatsonLimits;
  language: string;
  toneModel: string;
  getCurrentApiKey: () => string;
  getCurrentUrl: () => string;
  getAuthType: () => string;
  updateTextStats: (text: string) => TextStats;
}

export const useAnalysisExecution = ({
  text,
  features,
  limits,
  language,
  toneModel,
  getCurrentApiKey,
  getCurrentUrl,
  getAuthType,
  updateTextStats
}: AnalysisExecutionProps) => {
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Get current credentials
    const currentApiKey = getCurrentApiKey();
    const currentUrl = getCurrentUrl();

    if (!currentApiKey) {
      toast({
        title: "API Key required",
        description: "Please enter your IBM Watson NLU API key or enable secrets.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUrl) {
      toast({
        title: "URL required",
        description: "Please provide a valid URL for the IBM Watson NLU service.",
        variant: "destructive",
      });
      return;
    }

    // Check for tone analysis - only available for en and fr
    if (features.classifications && language !== "en" && language !== "fr") {
      toast({
        title: "Unsupported language",
        description: "Tone analysis is only available for English and French languages.",
        variant: "destructive",
      });
      return;
    }

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const stats = updateTextStats(text);

    // Prepare parameters for API request
    const featuresParams: any = {};
    
    if (features.keywords) {
      featuresParams.keywords = { 
        limit: limits.keywords,
        sentiment: true 
      };
    }
    
    if (features.entities) {
      featuresParams.entities = { 
        limit: limits.entities,
        sentiment: true 
      };
    }
    
    if (features.concepts) {
      featuresParams.concepts = { 
        limit: limits.concepts 
      };
    }
    
    if (features.relations) {
      featuresParams.relations = {};
    }
    
    if (features.categories) {
      featuresParams.categories = { 
        limit: limits.categories 
      };
    }
    
    if (features.classifications) {
      featuresParams.classifications = {
        model: toneModel
      };
    }

    const requestData = {
      text: text,
      features: featuresParams,
      language: language
    };

    try {
      console.log('Sending request to:', currentUrl);
      
      // Determine the authentication method based on environment variables
      const authType = getAuthType();
      let headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header based on auth type
      if (authType === "iam") {
        headers['Authorization'] = `Basic ${btoa(`apikey:${currentApiKey}`)}`;
      } else {
        headers['Authorization'] = `Bearer ${currentApiKey}`;
      }

      const response = await fetch(currentUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'API request failed';
        
        try {
          // Try to parse as JSON if possible
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || `Error ${response.status}: ${response.statusText}`;
        } catch (e) {
          // If not JSON, use status text or the raw error text
          errorMessage = response.status === 404 ? 
            'Service URL not found (404). Please check your API endpoint.' : 
            `Error ${response.status}: ${response.statusText || errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analysis completed",
        description: "The text was successfully analyzed.",
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      
      // Improved error message
      const errorMessage = error instanceof Error ? error.message : "An error occurred during analysis.";
      
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    results,
    handleAnalyze
  };
};
