import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionByIdComponent } from './mission-by-id.component';

describe('MissionByIdComponent', () => {
  let component: MissionByIdComponent;
  let fixture: ComponentFixture<MissionByIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionByIdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionByIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
