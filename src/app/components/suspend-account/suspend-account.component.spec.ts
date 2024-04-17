import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendAccountComponent } from './suspend-account.component';

describe('SuspendAccountComponent', () => {
  let component: SuspendAccountComponent;
  let fixture: ComponentFixture<SuspendAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuspendAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
