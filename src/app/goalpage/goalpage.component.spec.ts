import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalpageComponent } from './goalpage.component';

describe('GoalpageComponent', () => {
  let component: GoalpageComponent;
  let fixture: ComponentFixture<GoalpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoalpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoalpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
