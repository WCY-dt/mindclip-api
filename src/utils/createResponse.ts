export default function createResponse(body: string | object, status: number) {
    console.log(body);
    console.log(status);
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'X-Content-Type-Options': 'nosniff',
    };

    return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers });
}