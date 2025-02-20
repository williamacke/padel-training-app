import axios from "axios";

interface CourtSchedule {
  court_id: string;
  court_name: string;
  slots: Array<{
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class TennisVlaanderenService {
  private authUrl = "https://elit.tennisvlaanderen.be/ords/ace/oauth/token";
  private baseUrl = "https://elit.tennisvlaanderen.be/ords/ace/v4";
  private accessToken: string | null = null;

  constructor(private clientId: string, private clientSecret: string) {}

  async getAvailableCourts(
    clubNumber: string,
    reservationKey: string
  ): Promise<any> {
    try {
      if (!this.accessToken) {
        this.accessToken = await this.getNewToken();
      }

      const url = `${this.baseUrl}/reservation/available_courts`;
      console.log("Getting available courts from:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params: {
          reservation_key: reservationKey,
          club_number: clubNumber,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Available courts request failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async getDailySchedule(
    clubNumber: string,
    reservationKey: string,
    day?: string
  ): Promise<any> {
    try {
      if (!this.accessToken) {
        this.accessToken = await this.getNewToken();
      }

      const url = `${this.baseUrl}/reservation/daily_schedule`;
      console.log("Getting daily schedule from:", url);

      const params: any = {
        reservation_key: reservationKey,
        club_number: clubNumber,
      };

      if (day) {
        params.day = day;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params,
      });

      return response.data;
    } catch (error: any) {
      console.error(
        "Daily schedule request failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  private async getNewToken(): Promise<string> {
    try {
      console.log("Requesting new token...");

      const response = await axios.post(
        this.authUrl,
        "grant_type=client_credentials",
        {
          auth: {
            username: this.clientId,
            password: this.clientSecret,
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error(
        "Token request failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  formatDate(date: Date): string {
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "/");
  }
}
