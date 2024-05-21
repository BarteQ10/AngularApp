import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteMsboxModalComponent } from './favourite-msbox-modal.component';

describe('FavouriteMsboxModalComponent', () => {
  let component: FavouriteMsboxModalComponent;
  let fixture: ComponentFixture<FavouriteMsboxModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteMsboxModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavouriteMsboxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
