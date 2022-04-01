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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface OpenHighLowVolume
 */
export interface OpenHighLowVolume {
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    open?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    openConverted?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    high?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    highConverted?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    low?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    lowConverted?: number;
    /**
     * 
     * @type {number}
     * @memberof OpenHighLowVolume
     */
    volume?: number;
    /**
     * 
     * @type {string}
     * @memberof OpenHighLowVolume
     */
    currency?: string | null;
    /**
     * 
     * @type {string}
     * @memberof OpenHighLowVolume
     */
    convertedCurrency?: string;
}

export function OpenHighLowVolumeFromJSON(json: any): OpenHighLowVolume {
    return OpenHighLowVolumeFromJSONTyped(json, false);
}

export function OpenHighLowVolumeFromJSONTyped(json: any, ignoreDiscriminator: boolean): OpenHighLowVolume {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'open': !exists(json, 'open') ? undefined : json['open'],
        'openConverted': !exists(json, 'openConverted') ? undefined : json['openConverted'],
        'high': !exists(json, 'high') ? undefined : json['high'],
        'highConverted': !exists(json, 'highConverted') ? undefined : json['highConverted'],
        'low': !exists(json, 'low') ? undefined : json['low'],
        'lowConverted': !exists(json, 'lowConverted') ? undefined : json['lowConverted'],
        'volume': !exists(json, 'volume') ? undefined : json['volume'],
        'currency': !exists(json, 'currency') ? undefined : json['currency'],
        'convertedCurrency': !exists(json, 'convertedCurrency') ? undefined : json['convertedCurrency'],
    };
}

export function OpenHighLowVolumeToJSON(value?: OpenHighLowVolume | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'open': value.open,
        'openConverted': value.openConverted,
        'high': value.high,
        'highConverted': value.highConverted,
        'low': value.low,
        'lowConverted': value.lowConverted,
        'volume': value.volume,
        'currency': value.currency,
        'convertedCurrency': value.convertedCurrency,
    };
}

