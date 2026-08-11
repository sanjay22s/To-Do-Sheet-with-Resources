export type ItemType = 'DSA_PROBLEM' | 'LEARNING' | 'PROJECT';
export type ResourceType = 'FOLDER' | 'RESOURCE';

export type RoadmapItem = {
  id: number;
  categorySlug: string;
  type: ItemType;
  title: string;
  completed: boolean;
  topic: string | null;
  slotNumber: number | null;
  difficulty: string | null;
  youtubeUrl: string | null;
  leetcodeUrl: string | null;
};

export type Category = {
  id: number;
  slug: string;
  title: string;
  displayOrder: number;
  progressTracked: boolean;
  completedCount: number;
  totalCount: number;
  progress: number;
  items: RoadmapItem[];
  topics: Record<string, RoadmapItem[]>;
};

export type PlacementResource = {
  id: number;
  title: string;
  url: string | null;
  type: ResourceType;
  parentId: number | null;
};

export type RoadmapResponse = {
  categories: Category[];
  resources: PlacementResource[];
  overall: {
    completedCount: number;
    totalCount: number;
    progress: number;
  };
};

export type AuthResponse = {
  token: string;
  name: string;
  email: string;
};
