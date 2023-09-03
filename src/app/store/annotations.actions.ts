import { createAction, props } from '@ngrx/store';
import { Annotation } from './annotations.state';

export const drawImageAndAnnotationsButtonClicked = createAction(
  '[Annotation] Button Click'
);

export const loadImageSuccess = createAction(
  '[Annotation] Load Image Success',
  props<{ image: string }>()
);

export const loadImageError = createAction(
  '[Annotation] Load Image Error',
  props<{ imageError: any }>()
);

export const loadAnnotationsSuccess = createAction(
  '[Annotation] Load Annotations Success',
  props<{ annotations: Annotation[] }>()
);

export const loadAnnotationsError = createAction(
  '[Annotation] Load Annotations Error',
  props<{ annotationError: any }>()
);
