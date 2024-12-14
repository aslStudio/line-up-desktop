import { SuggestionsResponse } from "@/types";
import axios, { AxiosResponse } from "axios";

export const getSuggestions = async (query: string): Promise<SuggestionsResponse> => {
  return (
    await axios.post<string, AxiosResponse<SuggestionsResponse>>(
      "http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      { query },
      {
        headers: {
          Authorization: "Token " + process.env.REACT_APP_DADATA_TOKEN,
        },
      }
    )
  ).data;
};
