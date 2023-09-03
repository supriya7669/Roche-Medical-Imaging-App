export interface Annotation {
  id: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
}

export interface AnnotationsState {
  image: string;
  annotations: Annotation[];
  imageError: string;
  annotationError: string;
}
