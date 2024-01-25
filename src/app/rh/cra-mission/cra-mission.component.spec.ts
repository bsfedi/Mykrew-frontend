import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CraMissionComponent } from './cra-mission.component';

describe('CraMissionComponent', () => {
  let component: CraMissionComponent;
  let fixture: ComponentFixture<CraMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CraMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CraMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
