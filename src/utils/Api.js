class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.headers = options.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  _executeGetRequest(path) {
    return fetch(this.baseUrl + path, {
      headers: this.headers,
    }).then(this._checkResponse);
  }

  getUserInfo() {
    return this._executeGetRequest("/users/me");
  }

  getInitialCards() {
    return this._executeGetRequest("/cards");
  }

  _executePatchRequest(path, data) {
    return fetch(this.baseUrl + path, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(data),
    }).then(this._checkResponse);
  }

  patchUserInfo(data) {
    return this._executePatchRequest("/users/me", data);
  }

  patchUserAvatar(data) {
    return this._executePatchRequest("/users/me/avatar", data);
  }

  postCard({ name, link }) {
    return fetch(this.baseUrl + "/cards", {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: name,
        link: link,
      }),
    }).then(this._checkResponse);
  }

  _executeDeleteRequest(path) {
    return fetch(this.baseUrl + path, {
      method: "DELETE",
      headers: this.headers,
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return this._executeDeleteRequest("/cards/" + cardId);
  }

  deleteLikes(cardId) {
    return this._executeDeleteRequest("/cards/" + cardId + "/likes");
  }

  putLikes(cardId) {
    return fetch(this.baseUrl + "/cards/" + cardId + "/likes", {
      method: "PUT",
      headers: this.headers,
    }).then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-51",
  headers: {
    authorization: "ebf86856-a284-4e90-886b-0c35ff6da9d7",
    "Content-Type": "application/json",
  },
});

export default api;
