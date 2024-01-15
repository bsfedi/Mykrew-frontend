import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllConsultantsComponent } from './all-consultants.component';

describe('AllConsultantsComponent', () => {
  let component: AllConsultantsComponent;
  let fixture: ComponentFixture<AllConsultantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllConsultantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllConsultantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
