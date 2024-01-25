import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCraDocsComponent } from './list-cra-docs.component';

describe('ListCraDocsComponent', () => {
  let component: ListCraDocsComponent;
  let fixture: ComponentFixture<ListCraDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCraDocsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCraDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
