import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LofimusicComponent } from './lofimusic.component';

describe('LofimusicComponent', () => {
  let component: LofimusicComponent;
  let fixture: ComponentFixture<LofimusicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LofimusicComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LofimusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
