import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.module';
import {catchError, map} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {

  }


  createAndStorePost(title: string, content: string) {
    const postData: Post = {title, content};
    this.http
      .post(
        'https://ng-compleate-course.firebaseio.com/posts.json',
        postData
      )
      .subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post}>('https://ng-compleate-course.firebaseio.com/posts.json')
      .pipe(
        map( responseData => {
          const postArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postArray.push({...responseData[key], id: key});
            }
          }
          return postArray;
        }), catchError( errorRes => {
          return throwError(errorRes);
        })
      );
  }

  onDeletePosts() {
    return this.http.delete('https://ng-compleate-course.firebaseio.com/posts.json');
  }
}
