import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LongtermgoalsComponent } from './longtermgoals.component';

describe('LongtermgoalsComponent', () => {
  let component: LongtermgoalsComponent;
  let fixture: ComponentFixture<LongtermgoalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LongtermgoalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LongtermgoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
