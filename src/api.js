// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders('text/plain'),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    //console.log('Got user fragments data', data );
    return data
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getUserFragmentsWithId(id, user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders('text/plain'),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    //const data = await res.json();
    const data = await res.text();
    console.log('Got user fragment with Id', { data });
    console.log('Got user fragment with Id data.');
    return data
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${id}`, err);
  }
}

export async function postUserFragments(postInput, user) {
  console.log('Posting user fragments data...', postInput)
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders('text/plain'),
      body: postInput
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res}`)
    }
    const data = await res.json();
    console.log('Got user fragments data', data )
    //await getUserFragmentsWithId(data.fragment.id, user)
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err })
  }
}