import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemAndSetComponent } from './mem-and-set.component';

describe('MemAndSetComponent', () => {
  let component: MemAndSetComponent;
  let fixture: ComponentFixture<MemAndSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MemAndSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemAndSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
