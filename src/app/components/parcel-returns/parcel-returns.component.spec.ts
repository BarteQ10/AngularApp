import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelReturnsComponent } from './parcel-returns.component';

describe('ParcelReturnsComponent', () => {
  let component: ParcelReturnsComponent;
  let fixture: ComponentFixture<ParcelReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelReturnsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParcelReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
