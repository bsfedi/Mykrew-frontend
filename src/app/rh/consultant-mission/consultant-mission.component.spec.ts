import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantMissionComponent } from './consultant-mission.component';

describe('ConsultantMissionComponent', () => {
  let component: ConsultantMissionComponent;
  let fixture: ComponentFixture<ConsultantMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultantMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
