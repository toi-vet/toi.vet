/* tslint:disable */
/* eslint-disable */
/**
 * Toi.Backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    StockInfo,
    StockInfoFromJSON,
    StockInfoToJSON,
} from '../models';

export interface StockInfoGetRequest {
    symbol?: string;
    toCurrency?: string;
}

/**
 * 
 */
export class StockInfoApi extends runtime.BaseAPI {

    /**
     */
    async stockInfoGetRaw(requestParameters: StockInfoGetRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<StockInfo>> {
        const queryParameters: any = {};

        if (requestParameters.symbol !== undefined) {
            queryParameters['symbol'] = requestParameters.symbol;
        }

        if (requestParameters.toCurrency !== undefined) {
            queryParameters['toCurrency'] = requestParameters.toCurrency;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/StockInfo`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => StockInfoFromJSON(jsonValue));
    }

    /**
     */
    async stockInfoGet(requestParameters: StockInfoGetRequest, initOverrides?: RequestInit): Promise<StockInfo> {
        const response = await this.stockInfoGetRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
