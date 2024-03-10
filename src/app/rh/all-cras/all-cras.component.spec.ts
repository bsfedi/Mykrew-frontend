import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCrasComponent } from './all-cras.component';

describe('AllCrasComponent', () => {
  let component: AllCrasComponent;
  let fixture: ComponentFixture<AllCrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCrasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
