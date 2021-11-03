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
import {
    OpenHighLowVolume,
    OpenHighLowVolumeFromJSON,
    OpenHighLowVolumeFromJSONTyped,
    OpenHighLowVolumeToJSON,
} from './';

/**
 * 
 * @export
 * @interface IntradayDataPoint
 */
export interface IntradayDataPoint {
    /**
     * 
     * @type {number}
     * @memberof IntradayDataPoint
     */
    timestamp?: number;
    /**
     * 
     * @type {OpenHighLowVolume}
     * @memberof IntradayDataPoint
     */
    ohlv?: OpenHighLowVolume;
}

export function IntradayDataPointFromJSON(json: any): IntradayDataPoint {
    return IntradayDataPointFromJSONTyped(json, false);
}

export function IntradayDataPointFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntradayDataPoint {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'timestamp': !exists(json, 'timestamp') ? undefined : json['timestamp'],
        'ohlv': !exists(json, 'ohlv') ? undefined : OpenHighLowVolumeFromJSON(json['ohlv']),
    };
}

export function IntradayDataPointToJSON(value?: IntradayDataPoint | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'timestamp': value.timestamp,
        'ohlv': OpenHighLowVolumeToJSON(value.ohlv),
    };
}

