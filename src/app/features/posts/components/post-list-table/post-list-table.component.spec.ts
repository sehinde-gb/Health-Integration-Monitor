import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PostListTableComponent } from './post-list-table.component';
import { Post } from '../../models/post';
import { By } from '@angular/platform-browser';

describe('PostListTableComponent', () => {
  let component: PostListTableComponent;
  let fixture: ComponentFixture<PostListTableComponent>;

  const postsMock: Post[] = [
    {
      id: 1,
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
    },
    {
      id: 2,
      patientId: 'P-00002',
      patientName: 'Patient 2',
      messageType: 'ORU^R01',
      status: 'Failed',
      lastUpdated: '2026-06-11T15:04:40.033Z'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListTableComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PostListTableComponent);
    component = fixture.componentInstance;
  });

  it('calls deletePost and emits with the post id when delete button clicked', () => {
    fixture.componentRef.setInput('posts', postsMock);
    spyOn(component.deletePost, 'emit');

    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('button.btn-danger'));
    deleteBtn.nativeElement.click();

    expect(component.deletePost.emit).toHaveBeenCalledWith(1);
  });

  it('calls deletePost and emits with the correct id when second delete is clicked', () => {
    fixture.componentRef.setInput('posts', postsMock);
    spyOn(component.deletePost, 'emit');

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    const secondRowDeleteBtn = rows[1].query(By.css('button.btn-danger'));
    secondRowDeleteBtn.nativeElement.click();

    expect(component.deletePost.emit).toHaveBeenCalledWith(2);
  });

  it('renders correct hrefs for View and Edit links', async () => {
    fixture.componentRef.setInput('posts', [postsMock[0]]);

    fixture.detectChanges();
    await fixture.whenStable();

    const firstRow = fixture.debugElement.queryAll(By.css('tbody tr'))[0];

    const viewA: HTMLAnchorElement = firstRow.query(By.css('a.btn.btn-info')).nativeElement;
    const editA: HTMLAnchorElement = firstRow.query(By.css('a.btn.btn-primary')).nativeElement;

    expect(viewA.getAttribute('href')).toContain('/post/1/view');
    expect(editA.getAttribute('href')).toContain('/post/1/edit');
  });

  it('shows "No patient records found" when posts is empty', () => {
    fixture.componentRef.setInput('posts', []);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No patient records found');

    const buttons = fixture.debugElement.queryAll(By.css('button.btn-danger'));
    expect(buttons.length).toBe(0);
  });

  it('renders rows per patient record', () => {
    fixture.componentRef.setInput('posts', postsMock);

    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));

    expect(fixture.nativeElement.textContent).not.toContain('No patient records found');
    expect(rows.length).toBe(postsMock.length);

    expect(rows[0].nativeElement.textContent).toContain('P-00001');
    expect(rows[0].nativeElement.textContent).toContain('Patient 1');
    expect(rows[0].nativeElement.textContent).toContain('ADT^A01');
    expect(rows[0].nativeElement.textContent).toContain('Processed');

    expect(rows[1].nativeElement.textContent).toContain('P-00002');
    expect(rows[1].nativeElement.textContent).toContain('Patient 2');
    expect(rows[1].nativeElement.textContent).toContain('ORU^R01');
    expect(rows[1].nativeElement.textContent).toContain('Failed');
  });
});
