export type Item = {
  _id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  slug?: string;
  name: string;
  isLocked?: boolean;
};

export type Props = {
  data: Item[];
  width?: number;
  height?: number;
  name?: string;
  slug?: string;
  loading?: boolean;

  button?: boolean;
  onViewMore?: (slug?: string) => void;
};

export type VideoLayoutInterface = {
  id: string;
  slug: string;
  thumbnail: string;
  title: string;
  views: number;
  lock: boolean;
};
