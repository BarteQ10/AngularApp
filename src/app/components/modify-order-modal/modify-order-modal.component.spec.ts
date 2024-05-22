import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyOrderModalComponent } from './modify-order-modal.component';

describe('ModifyOrderModalComponent', () => {
  let component: ModifyOrderModalComponent;
  let fixture: ComponentFixture<ModifyOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyOrderModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
