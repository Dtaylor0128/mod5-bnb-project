import Cookies from 'js-cookie';


export async function csrfFetch(url, options) {
    //set options.method to 'GET' if there is no method
    if (options) {
        options.method = options.method || 'GET';
        // set options.headers to an empty object if no headers exists
        options.headers = options.headers || {};

        // if the options.method in not 'GET', then set the "Content-type" to header
        // "application/json", and set the "XSRF-TOKEN" header to the value of the
        // "XSRF-TOKEN" cookie
        if (options.method.toUpperCase() !== 'GET') {
            options.headers['Content-Type'] =
                options.headers['Content-Type'] || 'application/json';
            options.headers['XSRF-Token'] = Cookies.get('XSRF-TOKEN');
        }

    }

}