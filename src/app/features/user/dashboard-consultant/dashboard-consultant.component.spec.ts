import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardConsultantComponent } from './dashboard-consultant.component';

describe('DashboardConsultantComponent', () => {
  let component: DashboardConsultantComponent;
  let fixture: ComponentFixture<DashboardConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardConsultantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
