import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachinesLeafletComponent } from './machines-leaflet.component';

describe('MachinesLeafletComponent', () => {
  let component: MachinesLeafletComponent;
  let fixture: ComponentFixture<MachinesLeafletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MachinesLeafletComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MachinesLeafletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
