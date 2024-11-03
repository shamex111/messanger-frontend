export interface IFile {
  originalName: string;
  filename: string;
  path: string;
  size: number;
  type: 'video' | 'image' | 'other';
}
export interface IFileForShort {
  type: 'video' | 'image' | 'other';
  url: string;
}
