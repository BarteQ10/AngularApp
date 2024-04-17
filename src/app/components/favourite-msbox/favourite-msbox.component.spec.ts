import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteMSBOXComponent } from './favourite-msbox.component';

describe('FavouriteMSBOXComponent', () => {
  let component: FavouriteMSBOXComponent;
  let fixture: ComponentFixture<FavouriteMSBOXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteMSBOXComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FavouriteMSBOXComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
