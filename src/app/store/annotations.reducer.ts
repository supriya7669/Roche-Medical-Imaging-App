import { createReducer, on } from '@ngrx/store';
import { AnnotationsState } from './annotations.state';
import * as AnnotationActions from './annotations.actions';

export const initialState: AnnotationsState = {
  annotations: [],
  image: '',
  imageError: null,
  annotationError: null
};

export const annotationReducer = createReducer(
  initialState,
  on(AnnotationActions.drawImageAndAnnotationsButtonClicked, (state) => ({
    ...state,
  })),

  on(AnnotationActions.loadImageSuccess, (state, { image }) => ({
    ...state,
    image,
  })),
  on(AnnotationActions.loadImageError, (state, { imageError }) => ({
    ...state,
    imageError,
  })),
  on(AnnotationActions.loadAnnotationsSuccess, (state, { annotations }) => ({
    ...state,
    annotations,
  })),
  on(AnnotationActions.loadAnnotationsError, (state, { annotationError }) => ({
    ...state,
    annotationError,
  }))
);
