import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as AnnotationActions from '../store/annotations.actions';
import { Observable, catchError, of, switchMap } from 'rxjs';
import {
  selectEllipseData,
  selectImageData,
} from '../store/annotations.selector';
import { Annotation } from '../store/annotations.state';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
})
export class AnnotationComponent implements AfterViewInit {
  private ctx: CanvasRenderingContext2D;
  @ViewChild('myCanvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  image$: Observable<any>;
  ellipses$: Observable<Annotation[]>;
  errorImage$: Observable<any>;
  errorEllipse$: Observable<any>;

  imageData: string | null = null;
  ellipseData: Annotation[] = [];

  constructor(private store: Store, private dataService: DataService) {}

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  /**
   * @description
   * Fetch image data from DataService on button click
   * Dispatch Action with image data to save in the store
   * @memberof AnnotationComponent
   */
  fetchImageDataAndDispatchActions() {
    this.store.dispatch(
      AnnotationActions.drawImageAndAnnotationsButtonClicked()
    );

    this.dataService
      .fetchImageData()
      .pipe(
        switchMap((imageData) => {
          this.store.dispatch(
            AnnotationActions.loadImageSuccess({ image: imageData })
          );
          return of(imageData);
        }),
        catchError((error) => {
          this.handleImageError(error);
          return of(null);
        })
      )
      .subscribe((imageData) => {
        if (imageData !== null) {
          this.imageData = imageData;
        }
        this.fetchEllipseDataAndDispatchActions();
      });
  }

  /**
   * @description
   * Fetch ellipse data from DataService on button click
   * Dispatch Actions with ellipse data to save in the store
   * @memberof AnnotationComponent
   */
  fetchEllipseDataAndDispatchActions() {
    this.dataService
      .fetchEllipseData()
      .pipe(
        switchMap((annotationsData) => {
          this.store.dispatch(
            AnnotationActions.loadAnnotationsSuccess({
              annotations: annotationsData,
            })
          );
          return of(annotationsData);
        }),
        catchError((error) => {
          this.handleEllipseError(error);
          return of(null);
        })
      )
      .subscribe((annotationsData) => {
        if (annotationsData !== null) {
          this.ellipseData = annotationsData;
        }
        this.selectDataFromStore();
      });
  }

  /**
   * @description
   * Use the selectAnnotations selector to retrieve the Image and Ellipse data
   * @memberof AnnotationComponent
   */
  selectDataFromStore() {
    this.image$ = this.store.select(selectImageData);
    this.image$.subscribe((imageResponse) => {
      if (imageResponse) {
        this.imageData = imageResponse;
      }
    });

    this.ellipses$ = this.store.select(selectEllipseData);
    this.ellipses$.subscribe((ellipseResponse) => {
      if (ellipseResponse) {
        this.ellipseData = ellipseResponse;
      }
    });
    this.drawImageAndEllipse(this.imageData, this.ellipseData);
  }

  /**
   * @description
   * Use the retrieved Image and Ellipse data to draw on canvas
   * @memberof AnnotationComponent
   */
  drawImageAndEllipse(imageData, ellipseData) {
    if (imageData) {
      const blob = new Blob([imageData], { type: 'octet/stream' });
      const image = new Image();
      image.src = window.URL.createObjectURL(blob);
      image.onload = () => {
        console.log('Image loaded successfully.');

        this.ctx.drawImage(
          image,
          0,
          0,
          this.canvas.nativeElement.width,
          this.canvas.nativeElement.height
        );
        this.drawEllipse(ellipseData);
      };
    } else {
      console.log('error occured for image');
    }
  }

  /**
   * @description
   * Use the retrieved Ellipse data to draw on canvas
   * @memberof AnnotationComponent
   */
  drawEllipse(ellipseData) {
    this.ctx.strokeStyle = 'white';
    if (ellipseData && ellipseData.message) {
      const jsonData = JSON.parse(ellipseData.message);
      console.log('Ellipse loaded successfully.');

      jsonData.forEach((ellipse) => {
        this.ctx.beginPath();
        this.ctx.ellipse(
          ellipse.x,
          ellipse.y,
          ellipse.radiusX,
          ellipse.radiusY,
          0,
          0,
          Math.PI * 2
        );
        this.ctx.stroke();
      });
    } else {
      console.log('error occured for ellipse');
    }
  }

  /**
   * @description
   * Handle errors for Image by dispatching error action
   * @memberof AnnotationComponent
   */
  handleImageError(errorMessage) {
    this.store.dispatch(
      AnnotationActions.loadImageError({ imageError: errorMessage })
    );

    this.errorImage$ = this.store.select(AnnotationActions.loadImageError);
    this.errorImage$.subscribe((error) => {
      if (error) {
        console.log('error for Image', error);
      }
    });
  }

  /**
   * @description
   * Handle errors for Ellipse by dispatching error action
   * @memberof AnnotationComponent
   */
  handleEllipseError(errorMessage) {
    this.store.dispatch(
      AnnotationActions.loadAnnotationsError({ annotationError: errorMessage })
    );

    this.errorEllipse$ = this.store.select(
      AnnotationActions.loadAnnotationsError
    );
    this.errorEllipse$.subscribe((error) => {
      if (error) {
        console.log('error for Ellipse', error);
      }
    });
  }
}
