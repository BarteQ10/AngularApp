import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendParcelComponent } from './send-parcel.component';

describe('SendParcelComponent', () => {
  let component: SendParcelComponent;
  let fixture: ComponentFixture<SendParcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendParcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendParcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
