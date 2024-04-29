import jwt from '@tsndr/cloudflare-worker-jwt'

export async function handleVerifyRequest(request: Request, env: Env) {
    const token = request.headers.get('Authorization');

    if (!token) {
        return false;
    } else {
        return await jwt.verify(token, `${env.SECRET_KEY}`);
    }
}