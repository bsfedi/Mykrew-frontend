import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllnotificationsComponent } from './allnotifications.component';

describe('AllnotificationsComponent', () => {
  let component: AllnotificationsComponent;
  let fixture: ComponentFixture<AllnotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllnotificationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllnotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
