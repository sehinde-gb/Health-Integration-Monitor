import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { PostService } from './post.service';
import { Post } from '../models/post';
import { CreatePostDto } from '../models/post.dto';
import { UpdatePostDto } from '../models/post.dto';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PostService', () => {
  // Test variables
  let service: PostService;
  let httpMock: HttpTestingController;

  const mockPost: Post = {
      id: 1,
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
  };

  const mockPost2: Post = {
      id: 2,
      patientId: 'P-00002',
      patientName: 'Patient 2',
      messageType: 'ORU^R01',
      status: 'Failed',
      lastUpdated: '2026-06-11T15:04:40.033Z'
  };

  // TestBed setup runs before each test
  beforeEach(() => {
      TestBed.configureTestingModule({
      imports: [],
      providers: [PostService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /*
  Success paths
  Tests that verify the service sends the correct HTTP request
  and maps the expected response
*/

    it('should create a post (POST)', () => {
    // ARRANGE
    const payload: CreatePostDto = {
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
    };

    const mockResponse: Post = {
      ...mockPost,
      ...payload
    };

    let actual!: Post;

    // ACT
    service.create(payload).subscribe((res) => {
      actual = res;
    });

    // ASSERT
    const req = httpMock.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    // FLUSH Response to API
    req.flush(mockResponse);

    expect(actual).toEqual(mockResponse);
  });

  it('should fetch all posts (GET)', () => {
    // ARRANGE
    const mockPosts: Post[] = [
      { ...mockPost },
      { ...mockPost2 },
    ];

    // ACT
    service.getAll().subscribe((posts) => {
      expect(posts.length).toBe(2);
      expect(posts).toEqual(mockPosts);
    });

   // ASSERT
    const req = httpMock.expectOne(`${environment.apiUrl}/posts`);
    expect(req.request.method).toBe('GET');

    // FLUSH response to mock API
    req.flush(mockPosts);
  });

  it('should fetch a single post by id (GET)', () => {
    // ARRANGE
    const mockPost: Post = {
      id: 1,
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
    };


    // ACT
    service.find(1).subscribe((post) => {
      expect(post).toEqual(mockPost);
    });

    // ASSERT
    const req = httpMock.expectOne(`${environment.apiUrl}/posts/1`);
    expect(req.request.method).toBe('GET');

    // Response from mock API
    req.flush(mockPost);
  });

  it('it should update a post (PUT)', () => {
    // ARRANGE
   const payload: CreatePostDto = {
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
   };

    const mockResponse: Post = {
      id: 101,
      ...payload
    };

    // ACT
    service.update(1, payload).subscribe((post) =>{
      expect(post).toEqual(mockResponse);
    });

    // ASSERT
    const req = httpMock.expectOne(`${environment.apiUrl}/posts/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    // FLUSH
    req.flush(mockResponse);

  });


  it('it should delete a post (DELETE)', () => {
    // ARRANGE
    const postId = 1;

    // ACT
    service.delete(postId).subscribe((res) => {
      // Here I am being explicit however you can remove this typing from this method and it will still be OK
      expect(res).toBeNull();
    });

    //EXPECT pause the test and give me the Http request that was made
    const req = httpMock.expectOne(`${environment.apiUrl}/posts/${postId}`);
    // Expect the method to be delete
    expect(req.request.method).toBe('DELETE');


    // FLUSH a null response body for DELETE
    req.flush(null); // or req.flush(void 0)

  });











});
