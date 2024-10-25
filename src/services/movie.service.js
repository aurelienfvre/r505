import axios from "axios";
import AuthService from "./auth.service";

class MovieService {
  constructor() {
    this.api = axios;
    this.baseURL = "http://symfony.mmi-troyes.fr:8319/api";
  }

  getHeaders() {
    const token = AuthService.getToken();
    return {
      Accept: "application/ld+json",
      "Content-Type": "application/ld+json",
      Authorization: token ? `Bearer ${token}` : null,
    };
  }

  async getAllMovies() {
    try {
      let allMovies = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.api.get(`${this.baseURL}/movies`, {
          headers: this.getHeaders(),
          params: {
            page: page,
            itemsPerPage: 30,
          },
        });

        const movies = response.data["hydra:member"];
        allMovies = [...allMovies, ...movies];
        const hasNext =
          response.data["hydra:view"] &&
          response.data["hydra:view"]["hydra:next"];

        if (!hasNext || movies.length === 0) {
          hasMore = false;
        } else {
          page++;
        }
        console.log(
          `Loaded page ${page - 1} with ${movies.length} movies. Total: ${
            allMovies.length
          }`
        );
      }

      return allMovies;
    } catch (error) {
      console.error("Error fetching all movies:", error);
      throw error;
    }
  }

  async getMovie(id) {
    try {
      const response = await this.api.get(`${this.baseURL}/movies/${id}`, {
        headers: this.getHeaders(),
      });

      const movieData = response.data;
      const actors = await Promise.all(
        (movieData.actors || []).map(async (actorUrl) => {
          const actorId = actorUrl.split("/").pop();
          try {
            const actorResponse = await this.api.get(
              `${this.baseURL}/actors/${actorId}`,
              {
                headers: this.getHeaders(),
              }
            );
            return actorResponse.data;
          } catch (error) {
            console.error(`Error fetching actor ${actorId}:`, error);
            return null;
          }
        })
      );
      const categories = await Promise.all(
        (movieData.categories || []).map(async (categoryUrl) => {
          const categoryId = categoryUrl.split("/").pop();
          try {
            const categoryResponse = await this.api.get(
              `${this.baseURL}/categories/${categoryId}`,
              {
                headers: this.getHeaders(),
              }
            );
            return categoryResponse.data;
          } catch (error) {
            console.error(`Error fetching category ${categoryId}:`, error);
            return null;
          }
        })
      );

      return {
        ...movieData,
        actors: actors.filter((actor) => actor !== null),
        categories: categories.filter((category) => category !== null),
      };
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  }

  async createMovie(movieData) {
    try {
      const formattedMovie = {
        title: movieData.title || "",
        director: movieData.director || "",
        description: movieData.description || "",
        releaseDate: movieData.releaseDate
          ? new Date(movieData.releaseDate).toISOString().split("T")[0]
          : null,
        media: movieData.media || null,
        entries: 0,
        rating: movieData.rating ? parseFloat(movieData.rating) : null,
        duration: movieData.duration ? parseInt(movieData.duration) : null,
        trailer: movieData.trailer || null,
        budget: movieData.budget ? parseInt(movieData.budget) : null,
        boxOffice: movieData.boxOffice ? parseInt(movieData.boxOffice) : null,
        actors: movieData.actors || [],
        categories: movieData.categories || [],
      };

      console.log("Sending formatted movie data:", formattedMovie);

      const response = await this.api.post(
        `${this.baseURL}/movies`,
        formattedMovie,
        {
          headers: this.getHeaders(),
        }
      );
      const newMovie = await this.getMovie(response.data.id);
      return newMovie;
    } catch (error) {
      console.error("Error creating movie:", error);
      if (error.response) {
        console.error("Server error details:", error.response.data);
      }
      throw error;
    }
  }

  async updateMovie(id, movieData) {
    try {
      const formattedMovie = {
        title: movieData.title,
        director: movieData.director,
        description: movieData.description,
        releaseDate: movieData.releaseDate,
        media: movieData.media,
        rating: movieData.rating ? parseFloat(movieData.rating) : null,
        duration: movieData.duration ? parseInt(movieData.duration) : null,
        trailer: movieData.trailer,
        budget: movieData.budget ? parseInt(movieData.budget) : null,
        boxOffice: movieData.boxOffice ? parseInt(movieData.boxOffice) : null,
        actors: movieData.actors,
        categories: movieData.categories,
      };

      const response = await this.api.patch(
        `${this.baseURL}/movies/${id}`,
        formattedMovie,
        {
          headers: {
            ...this.getHeaders(),
            "Content-Type": "application/merge-patch+json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  }

  async deleteMovie(id) {
    try {
      await this.api.delete(`${this.baseURL}/movies/${id}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  }

  async addActorToMovie(movieId, actorId) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/movies/${movieId}/actors`,
        {
          actor: `/api/actors/${actorId}`,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding actor to movie:", error);
      throw error;
    }
  }

  async removeActorFromMovie(movieId, actorId) {
    try {
      await this.api.delete(
        `${this.baseURL}/movies/${movieId}/actors/${actorId}`,
        {
          headers: this.getHeaders(),
        }
      );
      return true;
    } catch (error) {
      console.error("Error removing actor from movie:", error);
      throw error;
    }
  }

  async addCategoryToMovie(movieId, categoryId) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/movies/${movieId}/categories`,
        {
          category: `/api/categories/${categoryId}`,
        },
        {
          headers: this.getHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding category to movie:", error);
      throw error;
    }
  }

  async removeCategoryFromMovie(movieId, categoryId) {
    try {
      await this.api.delete(
        `${this.baseURL}/movies/${movieId}/categories/${categoryId}`,
        {
          headers: this.getHeaders(),
        }
      );
      return true;
    } catch (error) {
      console.error("Error removing category from movie:", error);
      throw error;
    }
  }
}

export default new MovieService();
