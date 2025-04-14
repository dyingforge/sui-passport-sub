export interface ParsedContent<T = unknown> {
  type: string;
  fields: T;
}

export interface UserProfile {
  avatar: string;
  collections: {
    fields: {
      id: { id: string };
      size: number;
    };
  };
  email: string;
  exhibit: string[];
  github: string;
  current_user: string;
  id: { id: string };
  introduction: string;
  last_time: number;
  name: string;
  admincap: string;
  points: number;
  x: string;
  passport_id: string;
  stamps: StampItem[];
  collection_detail: string[];
}

export interface StampItem {
  id: string;
  imageUrl: string;
  name: string;
  [key: string]: unknown;
}

export interface StampFields {
  id: { id: string };
  image_url: string;
  name: string;
  [key: string]: unknown;
}

export interface CollectionQueryResult {
  data?: {
    owner?: {
      dynamicFields?: {
        nodes?: Array<{
          name?: {
            json: string;
          };
        }>;
      };
    };
  };
}