import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NaturesoundsComponent } from './naturesounds.component';

describe('NaturesoundsComponent', () => {
  let component: NaturesoundsComponent;
  let fixture: ComponentFixture<NaturesoundsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NaturesoundsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NaturesoundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
