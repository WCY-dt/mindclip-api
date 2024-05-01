export default function createResponse(body: string | object, status: number) {
    // console.log(body);
    // console.log(status);
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Content-Type-Options',
		'Access-Control-Allow-Credentials': 'true',
		'Access-Control-Max-Age': '3600',
        'X-Content-Type-Options': 'nosniff',
    };

    return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers });
}
