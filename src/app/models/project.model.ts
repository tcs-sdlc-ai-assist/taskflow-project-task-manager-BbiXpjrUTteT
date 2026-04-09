export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export const PROJECT_COLORS: string[] = [
  'blue',
  'green',
  'red',
  'purple',
  'orange',
  'teal',
  'pink',
  'yellow',
  'indigo',
  'cyan'
];

export const PROJECT_NAME_MAX_LENGTH = 64;
export const PROJECT_DESCRIPTION_MAX_LENGTH = 256;