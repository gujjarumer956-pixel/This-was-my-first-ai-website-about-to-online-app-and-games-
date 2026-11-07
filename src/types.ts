export type AppCategory = 'game' | 'app' | 'simulation' | 'creative';

export type GameGenre = 
  | 'arcade' 
  | 'action' 
  | 'physics' 
  | 'puzzle' 
  | 'creative-tool' 
  | 'generative';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  rating: number;
}

export interface CreationItem {
  id: string;
  title: string;
  tagline: string;
  category: AppCategory;
  genre: GameGenre;
  description: string;
  instructions: string;
  thumbnail: string;
  aiModel: string;
  prompt: string;
  techStack: string[];
  version: string;
  releaseDate: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  metrics: {
    plays: number;
    upvotes: number;
    rating: number;
  };
  codeSnippet: string;
  featured?: boolean;
  gameEngineType?: 'cyber-rogue' | 'neural-orbit' | 'promptmorph' | 'retro-runner' | 'custom-script';
  customScript?: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  title: string;
  bio: string;
  avatar: string;
  links: {
    github?: string;
    x?: string;
    portfolio?: string;
  };
  badges: string[];
}
