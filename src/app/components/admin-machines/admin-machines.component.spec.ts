import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMachinesComponent } from './admin-machines.component';

describe('AdminMachinesComponent', () => {
  let component: AdminMachinesComponent;
  let fixture: ComponentFixture<AdminMachinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMachinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMachinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
