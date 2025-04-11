import axios from "axios";
axios.defaults.timeout = 60000;

type requestParams = {
    method: string,
    url: string,
    formData?: any,
    headers?: Record<string, any>,
    callback?: (arg: any)=>any,
    onError?: (arg: any)=>any,
    cacheKey?: string|boolean,
};

/*
export const request = async ({method, url, formData, headers, callback, onError}: requestParams)=>{
    //console.log({method, url, formData, headers});
    headers = {
        'Accept': 'application/json',
        ...headers
    };

    // Make HTTP request
    try {
        let response = await axios({
                                        method: method,
                                        url: url,
                                        ...((typeof formData === 'undefined' || !formData)? {} : {data: formData}), 
                                        headers: headers
                                   });
        const responseData = response.data;
        //console.log(responseData);
        if (responseData.status == 'success') {
            if (typeof callback === 'function') callback( responseData );
            return responseData;
        }
        else {
            throw responseData;
        }
    } catch(err: any) {
        const stdErr = {
            status: 'error',
            message: (typeof err.response !== 'undefined'? err.response.data.message : null) || err.message ||  err.toString(),
            code: (typeof err.response !== 'undefined'? err.response.data.code : null) || err.code || -1,
        };

        if (typeof onError === 'function') onError(stdErr);
        
        return stdErr;
    }
};
*/

const cache = new Map();

export const request = async ({ method, url, formData, headers, callback, onError, cacheKey = false }: requestParams) => {
    headers = {
        Accept: 'application/json',
        ...headers,
    };

    const now = Date.now();

    // Check if response is cached and still valid
    if (cache.has(cacheKey) && method.toLowerCase() == "get" && cacheKey) {
        const { timestamp, data } = cache.get(cacheKey);
        const cacheLifespan = 15 * 60 * 1000; // Cache lifespan of 15 minutes
        if (now - timestamp < cacheLifespan) {
            if (typeof callback === 'function') callback(data);
            return data;
        } else {
            // Cache expired
            cache.delete(cacheKey);
        }
    } else {
        cacheKey = false;
    }

    // Make HTTP request
    try {
        console.log(`request: ${method} ${url}`);
        const response = await axios({
            method,
            url,
            ...(formData ? { data: formData } : {}),
            headers,
        });
        const responseData = response.data;

        if (responseData.status === 'success') {
            // Cache successful response
            if (cacheKey) cache.set(cacheKey, { timestamp: now, data: responseData });

            if (typeof callback === 'function') callback(responseData);
            return responseData;
        } else {
            throw responseData;
        }
    } catch (err: any) { console.log(err);
        const stdErr = {
            status: 'error',
            message:
                (err.response?.data?.message ?? null) ||
                err.message ||
                err.toString(),
            code: err.response?.data?.code ?? err.code ?? -1,
        };

        if (typeof onError === 'function') onError(stdErr);

        return stdErr;
    }
};

// Function to clear the cache
export const clearCache = (cacheKey?: string) => {
    if (cacheKey) {
        cache.delete(cacheKey);
        return;
    }
    cache.clear();
};
