const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPointMovies = null;
  #endPointComments = null;
  #authorization = null;

  constructor(endPointMovies, endPointComments, authorization) {
    this.#endPointMovies = endPointMovies;
    this.#endPointComments = endPointComments;
    this.#authorization = authorization;
  }

  get films() {
    return this.#loadMovies({url: ''})
      .then(ApiService.parseResponse);
  }

  get comments() {
    return this.#loadComments({url: ''})
      .then(ApiService.parseResponse);
  }

  updateFIlms = async (film) => {
    const response = await this.#loadMovies({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #loadMovies = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPointMovies}/${url}`,
      // `${this.#endPointComments}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #loadComments = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPointComments}/${url}`,
      // `${this.#endPointComments}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
