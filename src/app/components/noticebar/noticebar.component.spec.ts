import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticebarComponent } from './noticebar.component';

describe('NoticebarComponent', () => {
  let component: NoticebarComponent;
  let fixture: ComponentFixture<NoticebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
