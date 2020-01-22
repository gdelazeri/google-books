const endpoint = 'https://www.googleapis.com/books/v1/volumes';

export default class GoogleBooksAPI {
  static async listBooks(search) {
    const path = `?q=${search.replace(/ /g, '+')}`;
    const resp = await GoogleBooksAPI.request(path);
    return resp;
  }

  static async getBook(id) {
    const path = `/${id}`;
    const resp = await GoogleBooksAPI.request(path);
    return resp;
  }

  static async request(path, isDebug) {
    try {
      const response = await fetch(`${endpoint}${path}`);
      const resp = await response.json();
      if (isDebug) { alert(JSON.stringify(resp)); console.log(resp) }
      return resp;
    } catch (error) {
      throw error;
    }
  }
}