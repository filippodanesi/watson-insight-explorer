
import React from 'react';
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ToneTabProps {
  classifications: any[];
}

// Funzione per ottenere il colore del badge in base al tono in stile minimal
const getToneColor = (toneName: string) => {
  switch (toneName) {
    case 'excited': return 'bg-gray-900 hover:bg-gray-950';
    case 'satisfied': return 'bg-gray-800 hover:bg-gray-900';
    case 'polite': return 'bg-gray-700 hover:bg-gray-800';
    case 'sympathetic': return 'bg-gray-600 hover:bg-gray-700';
    case 'frustrated': return 'bg-gray-500 hover:bg-gray-600';
    case 'sad': return 'bg-gray-400 hover:bg-gray-500 text-gray-900';
    case 'impolite': return 'bg-gray-300 hover:bg-gray-400 text-gray-900';
    default: return 'bg-gray-200 text-gray-900';
  }
};

// Funzione per ottenere il colore della progress bar
const getProgressColor = (toneName: string) => {
  switch (toneName) {
    case 'excited': return 'bg-gray-900';
    case 'satisfied': return 'bg-gray-800';
    case 'polite': return 'bg-gray-700';
    case 'sympathetic': return 'bg-gray-600';
    case 'frustrated': return 'bg-gray-500';
    case 'sad': return 'bg-gray-400';
    case 'impolite': return 'bg-gray-300';
    default: return 'bg-gray-200';
  }
};

const ToneTab: React.FC<ToneTabProps> = ({ classifications }) => {
  if (!classifications || classifications.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <AlertCircle size={16} />
          <p>No tone analysis results found.</p>
        </div>
      </div>
    );
  }

  // Ordina i toni per confidenza (dal più alto al più basso)
  const sortedTones = [...classifications].sort((a, b) => b.confidence - a.confidence);

  // Descrizioni dei toni
  const toneDescriptions: Record<string, string> = {
    'excited': 'Showing personal enthusiasm and interest',
    'frustrated': 'Feeling annoyed and irritable',
    'impolite': 'Being disrespectful and rude',
    'polite': 'Displaying rational, goal-oriented behavior',
    'sad': 'An unpleasant passive emotion',
    'satisfied': 'An affective response to perceived service quality',
    'sympathetic': 'An affective mode of understanding that involves emotional resonance'
  };

  return (
    <div className="space-y-8">
      {/* Visualization section - Grafico a barre */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Tone Strength Visualization</h3>
        <div className="space-y-3">
          {sortedTones.map((tone, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <Badge className={`${getToneColor(tone.class_name)}`}>
                    {tone.class_name}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{toneDescriptions[tone.class_name]}</span>
                </div>
                <div>{(tone.confidence * 100).toFixed(1)}%</div>
              </div>
              <Progress 
                value={tone.confidence * 100} 
                className="h-2" 
                indicatorClassName={getProgressColor(tone.class_name)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Detailed table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tone</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTones.map((tone, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge className={`${getToneColor(tone.class_name)}`}>
                  {tone.class_name}
                </Badge>
              </TableCell>
              <TableCell>{toneDescriptions[tone.class_name]}</TableCell>
              <TableCell>{(tone.confidence * 100).toFixed(1)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToneTab;
