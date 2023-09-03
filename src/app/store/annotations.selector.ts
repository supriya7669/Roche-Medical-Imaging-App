import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AnnotationsState } from './annotations.state';

export const selectAnnotationState = createFeatureSelector<AnnotationsState>('annotations');

export const selectImageData = createSelector(selectAnnotationState, (state)=> state.image);
export const selectEllipseData = createSelector(selectAnnotationState, (state)=> state.annotations);
export const selectImageError = createSelector(selectAnnotationState, (state) => state.imageError);
export const selectAnnotationsError = createSelector(selectAnnotationState, (state) => state.annotationError)