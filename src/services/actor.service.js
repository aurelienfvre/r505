import axios from "axios";
import AuthService from "./auth.service";

class ActorService {
  constructor() {
    this.api = axios;
    this.baseURL = "http://symfony.mmi-troyes.fr:8319/api";
  }

  getHeaders(isPatch = false) {
    const token = AuthService.getToken();
    return {
      Accept: "application/ld+json",
      "Content-Type": isPatch
        ? "application/merge-patch+json"
        : "application/json",
      Authorization: token ? `Bearer ${token}` : null,
    };
  }

  async getAllActors() {
    try {
      let allActors = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.api.get(`${this.baseURL}/actors`, {
          headers: this.getHeaders(),
          params: {
            page: page,
            itemsPerPage: 30,
          },
        });

        const actors = response.data["hydra:member"];
        allActors = [...allActors, ...actors];

        const hasNext =
          response.data["hydra:view"] &&
          response.data["hydra:view"]["hydra:next"];

        if (!hasNext || actors.length === 0) {
          hasMore = false;
        } else {
          page++;
        }

        console.log(
          `Loaded page ${page - 1} with ${actors.length} actors. Total: ${
            allActors.length
          }`
        );
      }

      return allActors;
    } catch (error) {
      console.error("Error fetching actors:", error);
      throw error;
    }
  }

  async getActor(id) {
    try {
      const response = await this.api.get(`${this.baseURL}/actors/${id}`, {
        headers: this.getHeaders(),
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching actor:", error);
      throw error;
    }
  }

  async createActor(actorData) {
    try {
      const formattedActor = {
        firstname: actorData.firstname,
        lastname: actorData.lastname,
        dob: actorData.dob,
        nationality: actorData.nationality,
        gender: actorData.gender,
        media: actorData.media || null,
        awards: actorData.awards ? parseInt(actorData.awards) : 0,
        bio: actorData.bio || null,
        deathDate: actorData.deathDate || null,
      };

      const response = await this.api.post(
        `${this.baseURL}/actors`,
        formattedActor,
        {
          headers: this.getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating actor:", error);
      throw error;
    }
  }

  async updateActor(id, actorData) {
    try {
      console.log("Updating actor with data:", actorData);
      const formattedActor = {
        firstname: actorData.firstname,
        lastname: actorData.lastname,
        dob: actorData.dob,
        nationality: actorData.nationality,
        gender: actorData.gender,
        media: actorData.media,
        awards: actorData.awards ? parseInt(actorData.awards) : null,
        bio: actorData.bio,
        deathDate: actorData.deathDate,
      };
      Object.keys(formattedActor).forEach((key) => {
        if (formattedActor[key] === undefined || formattedActor[key] === null) {
          delete formattedActor[key];
        }
      });

      console.log("Formatted data for update:", formattedActor);
      const response = await this.api.patch(
        `${this.baseURL}/actors/${id}`,
        formattedActor,
        {
          headers: this.getHeaders(true),
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error updating actor:", error);
      throw error;
    }
  }

  async deleteActor(id) {
    try {
      await this.api.delete(`${this.baseURL}/actors/${id}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      console.error("Error deleting actor:", error);
      throw error;
    }
  }
}

export default new ActorService();
