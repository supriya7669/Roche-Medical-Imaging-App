import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationComponent } from './annotation.component';
import { DataService } from '../services/data.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StateObservable, Store, StoreModule } from '@ngrx/store';

describe('AnnotationComponent', () => {
  let component: AnnotationComponent;
  let fixture: ComponentFixture<AnnotationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnotationComponent],
      imports:[HttpClientTestingModule, StoreModule.forRoot({})],
      providers: [DataService, Store, StateObservable,],
    });
    fixture = TestBed.createComponent(AnnotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
