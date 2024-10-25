import axios from "axios";

class CategoryService {
  constructor() {
    this.api = axios;
    this.baseURL = "http://symfony.mmi-troyes.fr:8319/api";
  }

  async getAllCategories() {
    try {
      const response = await this.api.get(`${this.baseURL}/categories`, {
        headers: {
          Accept: "application/ld+json",
        },
      });
      return response.data["hydra:member"];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getCategory(id) {
    try {
      const response = await this.api.get(`${this.baseURL}/categories/${id}`, {
        headers: {
          Accept: "application/ld+json",
        },
      });

      const categoryData = response.data;
      const movies = await Promise.all(
        categoryData.movies.map(async (movieUrl) => {
          const movieId = movieUrl.split("/").pop();
          try {
            const movieResponse = await this.api.get(
              `${this.baseURL}/movies/${movieId}`,
              {
                headers: {
                  Accept: "application/ld+json",
                },
              }
            );
            return movieResponse.data;
          } catch (error) {
            console.error(`Error fetching movie ${movieId}:`, error);
            return null;
          }
        })
      );

      return {
        ...categoryData,
        movies: movies.filter((movie) => movie !== null),
      };
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  }

  async createCategory(category) {
    try {
      const response = await this.api.post(
        `${this.baseURL}/categories`,
        category,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/ld+json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async updateCategory(id, category) {
    try {
      const response = await this.api.put(
        `${this.baseURL}/categories/${id}`,
        category,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/ld+json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  }

  async deleteCategory(id) {
    try {
      await this.api.delete(`${this.baseURL}/categories/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}

export default new CategoryService();
