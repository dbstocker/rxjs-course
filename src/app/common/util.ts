import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
  return Observable.create((observer) => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request failed with status code: " + response.status);
        }
        // return response.json();
      })
      .then((body) => {
        observer.next(body);

        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    return () => controller.abort();
  });
}

// Understand why this doesn't work the same way
export function createHttpObservable$(url: string) {
  const controller = new AbortController();
  const signal = controller.signal;
  
  return new Observable((observer) => {
    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error('the http request failed with code ' + response.status);
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });

    return () => controller.abort();
  });
}
